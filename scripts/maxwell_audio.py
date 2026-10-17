"""Original Mandarin narration and deterministic, restrained laboratory score."""
import asyncio,json,subprocess,wave
from pathlib import Path
import numpy as np
import edge_tts

ROOT=Path('out/maxwell');ROOT.mkdir(parents=True,exist_ok=True)
CFG=json.loads(Path('content/maxwell.json').read_text(encoding='utf8'))
def duration(path):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)]))
async def main():
 sr=48000;master=np.zeros(90*sr,dtype=np.float64);report=[]
 for i,cue in enumerate(CFG['captions']):
  mp3=ROOT/f'voice_{i:02d}.mp3';wav=ROOT/f'voice_{i:02d}.wav'
  if not mp3.exists():
   for attempt in range(3):
    try:
     await edge_tts.Communicate(cue['text'],voice=CFG['voice'],rate='+0%',pitch='-2Hz').save(str(mp3));break
    except Exception:
     if attempt==2:raise
     await asyncio.sleep(1+attempt)
  raw_duration=duration(mp3);limit=cue['end']-cue['start']-.45
  tempo=max(1,raw_duration/limit)
  if tempo>1.25:raise RuntimeError(f'Shorten cue {i+1}: tempo {tempo:.3f} required')
  subprocess.run(['ffmpeg','-hide_banner','-v','error','-y','-i',str(mp3),'-af',f'atempo={tempo},aresample={sr}','-ac','1','-c:a','pcm_s16le',str(wav)],check=True)
  with wave.open(str(wav),'rb') as f:samples=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(float)/32768
  start=round((cue['start']+.18)*sr);master[start:start+len(samples)]+=samples
  row={'cue':i+1,'start':start/sr,'duration':len(samples)/sr,'end':(start+len(samples))/sr,'tempo':round(tempo,4)}
  assert row['end']<cue['end']-.1;report.append(row);print(json.dumps(row),flush=True)
 def write(path,data):
  with wave.open(str(path),'wb') as f:
   f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
 write(ROOT/'narration.wav',master)
 score=np.zeros_like(master)
 def tone(start,dur,hz,gain):
  a=int(start*sr);b=min(len(score),int((start+dur)*sr));t=np.arange(b-a)/sr
  envelope=(1-np.exp(-t*38))*np.exp(-t*2.7/dur)
  score[a:b]+=gain*envelope*(np.sin(t*2*np.pi*hz)+.16*np.sin(t*2*np.pi*hz*2))
 for j,start in enumerate(np.arange(0,89,3)):
  hz=[130.81,164.81,196,146.83][(j//4)%4]
  tone(start,4.4,hz,.012);tone(start+.15,3.7,hz*1.5,.007)
  if j%2==0:tone(start+.8,1.6,[523.25,659.25,783.99,587.33][j%4],.022)
 for start in [13,23,43,49,56,63,71,79]:tone(start,.35,1046.5,.016)
 t=np.arange(len(score))/sr;score*=np.minimum(1,t/1.8)*np.minimum(1,(90-t)/2.5)
 write(ROOT/'music.wav',score)
 (ROOT/'voice_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
 print('Mandarin narration and original procedural music ready',flush=True)
asyncio.run(main())
