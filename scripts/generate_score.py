#!/usr/bin/env python3
"""Deterministic original placeholder score, NOT AI-generated music.
Replace with a properly licensed AI-generated WAV for publishing.
"""
import argparse
import wave
from pathlib import Path
import numpy as np


def render(duration: float, path: Path, rate: int = 32000) -> None:
    if not 2 <= duration <= 600:
        raise ValueError("duration must be between 2 and 600 seconds")
    n = int(duration * rate)
    t = np.arange(n, dtype=np.float64) / rate
    out = np.zeros(n, dtype=np.float64)
    # D minor pentatonic: D F G A C; arranged as a quiet evolving underscoring.
    degrees = [146.83, 174.61, 196.00, 220.00, 261.63]
    chords = [[0, 2, 4], [1, 3, 4], [0, 2, 3], [0, 1, 4]]
    for section in range(int(np.ceil(duration / 6))):
        start = section * 6.0
        mask = (t >= start) & (t < min(duration, start + 6.2))
        local = t[mask] - start
        fadein = np.minimum(1.0, local / 2.0)
        fadeout = np.minimum(1.0, np.maximum(0, (duration - t[mask]) / 3.0))
        chord = chords[section % len(chords)]
        for d in chord:
            hz = degrees[d] / 2.0
            out[mask] += 0.017 * fadein * fadeout * (
                np.sin(2 * np.pi * hz * local) + 0.19 * np.sin(4 * np.pi * hz * local)
            )
    # Guqin-like plucked tones. Avoid rhythmic masking under dialogue.
    for k, start in enumerate(np.arange(0.65, duration, 1.65)):
        note = degrees[[0, 2, 4, 3, 1, 2, 0, 4][k % 8]]
        begin, end = int(start * rate), min(n, int((start + 1.4) * rate))
        local = np.arange(end - begin) / rate
        env = np.exp(-3.2 * local) * (1 - np.exp(-65 * local))
        out[begin:end] += 0.075 * env * (
            np.sin(2 * np.pi * note * local)
            + 0.28 * np.sin(2 * np.pi * note * 2.01 * local)
            + 0.09 * np.sin(2 * np.pi * note * 3.99 * local)
        )
    # Soft shimmer and long opening/closing fades.
    rng = np.random.default_rng(1212)
    hush = rng.normal(0, 1, n)
    hush = np.convolve(hush, np.ones(350) / 350, mode="same")
    out += 0.012 * hush
    fade = np.minimum(1, t / 1.2) * np.minimum(1, (duration - t) / 1.5)
    out *= np.clip(fade, 0, 1)
    # Quiet left/right spatialization with deterministic delay.
    delay = int(rate * 0.011)
    left = out
    right = np.concatenate([np.zeros(delay), out[:-delay]]) * 0.98
    stereo = np.column_stack([left, right])
    max_peak = max(1e-8, np.max(np.abs(stereo)))
    stereo = np.clip(stereo / max(1, max_peak / 0.76), -1, 1)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())
    print(f"Generated deterministic original {duration:.1f}s placeholder score -> {path}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--duration", type=float, default=25)
    p.add_argument("--output", type=Path, default=Path("out/music.wav"))
    a = p.parse_args()
    render(a.duration, a.output)
