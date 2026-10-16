---
name: science-motion
description: AI filmmaking guidance for connected Chinese motion-graphic explainers using Remotion, SVG and strict QA.
---

# Science Motion Skill

## Script and design
For every idea, write a visual state diagram with initial state, transformation, and conclusion.
Visual objects must *persist* across conceptual transitions. Morph, connect or move objects instead of swapping slides.
Every line must have a narrative reason, target coordinates, timing (seconds and frames), and visual explanation.
Use dark ink, warm ivory, patinated gold, muted green; no random accent colors.

## Geometry
Canonical design space is SVG viewBox 0 0 1080 1920. Reserve upper ~190px and bottom ~100px margins.
Subtitle safe rect: x 100..980 and y 1620..1800. Keep diagram labels and lines outside it.
No illegible 24px text; subtitle length ideally <=18 Hanzi per line. If longer, split into two timed cues.
Keep edge anchors on-screen during movement; inspect intermediate frames, not only cut boundaries.

## Rendering QA
1. Typecheck and verify timestamps before rendering.
2. Render with local assets only, never request unsourced remote copyrighted media inside the composition.
3. Inspect contact sheet *and* sample transitions. Check alignment, flow of meaning, subtitle collisions, clipping and flashes.
4. Fix specific defects; rerender; repeat QA until clean.
5. Run ffprobe to verify H264 audio/video/duration. A successful command is NOT proof of visual correctness.

## Audio
Generate score separately from final encoding. Never equate technical music generation with rights clearance.
Narration should remain intelligible (sidechain duck music under speech). Avoid clipping and abrupt audio boundaries.
Use auditable license/source notes for imported tracks and voice models.
GitHub-hosted standard runners are for CPU render/mix; use local GPU or paid GPU runner for generative music model inference.

## Agent behavior
A single agent writes code and assets; Actions reads and validates.
Never commit API secrets, model weights, tokenized URLs, generated private voice audio, or huge binaries.
Do not invent completion/QA results; cite run and artifact when actually verified.
