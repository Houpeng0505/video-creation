#!/usr/bin/env python3
"""Local ACE-Step 1.5 REST client: asynchronous music generation to WAV.

Requires an already running ACE-Step API server (usually local port 8001).
This tool does not install models, invoke GPU inference in GitHub Actions,
or grant commercial rights to generated audio.
"""
import argparse
import json
import os
from pathlib import Path
import time
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


def request_json(base, path, payload=None, token=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = Request(urljoin(base + "/", path.lstrip("/")), data=data)
    req.add_header("Accept", "application/json")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    with urlopen(req, timeout=45) as res:
        obj = json.load(res)
    if obj.get("code") != 200:
        raise RuntimeError(f"ACE-Step service error: {obj.get('error') or obj}")
    return obj["data"]


def result_audio_path(record):
    if record.get("status") != 1:
        raise RuntimeError(f"Music task not successful: {record}")
    entries = record.get("result")
    entries = json.loads(entries) if isinstance(entries, str) else entries
    if not isinstance(entries, list) or not entries:
        raise RuntimeError("ACE-Step returned no audio files")
    path = entries[0].get("file", "")
    if not path.startswith("/v1/audio?"):
        raise RuntimeError(f"Unexpected audio path from provider: {path!r}")
    return path, entries[0]


def generate(base, prompt, output, duration, bpm, token, timeout, thinking):
    host = urlparse(base)
    if host.scheme not in ("http", "https") or not host.netloc:
        raise ValueError("ACE-Step URL must be HTTP(S)")
    # Keep this a local workstation integration, not a web-exposed public service.
    if host.hostname not in ("localhost", "127.0.0.1", "::1"):
        raise ValueError("Refusing remote ACE-Step server. Start it on localhost; do not expose your GPU API to the internet.")
    if not (10 <= duration <= 600 and 30 <= bpm <= 300):
        raise ValueError("Invalid duration or BPM")
    data = request_json(base, "/release_task", {
        "prompt": prompt,
        "lyrics": "[Instrumental]",
        "audio_duration": duration,
        "bpm": bpm,
        "key_scale": "D minor",
        "audio_format": "wav",
        "batch_size": 1,
        "thinking": bool(thinking),
        "use_random_seed": True
    }, token)
    task_id = data["task_id"]
    print(f"ACE-Step task submitted: {task_id}")
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        items = request_json(base, "/query_result", {"task_id_list": [task_id]}, token)
        row = next((i for i in items if i.get("task_id") == task_id), None)
        if row and row.get("status") == 2:
            raise RuntimeError(f"ACE-Step generation failed: {row}")
        if row and row.get("status") == 1:
            audio_path, meta = result_audio_path(row)
            req = Request(urljoin(base + "/", audio_path.lstrip("/")))
            if token:
                req.add_header("Authorization", "Bearer " + token)
            output.parent.mkdir(parents=True, exist_ok=True)
            total = 0
            with urlopen(req, timeout=60) as res, output.open("wb") as f:
                while chunk := res.read(1024 * 1024):
                    total += len(chunk)
                    if total > 150 * 1024 * 1024:
                        raise RuntimeError("Output too large")
                    f.write(chunk)
            (output.with_suffix(".json")).write_text(
                json.dumps({"source": "ACE-Step 1.5 local", "prompt": prompt, "metadata": meta}, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"AI soundtrack downloaded: {output} ({total} bytes)")
            return
        time.sleep(2.0)
    raise TimeoutError("ACE-Step generation timed out")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--url", default="http://127.0.0.1:8001")
    p.add_argument("--prompt-file", type=Path, default=Path("content/music_prompt.txt"))
    p.add_argument("--output", type=Path, default=Path("out/music-generated.wav"))
    p.add_argument("--duration", type=int, default=25)
    p.add_argument("--bpm", type=int, default=72)
    p.add_argument("--timeout", type=int, default=900)
    p.add_argument("--thinking", action="store_true", help="Enable LM planning (increases VRAM)")
    a = p.parse_args()
    generate(a.url.rstrip("/"), a.prompt_file.read_text(encoding="utf-8").strip(), a.output,
             a.duration, a.bpm, os.getenv("ACESTEP_API_KEY"), a.timeout, a.thinking)
