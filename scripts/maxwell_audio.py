#!/usr/bin/env python3
"""Create voiced Mandarin explanatory track, synthetic original ambient music and causal SFX."""
import asyncio,json,subprocess,math,wave
from pathlib import Path
import numpy as np
from pydub import AudioSegment
import edge_tts
CFG=json.loads(Path('content/maxwell_demon.json').read_text(encoding='utf8'))
OUT=Path('out/maxwell');OUT.mkdir(parents=True,exist_ok=True)
PARTS=OUT/'voice_parts';PARTS.mkdir(exist_ok=True)
SR=24000
async def make_voice():
    master=AudioSegment.silent(duration=90000,frame_rate=24000).set_channels(1)
    report=[]
    for i,c in enumerate(CFG['cues']):
        target=PARTS/f'{i:02d}.mp3'
        for attempt in range(4):
            try:
                await edge_tts.Communicate(c['text'],voice=CFG['voice'],rate='+8%',pitch='-3Hz').save(str(target))
                break
            except Exception as e:
                if attempt==3:raise
                await asyncio.sleep(2+attempt*2)
        seg=AudioSegment.from_file(target)
        max_ms=int((c['end']-c['start'])*1000-410)
        speed=1
        if len(seg)>max_ms:
            speed=len(seg)/max_ms
            if speed>1.58:raise RuntimeError(f'voice cue {i+1} cannot fit: {speed}')
            output=PARTS/f'{i:02d}_fast.wav'
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(target),'-af',f'atempo={speed:.6f}',str(output)],check=True)
            seg=AudioSegment.from_file(output)
        start=round(c['start']*1000)+170
        master=master.overlay(seg,position=start)
        report.append({'cue':i+1,'at_sec':start/1000,'voice_duration':round(len(seg)/1000,3),'slot_end':c['end'],'speed_factor':round(speed,3)})
        print(f'VOICE {i+1:02} {len(seg)/1000:.2f}s slot {max_ms/1000:.2f}s factor {speed:.3f}',flush=True)
    master.export(OUT/'voice.wav',format='wav')
    (OUT/'voice_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')

def add_tone(data,start,duration,hz,gain):
    a=int(SR*start); b=min(len(data),int(SR*(start+duration)))
    if b<=a:return
    x=np.arange(b-a)/SR
    env=np.sin(np.pi*np.clip(x/duration,0,1))**1.3
    data[a:b]+=gain*env*(np.sin(2*np.pi*hz*x)+.14*np.sin(4*np.pi*hz*x+.1))
def make_score():
    n=90*SR;waveform=np.zeros(n,dtype=np.float64)
    chords=[(0,18,[87.31,130.81,174.61]),(18,36,[98,146.83,196]),(36,48,[82.41,123.47,164.81]),(48,67,[73.42,110,146.83]),(67,82,[98,146.83,196]),(82,90,[116.54,174.61,233.08])]
    for start,end,notes in chords:
        for note in notes:
            add_tone(waveform,start,end-start,note,.042)
            add_tone(waveform,start+.35,end-start-.4,note*2,.007)
    for i,start in enumerate(np.arange(.6,88,2.75)):
        add_tone(waveform,float(start),1.1,[261.63,293.66,349.23,392][i%4],.036)
    # Sound effects physically aligned with demon gate state transitions.
    for time in [19.25,19.7,20.55,23.8,24.36,24.95,26.55,27.08,27.67,64.1,66.2]:
        add_tone(waveform,time,.23,660 if time<30 else 132,.11)
    for time in [21.1,22.05]:add_tone(waveform,time,.18,224,.075)
    # Bit writing blips: quiet enough not to compete with words.
    for i in range(24):add_tone(waveform,54.4+i*.22,.11,360+i*8,.014)
    x=np.arange(n)/SR;waveform*=np.minimum(1,x/1.8)*np.minimum(1,(90-x)/2.5)
    peak=max(abs(waveform));waveform*=.52/max(peak,.52)
    delay=310;stereo=np.column_stack([waveform,np.concatenate([np.zeros(delay),waveform[:-delay]])*.98])
    with wave.open(str(OUT/'music.wav'),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        w.writeframes((np.clip(stereo,-1,1)*32767).astype('<i2').tobytes())
    print('SCORE READY',flush=True)

if __name__=='__main__':
    make_score()
    asyncio.run(make_voice())