#!/usr/bin/env python3
"""Decode the real deliverable, produce editorial evidence; technical pass != art approval."""
import argparse,subprocess,json,math,hashlib,io
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser();p.add_argument('movie');p.add_argument('--review',default='out/maxwell/review');args=p.parse_args()
movie=Path(args.movie);out=Path(args.review);out.mkdir(parents=True,exist_ok=True)
def call(*args):return subprocess.check_output(args,stderr=subprocess.STDOUT)
meta=json.loads(call('ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)))
video=next(s for s in meta['streams'] if s['codec_type']=='video')
audio=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert video['codec_name']=='h264' and audio['codec_name']=='aac'
assert (int(video['width']),int(video['height']))==(720,1280)
assert video['r_frame_rate']=='30/1' and int(video['nb_frames'])==2700
assert abs(float(meta['format']['duration'])-90)<.08
call('ffmpeg','-hide_banner','-loglevel','error','-i',str(movie),'-f','null','-')
voice=json.loads(Path('out/maxwell/voice_report.json').read_text(encoding='utf8'))
for v in voice:assert v['at_sec']+v['voice_duration']<v['slot_end']-.05,f'cue {v["cue"]} exceeds interval'
cues=json.loads(Path('content/maxwell_demon.json').read_text(encoding='utf8'))['cues'];assert len(cues)==14
frames=out/'frames';frames.mkdir(exist_ok=True)
call('ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(movie),'-vf','fps=4',str(frames/'f_%04d.jpg'))
images=sorted(frames.glob('*.jpg'));assert len(images)==360
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,15)
summary=Image.new('RGB',(240*4,427*4),'#061521')
metrics=[]
for idx,c in enumerate(cues):
    subset=list(range(round(c['start']*4),round(c['end']*4)))
    w,h=240,451;sheet=Image.new('RGB',(w*6,h*math.ceil(len(subset)/6)),'#091820')
    rowpixels=[]
    for j,k in enumerate(subset):
        im=Image.open(images[k]).convert('RGB')
        x=(j%6)*w;y=(j//6)*h
        sheet.paste(im.resize((240,427)),(x,y+24))
        ImageDraw.Draw(sheet).text((x+6,y+5),f'{k/4:05.2f}',font=font,fill='#f3c88b')
        arr=np.asarray(im.crop((110,390,616,830)).resize((101,88)),dtype=np.float32)
        rowpixels.append(arr)
    changes=[float(np.mean(np.abs(a-b))) for a,b in zip(rowpixels,rowpixels[1:])]
    sheet.save(out/f'cue_{idx+1:02d}_dense.jpg',quality=89)
    mid=Image.open(images[int((c['start']+c['end'])/2*4)]).convert('RGB').resize((240,427))
    summary.paste(mid,((idx%4)*240,(idx//4)*427))
    metrics.append({'cue':idx+1,'visible_activity_mean':round(float(np.mean(changes)),3),'visible_activity_max':round(max(changes),3),'semantic_review':'REQUIRES ACTUAL IMAGE REVIEW'})
summary.save(out/'storyboard.jpg',quality=91)
# 0.25s frame strips over hard scene (18..28), secondary critical conceptual moments.
for name,start,end in [('gate',18,28),('memory',54,67),('entropy',75,82)]:
    idxs=list(range(int(start*4),int(end*4)))
    tileW,tileH=180,344;cols=8;sheet=Image.new('RGB',(cols*tileW,math.ceil(len(idxs)/cols)*tileH),'#081823')
    for j,k in enumerate(idxs):
        im=Image.open(images[k]).convert('RGB').resize((180,320));x=(j%cols)*tileW;y=(j//cols)*tileH
        sheet.paste(im,(x,y+24));ImageDraw.Draw(sheet).text((x+4,y+4),f'{k/4:05.2f}',font=font,fill='#ffd89c')
    sheet.save(out/f'critical_{name}_025s.jpg',quality=92)
for t in [18.0,19.2,19.75,20,20.4,21.8,23.2,24.35,26.9,27.1,28,32,46,50,57,63.5,65.7,70.0,78.5,87.5]:
    k=min(359,round(t*4));im=Image.open(images[k]).convert('RGB')
    im.save(out/f'full_{t:05.2f}.jpg',quality=95)
report={'status':'TECHNICAL PASS; semantic review requires looking at exported images',
        'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(), 'video_duration':float(meta['format']['duration']),
        'video_frames':2700,'frame_interval_seconds':.25,'samples':360,
        'voice_timing':'checked per narration cue','cues':metrics,
        'manual_review_checklist':['gate transitions with crossing','fast vs slow visible','caption safe area','memory erase heat','total entropy logical','clip pop','hollow/missing frames']}
(out/'technical_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in report.items() if k!='cues'},ensure_ascii=False),flush=True)