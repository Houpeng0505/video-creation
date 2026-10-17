# Video Creation — Working Instructions for Agents

This is the only write target for video production code, project-scoped skills, sound design, scripts, QA and GitHub Actions.
Never write video artifacts or workflows into unrelated repositories (e.g. OrthoKB).

## Production principles
- **The pipeline is style-agnostic.** A previous Chinese ink / cinematic / minimalist geometry demo is one optional art direction, NOT the house style.
- For each new video, derive an art direction from its subject matter, audience, emotional intent, platform and user-supplied examples. Do not silently reuse a previous video's look.
- Continuous spatial transformation, straight cuts, animated cards, slide transitions, 2D illustration, 3D visualization, typography and live-action composites are all valid **when they communicate clearly**. Do not impose an absolute "no PowerPoint" rule; avoid careless, unmotivated transitions.
- Favor narrative accuracy, legibility, consistent visual hierarchy and intentional movement over adherence to a fixed palette or technique.
- Technical implementation may change by project. Remotion is the working baseline, not a mandate to use SVG or 9:16 for every output.
- When no visual direction is specified, select a suitable direction based on the script; document it in a short style brief instead of assuming Chinese aesthetics.

## Preferred production strategy with limited vector rendering capacity

**Optimize for explanatory precision and fluidity, NOT high-density character illustration.**
When using ChatGPT/GPT-6 as the code animator with no vetted, rigged character assets, deliberately choose a simplified graphic vocabulary (stick figures, silhouettes, dots, lines, arrows, contours, clean motion diagrams). This is a strategic quality upgrade, not permission to lower production standards.

- Spend the complexity budget on **story beats, spatial causality, timing, choreography, camera rhythm and conceptual clarity**, not facial anatomy, cloth folds, musculature or faux-3D textures.
- A stick figure moving naturally and communicating cause and effect is better than a detailed but stiff mannequin. Even simple figures need correct joint anchors, readable gestures and non-teleporting world state.
- Do not interpret "minimalist" as static drawings plus slides: objects should change meaningfully on screen in ways synchronized with narration. Motion must **explain** the concept, not decorate the background.
- For each spoken claim, define a visible event, exact onset/peak/end times, before-and-after states, transition rationale and a visual acceptance test; use cutaways, symbolic diagrams or abstraction when movement of a detailed character would add no explanatory value.
- Prototype the most demanding **6–10 seconds** at full intended motion cadence before committing to a long film. Review 0.2–0.5s sequential frame strips and the actual encoded playback, not only a sparse contact sheet.
- Reduce *irrelevant vector detail*, not **narrative information**, temporal resolution, scene transitions or QC scrutiny. Frame-rendered paths are fine; 30/60fps delivery selected by intended movement, with smooth interpolation and deliberate holds.
- Never reflexively force 3D/Blender, sophisticated anatomy, Chinese aesthetics, continuous camera, or one transition style onto all films. Use a per-video brief; choose flat 2D symbolic storytelling when that best suits the project.
- The specific strategy is detailed in docs/SEMANTIC_MOTION.md.

## Mandatory process
1. Identify the scientific/educational thesis, supporting sources, audience, delivery platform, resolution, aspect ratio, language and desired tone.
2. Create a per-project style brief (color palette, type, illustration/3D approach, movement grammar, references, audio approach). If the brief leaves style open, select a coherent fit for the content.
3. Plan scenes and transitions by visual cause-and-effect or deliberate editorial cuts, as warranted by the content.
4. Define a composition-specific layout and subtitle safe area. Never treat the 1080×1920 logical SVG canvas or demo caption box as universal.
5. Animate with the framework suited to the brief; Remotion frame-driven code is the starter implementation.
6. Prepare authorized/licensed voice and music sources; record provenance.
7. Render and inspect representative frames **plus in-between transition frames**, motion, audio and continuity. Sample at least five keyframes where duration warrants it.
8. Repair text collisions, edge clipping, wrong visual anchors, poor timing, audio masking, and subtitle overlap. Rerender and inspect again.
9. GitHub Actions reads and validates video content; one agent writes changes to a branch at a time. Do not commit credentials or private voice files.
10. Deliver a video artifact only after inspection. Passing a codec/type check is not proof of artistic correctness.

## Style-selection reference
Read [Style system](docs/STYLE_SYSTEM.md) before authoring a new film.
Potential approaches: Chinese ink cinematic, modern MG, geometric explainer, illustrated editorial, hand-drawn, motion typography, realistic 3D anatomy, interface/demo, documentary, mixed-media. This list is illustrative, not exhaustive.

## Source of truth
- src/: frame-based animation and compositions
- content/: scripts, cues, scene definitions, project-specific style briefs
- assets/audio/: owner-authorized audio for public cloud builds (this repository is public)
- public/audio/: local-only/private narration, gitignored
- scripts/: rendering, music, mixing and verification
- .agents/skills/: project-scoped instruction modules
- .github/workflows/: reproducible rendering/QA
- out/: generated artifacts, never committed

Read .agents/skills/science-motion/SKILL.md before producing a science explainer.
Read .agents/skills/director-critic/SKILL.md for narrative animation, camera choreography and independent frame-review requirements.
For upstream Remotion guidance: https://github.com/remotion-dev/skills

## Current semantic-first animator preference (2026-10-17)
Read .agents/skills/semantic-motion-director/SKILL.md before planning any GPT-6-generated narrative explainer; favor smoothly animated clear simple symbols over fussy character/detail rendering. Distinct verbs per cue, frame-strip QA and final GitHub Release delivery are mandatory for finished videos.
