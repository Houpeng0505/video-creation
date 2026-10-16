#!/usr/bin/env python3
"""Sisyphus audio: original deterministic cinematic soundtrack + Mandarin TTS."""
import argparse, asyncio, json, subprocess, wave
from pathlib import Path
import numpy as np
OUT=Path("out");CFG=json.loads(Path("content/sisyphus.json").read_text(encoding="utf-8"))

def score():
    OUT.mkdir(exist_ok=True)
    sr=24000;n=90*sr;track=np.zeros(n,dtype=np.float64)
    def tone(start,duration,hz,gain,decay=1.0):
        a=int(start*sr);b=min(n,int((start+duration)*sr))
        if b<=a:return
        x=np.arange(b-a)/sr
        env=(1-np.exp(-x*15))*np.exp(-decay*x/duration)
        track[a:b].__iadd__(gain*env*(np.sin(x*2*np.pi*hz)+.24*np.sin(x*2*np.pi*hz*2.001)+.07*np.sin(x*2*np.pi*hz*3.996)))
    for a,b,chord in [(0,17,[73.42,110,146.83]),(17,34,[65.41,98,130.81]),(34,49,[69.3,103.83,138.59]),(49,63,[73.42,110,146.83]),(63,76,[65.41,98,174.61]),(76,90,[87.31,130.81,174.61])]:
        for hz in chord:tone(a,b-a,hz,.036,.45);tone(a+.25,b-a-.25,hz*2,.009,1)
    notes=[146.83,174.61,196,220,261.63]
    for k,s in enumerate(np.arange(.8,88,1.8)):
        hz=notes[[0,2,3,4,2,1,0,3][k%8]]*(1.12 if s>=65 else 1)
        tone(s,2.3,hz,.078 if s>64 else .067,3.4)
    for s in np.arange(0,90,3.4):tone(s,.94,55 if s<60 else 65.4,.068,5)
    rng=np.random.default_rng(1311)
    for start,gain in [(23.9,.22),(25.1,.23),(27.1,.12),(28.7,.11),(33,.13),(77.9,.08)]:
        a=int(start*sr);b=min(n,a+int(2.8*sr));x=np.arange(b-a)/sr
        white=rng.normal(0,1,len(x));heavy=np.cumsum(white);heavy/=np.max(np.abs(heavy))+1e-9
        track[a:b]+=gain*np.exp(-x*5)*(.55*heavy+.45*np.sin(2*np.pi*(40-9*x)*x))
    t=np.arange(n)/sr
    track*=np.minimum(1,t/1.6)*np.minimum(1,(90-t)/3)
    peak=np.max(np.abs(track));track*=.74/max(.74,peak)
    lag=270
    stereo=np.column_stack([track,np.concatenate([np.zeros(lag),track[:-lag]])*.98])
    with wave.open(str(OUT/"sisyphus_music.wav"),"wb") as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr)
        f.writeframes((np.clip(stereo,-1,1)*32767).astype("<i2").tobytes())
    print("SCORE READY",flush=True)

async def voice():
    from pydub import AudioSegment
    import edge_tts
    OUT.mkdir(exist_ok=True)
    parts=OUT/"sisyphus_voice_parts";parts.mkdir(exist_ok=True)
    master=AudioSegment.silent(duration=90000,frame_rate=24000).set_channels(1)
    report=[]
    for i,c in enumerate(CFG["captions"]):
        name=parts/(str(i).zfill(2)+".mp3")
        for attempt in range(4):
            try:
                await edge_tts.Communicate(c["text"],voice=CFG["voice"],rate="-8%",pitch="-6Hz").save(str(name))
                break
            except Exception as exc:
                if attempt==3:raise RuntimeError(f"TTS failure cue {i+1}: {exc}") from exc
                await asyncio.sleep(3+attempt*3)
        segment=AudioSegment.from_file(name)
        limit=int((c["end"]-c["start"])*1000-370)
        if len(segment)>limit:
            factor=len(segment)/limit
            if factor>1.47:raise RuntimeError(f"Cue {i+1} too long ({len(segment)}ms > {limit}ms)")
            quick=parts/(str(i).zfill(2)+".wav")
            subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(name),"-af","atempo="+str(factor),str(quick)],check=True)
            segment=AudioSegment.from_file(quick)
        start=int(c["start"]*1000)+175
        master=master.overlay(segment,position=start)
        report.append(dict(cue=i+1,start=start/1000,duration=round(len(segment)/1000,2),limit=round(limit/1000,2),text=c["text"]))
        print(f"TTS {i+1:02d} {len(segment)/1000:.2f}s / {limit/1000:.2f}s",flush=True)
    master.export(OUT/"sisyphus_voice.wav",format="wav")
    (OUT/"sisyphus_voice_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print("VOICE READY",flush=True)

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--score-only",action="store_true")
    p.add_argument("--voice-only",action="store_true")
    a=p.parse_args()
    if not a.voice_only:score()
    if not a.score_only:asyncio.run(voice())
