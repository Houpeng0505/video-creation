---
name: semantic-motion-director
description: Plan and produce smooth, precise, semantic-first science and philosophy motion graphics with minimal vector shapes, Remotion and frame-strips review. Use when users ask for code-animated explainers, short-form philosophy videos or animation with limited illustration assets.
---

# Semantic Motion Director — local integration of open-source practices

Read in conjunction with AGENTS.md, docs/SEMANTIC_MOTION.md, and docs/SEMANTIC_WORKFLOW_V3.md.
External research: Motion Canvas for vector narrative; Remotion official Skills for caption timings, sequencing and eased transitions; HyperFrames for deterministic frame-by-frame rendering.
This skill is adapted guidance, not copied from upstream and not a claim that Motion Canvas is installed as our renderer.

## Preproduction: narrative is a functional specification
For every narration block specify: (1) one thesis; (2) visible verb/action and main object; (3) initial state + acted transformation + final state; (4) timestamp when the visible event must occur; (5) camera/transition rationale; (6) exact acceptance evidence. If a shot could be replaced by a still with its text changed, redesign it.

## Graphic budget
- Strong default for our current GPT/Remotion-only environment: minimal stick figures, geometric shapes, smooth curves, simple yet elegant color systems. This is an efficiency constraint, never a lower aesthetic or narrative bar.
- Avoid spending iteration budgets on fingers, skin, muscles, detailed clothes, stone textures, simulated 3D effects if they do not increase communication.
- Invest saved budget into motion arcs, independent story actions, timing, visual analogies, continuity and sound alignment.

## Execution
- Use a deterministic f(time): positions should be continuous; material objects should remain the same identity across related beats unless transition explicitly conveys a replacement.
- Tie coupled actions (hand pushes wheel, wheel rolls along incline, progress trace changes) to shared coordinates/phase.
- Design 6–10 second difficult beat first; test 30fps intermediate motion; use smooth(ease) and real pauses.
- Every scene should have a distinctly different compositional/semantic task. One sustained moving element can be good, but fourteen nominal shots of one static composition are not.

## QA — technical AND semantic
- Structural cue check; actual video/audio ffprobe; inspect all scene midshots and critical continuous strips at 0.2–0.5 second intervals.
- The agent must open actual decoded images. Check physical causality, caption safe area, text visibility, pop-in/out at fades, motion readability when subtitles hidden.
- Reports must distinguish automatic activity tests from real perceptual review. Fix specific issues then render again.
- Publish to a stable GitHub Release, not sandbox-only or 14-day Actions artifact.