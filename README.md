# Latest finished video — Sisyphus V3

**[▶ Direct MP4 download (90 seconds, Mandarin narration)](https://github.com/Houpeng0505/video-creation/releases/download/sisyphus-v3.0/Sisyphus-V3-90s.mp4)** · [14-scene storyboard contact sheet](https://github.com/Houpeng0505/video-creation/releases/download/sisyphus-v3.0/Sisyphus-V3-storyboard.jpg) · [GitHub Release fallback page](https://github.com/Houpeng0505/video-creation/releases/tag/sisyphus-v3.0)

V3 is the new semantic-first minimalist stick-figure treatment; V2 remains archived. Mobile H264/AAC-compatible, hosted as a Release asset rather than an expiring sandbox or Actions artifact. [Project production skill](.agents/skills/semantic-motion-director/SKILL.md) · [Method report](docs/SEMANTIC_WORKFLOW_V3.md)

# Video Creation Studio

Reusable AI-assisted science animation infrastructure: **Remotion + SVG + FFmpeg + GitHub Actions**.

## Start here
- [Production standards](AGENTS.md)
- [Pipeline and QA](docs/PIPELINE.md)
- [Music & voice integration](docs/AUDIO.md)
- [Tools and licenses](docs/TOOLS_AND_LICENSING.md)
- [Local AI animation skill](.agents/skills/science-motion/SKILL.md)

## Working pipeline (first verified run)
GitHub Actions renders the 25s animated film, mixes original test audio, validates subtitles and codecs, extracts keyframes, builds a contact sheet, and uploads a downloadable MP4 artifact. Verified green on [run 38900812597](https://github.com/Houpeng0505/video-creation/actions/runs/38900812597).

Start another run using [Actions / Render and inspect science film](https://github.com/Houpeng0505/video-creation/actions/workflows/render.yml) → **Run workflow**.

This demonstration is a smoke test, **not** an approved finished educational film.

## Use real music and narration
- Place authorized `assets/audio/music.wav` and/or `assets/audio/narration.wav` in the repository to opt into the respective audio tracks for cloud rendering. **The repository is public; never push confidential voice recordings or unlicensed music.**
- Generate AI music locally through the ACE-Step REST API with `python scripts/music_acestep.py` (see [audio guide](docs/AUDIO.md)). Then review and import the WAV if its rights allow distribution.
- The fallback `scripts/generate_score.py` is a deterministic procedural placeholder, not an AI music model.

## Local commands
```bash
npm install
python -m pip install -r requirements.txt
npx remotion browser ensure
npm run studio
# or:
python scripts/generate_score.py --duration 25 --output out/music.wav
npm run render
bash scripts/mix_audio.sh out/silent.mp4 out/music.wav out/final.mp4 assets/audio/narration.wav
python scripts/qc.py --video out/final.mp4
```

## Skills
Custom AI production skill is checked into `.agents/skills/science-motion/`.
To install the official Remotion Agent Skills into your **local clone of this same repository**, run `bash scripts/bootstrap_skills.sh`; review upstream and commit the versioned skill files you decide to vendor. Merely checking in a skill does not install tools inside ChatGPT or automatically make GitHub Actions an AI agent.
