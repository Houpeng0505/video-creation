#!/usr/bin/env python3
"""Final film QA: captions, media, speech cue duration and transition samples."""
import json,subprocess
from pathlib import Path
from PIL import Image,ImageChops
cfg=json.loads(Path("content/sisyphus.json").read_text(encoding="utf-8"))
assert cfg["durationSeconds"]==90 and cfg["fps"]==30
for i,c in enumerate(cfg["captions"]):
    assert 0<=c["start"]<c["end"]<=90
    assert i==0 or cfg["captions"][i-1]["end"]<=c["start"]
    assert 1<=len(c["lines"])<=2 and all(len(s)<=18 for s in c["lines"])
report=json.loads(Path("out/sisyphus_voice_report.json").read_text(encoding="utf-8"))
assert len(report)==len(cfg["captions"])
for item in report:assert item["duration"]<=item["limit"]+.07,item
video="out/sisyphus_final.mp4"
info=json.loads(subprocess.check_output(["ffprobe","-v","error","-show_streams","-show_format","-of","json",video],text=True))
v=[s for s in info["streams"] if s["codec_type"]=="video"]
a=[s for s in info["streams"] if s["codec_type"]=="audio"]
assert len(v)==1 and len(a)==1
assert v[0]["codec_name"]=="h264" and a[0]["codec_name"]=="aac"
assert int(v[0]["width"])*16==int(v[0]["height"])*9
assert abs(float(info["format"]["duration"])-90)<1.2
out=Path("out/sisyphus_qa");out.mkdir(parents=True,exist_ok=True)
times=[1,6,12,18,23.9,24.7,27,30,34,37,44,53,61,68,76,78.6,84,89]
frames=[]
for i,t in enumerate(times):
    path=out/("frame-%02d.png"%i)
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(t),"-i",video,"-frames:v","1",str(path)],check=True)
    frames.append(Image.open(path).convert("RGB"))
for i in range(1,len(frames)):
    assert ImageChops.difference(frames[i-1],frames[i]).getbbox() is not None,f"identical frame {times[i]}"
for i,t in enumerate([24.4,24.8,25.2,25.6,26,26.4,33.2,33.6,34,77.7,78.1,78.5]):
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-ss",str(t),"-i",video,"-frames:v","1",str(out/("transition-%02d.png"%i))],check=True)
print("PASS 90s H264 AAC Mandarin speech and frame/transition export. Visual approval still necessary.")
