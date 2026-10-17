# Semantic-first 2D motion: our default under current GPT-6 coding limits

> Production decision (2026-10-17). In ChatGPT-driven video creation, increase **animation fluency and explanatory precision** by deliberately constraining drawing complexity. Do not confuse visual simplicity with low quality. A stick figure with strong staging can be superior to a poorly rigged anatomically detailed person.

## Clarify the actual optimization target

Old failure mode: hand-draw highly detailed people and rocks as vector paths; lack genuine rig/IK; a lot of static compositions and barely moving pieces; storyboard does not reflect narration; too much effort correcting anatomy/stone textures while film still fails to communicate.

New tradeoff:
- **Spend less** on densely textured vector illustration, anatomy, character facial microexpression, faux-3D details and gratuitous ornaments.
- **Spend more** on semantic story design, smooth and well-eased object transformations, memorable visual metaphors, camera and editorial rhythm, continuity, spoken-visual timing and systematic inspection.
- Graphic complexity and semantic complexity are different axes. Reduce the first without sacrificing the second.

## Shot contract: one claim = one visible idea

For each narration cue, write a scene contract with the fields:

```yaml
cue: "巨石就会轰然滚落，一切重新开始"
voice_interval: [18.0, 24.0]
concept: "人无法保留已取得的进展"
initial_state: "stick figure has almost reached mountain crest; rock to right"
action: "hands visibly release -> rock accelerates downhill -> path traces return loop"
end_state: "rock at bottom, hill ascent guide resets"
visible_event_time: [18.3, 22.8]
camera: "establish slope, follow falling rock, return to figure"
semantic_acceptance: "without subtitles, two viewers can identify falling, lost progress and reset"
continuity_constraints: ["rock and hands don't teleport", "rotation follows displacement"]
```

- **Staging first:** control attention with gesture, silhouette and paths; one main readable action per beat, with optional subordinate details.
- **Action over title:** significant nouns/verbs in narration must have a visual counterpart, especially transitions.
- **Causality over decoration:** connect scenes through shared visual objects, meaningful morphs, cause-and-effect or motivated cuts. A straight cut is sometimes better than a contrived geometric morph.
- **Selective stillness:** still shots are acceptable as a storytelling device, but not because we have not animated the key idea.
- **Simplicity is contextual:** use a stick figure when adequate; use scientific cutaways or realistic assets when factual fidelity requires them. Avoid enforcing a universal aesthetic.

## Animation architecture

Code-driven 2D is the preferred starting point for explainers: Remotion/Canvas/SVG or GSAP/HTML.
1. Keep objects in shared scene coordinates; drive every frame from deterministic time rather than independent ad-hoc tweens.
2. Define visible poses with explicit timeline and robust eased interpolation. Simple inverse-kinematics or two-segment limbs are sufficient if the pose reads.
3. Support camera translation/zoom and foreground/background layering only where they clarify spatial relation.
4. Key audio events (stone impact, decision, cut) to precise cue times. Keep captions in designated per-format safe area.
5. Animatic-first: make a 6–10s representative sample with continuous motion, then storyboard and test all beats before full-length high-quality render.

## Two mandatory QA gates

**Technical:** TS checks, valid cue timing, H.264/AAC, dimensions/duration, no black/corrupt frames, representative sample frames.

**Semantic/temporal:** watch or extract actual rendered footage:
- For every cue, compare audio segment, screenshot at beginning/middle/end, and frames around the main motion.
- Independently assess if the image conveys that specific narrated concept **without relying on subtitles**.
- Inspect 0.2–0.5 second intervals around releases, contacts, cuts and key gestures, not only a 5-frame contact sheet.
- Verify movement continuity and rhythm (no accidental teleporting, freezing, clipping, fake detail masking static action).
- Record concrete failures; fix, rerender and review. Do not mark complete based only on technical success.

## Practical Sisyphus stick-figure example

1. 0–2s: stick figure pushes an outlined circle up a line-drawn slope; step and rock rotation coupled.
2. 2–3s: a rising progress trace approaches 100%, hand contact releases.
3. 3–4.5s: circle *physically* rolls back; trace erases in the same direction.
4. 4.5–6s: camera widens: multiple faded loops appear as history, making perpetual repetition visually explicit.
5. 6–8s: figure stops, recognizes loop, chooses to step back toward stone; an alternative path glows, representing agency.

Compared to adding fingers, clothing or stone cracks, this design provides more story, clearer causality and more meaningful motion from fewer polygons. Use when the topic benefits; not a fixed style for all future films.
