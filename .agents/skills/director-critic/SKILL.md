---
name: director-critic
description: Opus-inspired code-animation production director and independent visual QA workflow. Style-agnostic; used for any explanatory video or animated short.
---

# Director + Critic production workflow

This skill is a locally maintained synthesis of public production methods, not an official Claude/Opus skill and not a claim that code generation alone guarantees professional film quality.
References:
- VisualxIntelligence/motion-tools-and-skills (techniques.md)
- Pluviobyte/video-production-skills (ai-motion-director, replica QA)
- Liamrjohnston/remotion-motion-graphics-skill (cinematic-camera, choreography)
- haidrrrry/claude-remotion-skill (render/inspect/fix)
- lumian2015/opus-5-5-video-templates (HyperFrames scene templates)

## Directors brief
Write, per beat: claim, audience takeaway, emotion, primary physical subject, first frame, last frame, why the transition happens, camera pose and audio cue.
Objects that recur must have persistent identities and world-space state (coordinates, joints, touch points). Cut or morph deliberately; never make a hard ban on editorial cuts, cards, slides or any visual style.

## Motion contracts
- Animate frame=f(t), deterministic, with stable seeded randomness.
- Use named camera, hero, background, secondary material, type and sound tracks.
- For mechanical interactions write invariants (e.g. hand to stone contact <= specified distance, ground contact at foot).
- When two objects push against each other, drive their contact points from the same world state.
- Camera must change with story: establishing, effort, reveal, consequence and resolution, without covering the important object.
- Choose easing according to physical intention, not “springs everywhere”.
- For stylized hand-drawn movement, animate character on twos when desired but camera on ones.

## Sound and typography
- Narration controls information pacing. Captions represent complete ideas, not rushed slides.
- Lock musical hits to turning points and verify that SFX stay audible without masking dialogue.
- Use measured speech durations, leaving 250–400ms breathing space per cue.
- Don't fix soundtrack genre by default; the current film's original synth is specific to its subject.

## Independent reviewer instructions
The reviewer must not infer quality solely from a successful render.
Inspect the contact sheet *and* full-scale crops (text, hand/rock contact, feet/slope, object exits).
Inspect 5–10 frames around every physical release, impact, switch in world state, and edit.
Check continuity invariants, visible text at cue boundaries, captions vs subjects, subject silhouette and layer order.
Rate each category 0/1 (fail/pass): factual story, scene continuity, object linkage, captions, meaningful camera motion, complete audio, legal provenance, encode correctness.
A fail means patch source then render and inspect again. Do not claim automated checks substitute for viewing the movie.
