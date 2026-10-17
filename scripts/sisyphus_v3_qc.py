#!/usr/bin/env python3
"""Semantic-motion technical probes; manual review of actual decoded frame strips remains mandatory."""
import json, subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np

root=Path('out/v3_review');root.mkdir(parents=True,exist_ok=True)
config=json.loads(Path('content/sisyphus_v3.json').read_text(encoding='utf8'))
cap=config['captions'];assert len(cap)==14 and config['durationSeconds']==90
for i,c in enumerate(cap):
    assert (i==0 or c['start']==cap[i-1]['end']) and c['end']>c['start']
    assert len(c['lines'])==2 and all(len(line)<=20 for line in c['lines'])
    assert {'scene','verb','visible_event','verify'} <= c.keys()
    assert c['visible_event'][0] >= c['start'] and c['visible_event'][1] <= c['end']
reports=json.loads(Path('out/sisyphus_voice_report.json').read_text(encoding='utf8'))
assert len(reports)==14 and all(v['duration']<=v['limit']+.07 for v in reports)
movie=Path('out/sisyphus_v3.mp4')
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)],text=True))
v=[s for s in probe['streams'] if s['codec_type']=='video']
a=[s for s in probe['streams'] if s['codec_type']=='audio']
assert len(v)==1 and len(a)==1 and v[0]['codec_name']=='h264' and a[0]['codec_name']=='aac'
assert (int(v[0]['width']),int(v[0]['height']))==(720,1280)
assert abs(float(probe['format']['duration'])-90)<1

def snapshot(t,path):
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(round(t,3)),'-i',str(movie),'-frames:v','1',str(path)],check=True)
    return Image.open(path).convert('RGB')

rows=[]
scene_tiles=[]
font=None
for fpath in ('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
    if Path(fpath).exists():font=ImageFont.truetype(fpath,17);break
for i,c in enumerate(cap):
    length=c['end']-c['start']
    samples=[]
    for j,sec in enumerate((c['start']+.55,c['start']+length/2,c['end']-.55)):
        f=root/f'c{i+1:02d}_{j}.png';im=snapshot(sec,f);samples.append(im)
        if j==1:
            tile=im.resize((240,427))
            dr=ImageDraw.Draw(tile);dr.rectangle((0,0,240,32),fill='#0b1424')
            dr.text((6,7),f'{i+1:02d}  {c["start"]:02d}-{c["end"]:02d}s',font=font,fill='#f5cb86')
            scene_tiles.append(tile)
    ims=[np.asarray(s.crop((65,185,655,900)).resize((118,143)),dtype=np.float32) for s in samples]
    diffs=[round(float(np.abs(ims[u+1]-ims[u]).mean()),2) for u in (0,1)]
    assert max(diffs)>1.35,(f'Scene {i+1} has no meaningful movement',diffs)
    rows.append({'shot':i+1,'time':[c['start'],c['end']],'scene':c['scene'],'verb':c['verb'],'image_differences':diffs,'auto_motion_presence':True,'semantic_approval':'requires actual image examination'})

# Dense samples at the physical action boundaries.
critical=[18.0,18.35,18.8,19.5,20.2,21.2,22.1,23.0,57.2,58.2,59.2,60.2,61.2,62.2,63.2,64.4,65.8,67.6,69.1,70.3,71.4,73,74.8,77.5,78.1,79.3,80.5,82,84,85.3,87,89]
for i,t in enumerate(critical):snapshot(t,root/f'action_{i:02d}.png')
# One composite of every central beat, NOT sufficient as an independent visual approval.
sheet=Image.new('RGB',(960,1708),'#0a1120')
for i,tile in enumerate(scene_tiles):sheet.paste(tile,((i%4)*240,(i//4)*427))
sheet.save(root/'scene_sheet.jpg',quality=90)
for label,indices in {'fall':range(0,8),'gravity':range(8,15),'choice':range(15,20),'revolt':range(24,30)}.items():
    ims=[Image.open(root/f'action_{i:02d}.png').convert('RGB').resize((180,320)) for i in indices]
    strip=Image.new('RGB',(len(ims)*180,320),'#111827')
    for j,im in enumerate(ims):strip.paste(im,(j*180,0))
    strip.save(root/f'strip_{label}.jpg',quality=90)
(root/'qa_report.json').write_text(json.dumps({'result':'technical validation PASSED, final editorial approval requires viewing actual images',
    'shots':rows,'critical_seconds':critical,'inputs':'decoded MP4 snapshots, not conceptual storyboard'},ensure_ascii=False,indent=2),encoding='utf8')
print('TECH PASS: 14 distinct animated voice-matched shots, 90sec, AAC/H264, 42 scene snapshots +32 action frames',flush=True)