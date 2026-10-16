# Audio production and model integrations

## Music first: ACE-Step 1.5

**Division of labor:** the workstation GPU *generates* music, the GitHub hosted runner *mixes* music and renders video. This prevents GPU dependencies from breaking ordinary builds.

On the user's Windows workstation with CUDA and Python 3.11 or 3.12, follow upstream setup:

```powershell
git clone https://github.com/ace-step/ACE-Step-1.5.git vendor/ACE-Step-1.5
cd vendor/ACE-Step-1.5
uv sync
uv run acestep-api
```

Return to the **video-creation** repo in another terminal:

```powershell
python scripts/music_acestep.py --prompt-file content/music_prompt.txt --duration 25 --output out/music-generated.wav
```

This script calls the official `/release_task`, `/query_result`, `/v1/audio` endpoints, waits for result and saves provenance JSON. Requires ACE-Step running on `http://localhost:8001` and accepts optional `ACESTEP_API_KEY` environment variable. It deliberately refuses remote URLs.

For GPUs around 6–8GB, upstream suggests the 2B turbo model with 0.6B LM on PT backend, possibly with offload. Initial synthesis without `--thinking` is less memory-intensive; test quality and memory. Model installations and full audio generation have **not** been executed here.

**Music cue design:** (1) opening suspense pad, (2) restrained explanatory plucked motifs, (3) conclusion harmonic resolution. Generated music must avoid vocals, keep a clear midrange for narration and fade at the ending. The prompt is stored in `content/music_prompt.txt`.

To use the finished track in cloud rendering, **only after checking the license**, copy it to `assets/audio/music.wav` and commit it. This is a public repository. If confidentiality/rights matter, keep it local and mix without committing.

## Mandarin narration

Candidate models: IndexTTS2.5 (expressive Chinese, check bilibili model license), Kokoro (lightweight, verify Mandarin-specific weights), CosyVoice (research alternate). Separate local model setup from render runner. Export normalized mono/stereo `narration.wav` after pronunciation and emotional tone checks.

- Cloud mode: authorized public audio at `assets/audio/narration.wav` (do not upload personal/private recordings).
- Local private mode: store untracked audio at `public/audio/narration.wav` and pass that path as the optional fourth argument to `bash scripts/mix_audio.sh`.
- Narration is optional for smoke tests. A video with no narration is a technical preview, *not* a complete publishable explainer.

## License/credit checklist

Before publishing: record prompt/source, original artist/model/weights version, relevant model/output license, permissions to distribute, whether reference audio was used, proof of consent for cloned voice, and review of similarity to recognizable tracks. The ACE-Step repository's code MIT license is not a blanket warranty about copyrightability or commercial rights for model output.

## Signal chain

Music WAV → speech-aware sidechain compressor → narration mix → loudness normalization → AAC 192kbps. Avoid excessively strong BGM and clipped audio. Compare speech intelligibility on phone speakers.

## Recommended future tests

A/B music quality: procedural fallback vs ACE-Step generated vs licensed library track, holding the exact same 25s cut constant. Compare emotional continuity, sound design, dialogue intelligibility and rights.
