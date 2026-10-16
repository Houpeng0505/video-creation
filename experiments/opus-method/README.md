# Opus-like HTML/3D proof of concept (6 seconds)

This is NOT the complete 90-second film. It is an A/B infrastructure experiment using a different authoring and rendering stack:
HTML + Three.js mesh-based scene + GSAP paused seekable timeline + HyperFrames + Chrome frame capture + FFmpeg.
The earlier Sisyphus film's visuals used React/TypeScript/SVG in Remotion. Python handled audio and QC, NOT picture animation.

One shared world state defines stone position and radius, hand contact, feet on slope, and release timing. 181 discrete states must pass mathematical tests. This removes the previous disconnected SVG guesswork. Full 3D camera/lighting are separate from any claim of realism.

Important: this still uses coarse procedural primitive anatomy, not professional skinned/rigged human assets or motion capture. Better code and rendering alone cannot guarantee Opus-level image quality. High-quality characters require GLB/FBX models, a skeleton + IK, true motion clips, art direction and image review.

Sources: https://github.com/heygen-com/hyperframes
https://github.com/JohnHeibel/ClaudeAnimationBase
https://github.com/VisualxIntelligence/motion-tools-and-skills/blob/main/SOURCES.md
https://github.com/bilaldemirerr/opus-video-recipes
