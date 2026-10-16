# Per-video style system (not a mandatory house aesthetic)

## Guiding rule
The **pipeline stays consistent; visual style does not**. Style is a decision made separately for every film, series or episode. The Chinese-ink, dark cinema + continuous SVG geometry approach used in the first demo is a *preset only*.

## Minimum preproduction style brief
Record for each new project:
- Topic, factual thesis, audience and viewing context (social mobile, classroom, scientific lecture, etc.)
- Emotional/narrative intent and pacing
- Format, aspect ratio, resolution, duration, preferred language
- Art direction: references, palette, typography, graphic treatment, density, 2D/3D/live action
- Motion grammar: morphs, camera moves, cuts, slide/cards, drawn paths, motion graphics, simulation, or combinations
- Caption placement/size and UI safe-area constraints for target distribution
- Audio direction: narrator voice and emotional style, score texture/genre/cue sheet, ambience/effects
- Technical stack and reasons for any special renderer
- Quality checks specific to the visuals (e.g., diagram anchors for graphs, anatomical correctness for medical 3D)

Suggested lightweight record (adapt as needed):
```yaml
topic: "Example: orthodontic tooth movement"
audience: "general public"
format: "vertical 9:16"
visual_style: "friendly stylized 3D anatomical cutaway"
movement: "camera orbit, transparent tissue layers, occasional hard cut"
palette: "high contrast soft neutral clinical"
audio: "clear Mandarin narration + subtle ambient score"
subtitle_safe_area: "bottom 12%-22%, avoiding platform controls"
```

## Optional art directions — never defaults
1. Chinese ink cinematic / ancient star chart: atmospheric continuous spatial transformation and restrained graphic palette.
2. Contemporary MG: typography, bold geometric hierarchy, quick informational cuts.
3. 3D scientific visualization: anatomy, mechanisms, physically meaningful motion and labeled callouts.
4. Hand-drawn illustration: expressive strokes and morphing marks.
5. Documentary / collage: stills, captions, maps, B-roll and editorial hard cuts.
6. Educational slides and card transitions: legitimate when the scene content calls for discrete steps or comparisons.

## Universal acceptance criteria
- The story or argument is comprehensible and accurate.
- Elements are correctly aligned and labels connect to the intended object.
- Content is readable, within safe margins and free of unintended overlap.
- Motion/cuts are intentional and timed to narration; transitions do not confuse spatial identity.
- Sound design supports the subject, music never masks important narration.
- The rendered film has been reviewed at critical frames and transitions, corrected and rerendered.

No aesthetic is universally "more advanced". Evaluate whether the style serves **this video's goal**.
