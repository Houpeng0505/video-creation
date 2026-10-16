#!/usr/bin/env python3
"""Structural QA + basic decoded-frame motion + media probe.
Not a substitute for watching the output and manually checking layout.
"""
import argparse
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageChops


def validate_content(path: Path) -> dict:
    cfg = json.loads(path.read_text(encoding="utf-8"))
    duration = cfg["durationSeconds"]
    assert 3 <= duration <= 600, "Unreasonable duration"
    assert cfg["fps"] == 30, "Expected fixed 30 fps"
    safe = cfg["subtitleSafeArea"]
    assert 0 <= safe["left"] < 540 < 1080-safe["right"], "Bad horizontal subtitle safe area"
    assert 1500 <= safe["top"] < safe["bottom"] <= 1830, "Subtitle safe area intrudes"
    previous_end = 0.0
    for cue in cfg["captions"]:
        assert previous_end <= cue["start"] < cue["end"] <= duration, f"Overlapping/out-of-range caption: {cue}"
        assert len(cue["text"]) <= 22, f"Caption needs shortening: {cue['text']}"
        previous_end = cue["end"]
    print(f"PASS content schema: {len(cfg['captions'])} nonoverlapping captions")


def probe(path: Path) -> dict:
    raw = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)
    ], text=True)
    return json.loads(raw)


def validate_media(path: Path, duration: float) -> None:
    data = probe(path)
    vs = [s for s in data["streams"] if s["codec_type"] == "video"]
    a = [s for s in data["streams"] if s["codec_type"] == "audio"]
    assert len(vs) == 1 and len(a) >= 1, "Missing video or sound"
    video = vs[0]
    assert video["codec_name"] == "h264", "Expected H264 video"
    assert int(video["width"]) * 16 == int(video["height"]) * 9, "Expected 9:16 aspect ratio"
    assert abs(float(data["format"]["duration"]) - duration) < 1.0, "Video duration mismatch"
    print(f"PASS media probe: {video['width']}x{video['height']} {duration:.1f}s, H264+audio")


def inspect_motion(movie: Path, output: Path):
    output.mkdir(parents=True, exist_ok=True)
    snaps = []
    for second in (2, 7, 12, 17, 22):
        image = output / f"at-{second:02d}s.png"
        subprocess.check_call([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", str(second),
            "-i", str(movie), "-frames:v", "1", str(image)
        ])
        snaps.append(Image.open(image).convert("RGB"))
    for i in range(1, len(snaps)):
        delta = ImageChops.difference(snaps[i-1], snaps[i]).getbbox()
        assert delta is not None, "Two sample frames are completely identical"
    print("PASS frame samples differ (not proof of layout correctness)")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--config", type=Path, default=Path("content/film.json"))
    p.add_argument("--video", type=Path)
    p.add_argument("--frames-dir", type=Path, default=Path("out/keyframes"))
    a = p.parse_args()
    config = validate_content(a.config)
    if a.video:
        validate_media(a.video, config["durationSeconds"])
        inspect_motion(a.video, a.frames_dir)
