# Video production contract

## Current starter
A 25-second, 720×1280 vertical Remotion **demonstration** with a single evolving spatial diagram, timed Chinese caption cues and an original deterministic procedural music bed.

It is a technical integration test, not a fully narrated 2.5-minute science film and not a finished licensed AI music solution.

## Production pipeline
1. **Research** — verify scientific claims and assemble script.
2. **Storyboard** — visual anchors, transitions, positions and durations are specified in timeline data.
3. **Animate** — Remotion generates repeatable frames from React/SVG code, no CSS animation.
4. **Voice** — user-provided/authorized narration file in `public/audio/narration.wav`, or cloud TTS later with service approval.
5. **Score** — for smoke tests `scripts/generate_score.py` synthesizes an *original placeholder*; for production export a 44.1/48kHz WAV from ACE-Step or another licensed music provider and replace `out/music.wav` before mixing.
6. **Mix** — `scripts/mix_audio.sh` applies ducking when a narration file is present and loudness normalization.
7. **Render** — GitHub Actions builds H264 output and uploads video as an artifact, not Git binary.
8. **Inspect** — data checks, ffprobe, representative frame extraction and a contact sheet; human/vision inspection required for typography and transition correctness.
9. **Repair** — edit composition or timings in source, rerun and re-verify.

## Commands (local)
```bash
npm install
python -m pip install -r requirements.txt
npx remotion browser ensure
npm run typecheck
python scripts/qc.py --config content/film.json
python scripts/generate_score.py --duration 25 --output out/music.wav
npm run render
bash scripts/mix_audio.sh
python scripts/qc.py --video out/final.mp4
```

## Audio inputs
- Score: `out/music.wav` is generated for testing. Production score comes from a properly authorized music source.
- Narration: optional `public/audio/narration.wav`. This path is gitignored by default to avoid committing personal voice data.
- For Actions to access a private narration, add an authorized audio retrieval step with short-lived credentials, or use a dedicated artifact/source checkout. Do NOT hardcode credentials.

## Current limits
- No language model autonomously evaluates images; contact sheet must be visually reviewed.
- No external TTS service or GPU music generator is called in CI.
- 720×1280 is smoke quality, change Composition dimensions or Remotion CLI --scale for full-res.
- Importing music/voice into the workflow requires rights/provenance verification.
- Captions are data driven but this prototype uses a fixed spatial design; future projects can add named compositions and custom scene scripts.
