# Video Creation — Working Instructions for Agents

This is the only write target for video production code, custom skills, sound design, scripts, QA and GitHub Actions.
Never write video artifacts or workflows into unrelated repositories (e.g. OrthoKB).

## Mandatory process
1. Interpret the factual thesis; confirm the source and the intended audience.
2. Storyboard as a *continuous spatial world* with visual cause and effect, not slide transitions.
3. Design at 1080×1920 logical SVG coordinates; respect 9:16 layout and subtitle safe area.
4. Use Remotion frame-driven animation (no CSS animations/transitions).
5. Prepare authorized/licensed voice and music sources; record provenance.
6. Render, sample >=5 keyframes, inspect contact sheet and motion across transitions.
7. Repair text collisions, off-screen geometry, timing, abrupt cuts and subtitle overlap.
8. Rerender and inspect again; deliver only a visually inspected run artifact.
9. GitHub Actions is read-only with respect to Git contents; agents edit source on one branch only.

## Creative direction
Dark ink / bronze / rice-paper highlights, restrained 4-color design.
Camera continuity; graph morphs, flowing geometry and evolving scientific diagrams.
Avoid 'dynamic PowerPoint' cards and unrelated decoration.
Use enough visual explanation to justify each transition.

## Source of truth
- src/: frame-based geometry and compositions
- content/: scripts/cue timelines/metadata
- public/audio/: optional authorized narration (not tracked by default)
- scripts/: rendering, music, mixing and verification
- .agents/skills/: repository-local instructions for coding agents
- .github/workflows/: reproducible rendering/QA
- out/: generated artifacts, never committed

Read .agents/skills/science-motion/SKILL.md before producing any video.
For Remotion upstream guidance: https://github.com/remotion-dev/skills
