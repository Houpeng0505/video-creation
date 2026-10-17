---
name: science-motion
description: Style-agnostic AI production guidance for science and educational animation, including storyboard, Remotion/SVG examples, audio and iterative QA.
---

# Science Motion Skill

## Art direction is project-specific
There is NO required Chinese aesthetic, four-color palette, cinematic treatment, continuous camera, SVG geometry or prohibition on slide-style cuts.
Determine art direction from the specific story, target viewers, user preferences and distribution format. Refer to docs/STYLE_SYSTEM.md.
Existing `content/film.json` and `src/ScienceFilm.tsx` are ONE dark-ink 9:16 **demo**, not a template that every future project must imitate.
Do not make unrelated topics look alike unless the user requests a consistent series identity.

## Design and narrative
- Write the intended takeaway of each scene and how the visual communicates it.
- Decide scene-to-scene motion according to meaning: persistent objects can morph or move; purposeful hard cuts, cards and staged slides are also acceptable.
- Use accurate diagrams with aligned nodes, connected anchors, readable labels and no false relationships.
- Select fonts, colors, level of detail and graphic style for the individual video, maintaining hierarchy and contrast.
- Set canvas width/height, aspect ratio, layout grid and subtitle safe area *per composition*, including required platform UI overlays.
- Time each spoken segment to a narration cue; account for pacing and on-screen reading time.

## Animation
- Remotion is the default proven renderer for code-driven projects; specialized Manim, Motion Canvas, Blender, 3D and image/video workflows may be used as content requires.
- Prefer deterministic frame-based animation for reproducible GitHub Actions renders.
- Inspect intermediate frames during movement, not only initial/final poses.
- Do not replace deliberate artistic choices with generic automated transitions.

## Default creative tradeoff for code-generated films

When rich rigged assets or higher-density illustration are unavailable, **trade vector detail for motion quality and meaning density**. Favor a stable small visual vocabulary—stick figures, simple shapes, lines, arrows, grids, timelines and meaningful symbols—when it can communicate the thesis. This is an intentional production optimization, not a lower artistic bar.

Animation priority order: (1) semantic clarity with narration; (2) cause/effect and object continuity; (3) fluid timing with purposeful camera/editorial movement; (4) graphic consistency/readability; (5) optional decoration and microdetail.

For every narration beat require:
- One visible **action or transformation** (not only a title or moving decorative particles).
- Explicit *before → causal action → after* state and on-screen evidence understandable without captions.
- Onset and completion times within the spoken cue; explain why its camera move or cut preserves clarity.
- Identified persistent objects, anchor constraints, and objective tests (e.g. stone moves downhill exactly when voice says “滚落”, choice represented by step, no unrelated close-up).
- Smooth eased motion, not continuous restless movement. Pauses are legitimate when intentional and serving comprehension.

First render a short animatic, check the complete shot list and at least 0.2–0.5s transition strips. Reject films with many "nominal shots" but little semantic change. Increase vector complexity only if the story demonstrably benefits from it.

## Rendering QA
1. Typecheck/probe and verify source timings before rendering.
2. Use local assets with verified ownership/licenses.
3. Review a contact sheet, key moments AND representative transition frames, including on-screen composition and typography.
4. Repair overlapping captions, clipped objects, unintended layer order, abrupt transitions and sync issues. Rerender; visually inspect again.
5. Verify video/audio codecs and duration with ffprobe. Technical success never substitutes for visual review.
6. Distinguish a technical smoke test from a finished publishable video.

## Audio
Create the score according to the project's desired emotional arc, not a universal "guqin" sound.
Generate music separately from muxing; record license/model provenance for all audio assets.
Mix for intelligible dialogue, with sidechain ducking as appropriate. Inspect audio transitions and ending fades.
Cloud standard runners handle rendering/mixing; run large generative models locally or on a dedicated GPU runner.

## Agent behavior
One write agent; Actions reads/validates. Never commit tokens, passwords, model weights, copyrighted media without permission or private recordings.
Report only checks and artifacts actually completed.
