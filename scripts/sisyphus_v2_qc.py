#!/usr/bin/env python3
"""Sisyphus V2 technical QC and frame evidence, NOT semantic sign-off."""
import json,subprocess
from pathlib import Path
import numpy as np
from PIL import Image
cfg=json.loads(Path("content/sisyphus_v2.json").read_text(encoding="utf8"))
cues=cfg["captions"]
assert len(cues)==14 and cues[0]["start"]==0 and cues[-1]["end"]==90
for i,c in enumerate(cues):
    assert c["end"]>c["start"] and (i==0 or c["start"]==cues[i-1]["end"])
    assert len(c["lines"])<=2 and all(len(t)<=20 for t in c["lines"])
    assert "visual" in c and c["visual"]["synchronization"]
voice=json.loads(Path("out/sisyphus_voice_report.json").read_text(encoding="utf8"))
assert len(voice)==14 and all(v["duration"]<=v["limit"]+.07 for v in voice)
video="out/sisyphus_v2.mp4"
info=json.loads(subprocess.check_output(["ffprobe","-v","error","-show_streams","-show_format","-of","json",video],text=True))
v=[s for s in info["streams"] if s["codec_type"]=="video"]
a=[s for s in info["streams"] if s["codec_type"]=="audio"]
assert len(v)==1 and len(a)==1 and v[0]["codec_name"]=="h264" and a[0]["codec_name"]=="aac"
assert abs(float(info["format"]["duration"])-90)<1.0
out=Path("out/v2_review");out.mkdir(parents=True,exist_ok=True)
samples=[]
for i,c in enumerate(cues):
    t=(c["start"]+c["end"])/2
    f=out/("scene_%02d.png"%(i+1))
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(t),"-i",video,"-frames:v","1",str(f)],check=True)
    im=np.asarray(Image.open(f).convert("RGB").resize((180,320)),dtype=np.float32)
    samples.append(im[35:265])
distances=[round(float(np.abs(samples[i]-samples[i-1]).mean()),2) for i in range(1,len(samples))]
assert min(distances)>6,("Some scenes visually almost identical",distances)
times=[17.5,18,18.4,19,21,23.5,24,57.1,59,61,63.5,64.1,66,68.8,70.7,71.1,74,77.6,78.1,80,84.9,85.2]
for i,t in enumerate(times):
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(t),"-i",video,"-frames:v","1",str(out/("transition_%02d.png"%i))],check=True)
(out/"semantic_review.json").write_text(json.dumps({
    "status":"pending visual sign-off; technical test is not semantic approval",
    "scene_labels":[c["visual"]["name"] for c in cues],
    "scene_difference":distances,
    "critical_frames_seconds":times
},ensure_ascii=False,indent=2),encoding="utf8")
print("TECHNICAL PASS; visual inspection pending",distances)
