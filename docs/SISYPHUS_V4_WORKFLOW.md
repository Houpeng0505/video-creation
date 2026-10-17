# Reproduce and inspect V4

## Source isolation
The `sisyphus-v4` branch adds `SisyphusV4` and `sisyphusV4Motion`. V3 source, captions, audio generation and release remain the reference. V4 imports the unchanged V3 cue JSON. `package-lock.json` records the complete dependency graph; the runtime remains Remotion 4.0.531.

Official Remotion Skills were read from `remotion-dev/skills`, commit `1441a11e95db35443bd76bb318386c0d3ca00053`: render, create/video-layout, markup/timing/compositions and captions. Cache: `vendor/remotion-skills` (ignored). These current skills describe 4.0.536 and newer interactivity APIs; only compatible frame-driven timing, explicit compositions, safe layout and render/inspect practices were adopted. The runtime was not upgraded and no global Skills/settings were changed.

## Render
On Windows with Node, Git, FFmpeg and Chrome, run `scripts/render_sisyphus_v4.ps1`. It verifies the V3 download hash, installs locked packages, typechecks, tests motion, renders and produces a mobile-compatible MP4 while copying the original AAC payload. Python with Pillow and NumPy then runs:

```
python scripts/sisyphus_v4_qc.py out/Sisyphus-V4-90s.mp4
```

Inspect every `out/v4_review/cue_XX_dense.jpg`, full-size scene images, and the 11-frame native-rate event strips. The report remains explicitly technical; record editorial observations separately. Publication is a separate explicit command using `scripts/publish_sisyphus_v4.py --publish --movie out/Sisyphus-V4-90s.mp4 --storyboard out/v4_review/storyboard.jpg`. This uses the existing OS Git credential in memory, never writes it or prints it, creates a fresh draft, uploads artifacts, then publishes. It refuses replacement of an existing V4 release.

## Motion contracts
`s` measures true distance along the common incline; `h` is distance normal to it. A stone center is always at h=radius. SVG positive angles are clockwise: uphill rotation is positive. At contact, translational and rotational velocities cancel. Stance feet hold their world coordinates over 62% of a stride; swing feet follow a smooth transfer arc. IK maintains two-segment leg lengths. Starting/stopping gait blends over explicit settling intervals. The person visibly jumps to a higher, drawn ledge before the boulder passes. This is a staged illustrative action, not a physics simulation.

Audio source: existing public V3 release, generated Mandarin `zh-CN-YunyangNeural` and algorithmic score documented by the V3 production history. No new voice impersonation or third-party music was added. File provenance is hash-verified; prior model/service licensing claims were not independently re-audited in this visual revision.

## Limitations
The figure remains a stylized articulated symbol. The film has no motion-capture performance or physical dynamics solver. Complete 90-second real-time audiovisual listening is not established by image inspection. Original audio content and timeline are preserved; the verification checks decoded media, original audio payload, cue boundaries, dense image sequences and geometry.
