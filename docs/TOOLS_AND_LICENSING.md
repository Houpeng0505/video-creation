# Reviewed upstream projects (2026-10-16)

| Project | Usage | Caveat |
| --- | --- | --- |
| https://github.com/remotion-dev/skills | Official agent guidance for Remotion | Reference it; install via project-scoped skills command, do not confuse it with runtime plugin. |
| https://github.com/remotion-dev/remotion | Main movie/React engine | Free eligible individuals and companies of 3 or fewer people; company license at larger size. |
| https://github.com/motion-canvas/motion-canvas | Generator-based vector explanatory animations | Good specialized secondary engine, not needed for current smoke test. |
| https://github.com/ManimCommunity/manim | Math and mathematical scene rendering | Add only for relevant physics/math sequences. |
| https://github.com/ace-step/ACE-Step-1.5 | Local GPU music generation candidate | MIT code does not settle all *weights/output* rights: confirm exact model and use terms. |
| https://github.com/elvisxu/yue | Advanced song generation/editing | YuE2 personal creator/commercial company rights differ. |
| https://github.com/facebookresearch/audiocraft | MusicGen research | Published model weights CC BY-NC, so do not default to monetized content. |
| https://github.com/index-tts/index-tts | Expressive Chinese narration | Has bilibili model-use terms beyond a simple OSS code license; commercial use must be checked. |
| https://github.com/hexgrad/kokoro | Lightweight local voice model | Verify specific Chinese voice asset, phonemizer and version licenses. |
| https://github.com/FunAudioLLM/CosyVoice | Alternative Mandarin TTS | Verify current model weights and use terms. |

## Agent Skills installation for authors (local or self-hosted coding agent)
```bash
npx -y skills@latest add remotion-dev/skills -y
```
Review upstream code/version and lock it before unattended installation. Skills are **instructions**: installing them on a GitHub runner does not magically extend the ChatGPT sandbox or enable a GPU.

## Copyright, sources, credentials
- Record source, license, creator and model version for all assets before public release.
- Keep API keys in repository secrets, only granting access to explicitly trusted jobs. Never commit tokens, licensed music or personal speech recordings without authorization.
- Do not use unauthorized celebrity-voice cloning or copyright-style mimicry.
