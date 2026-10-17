"""Final encoded-film probes and complete dense visual-review package."""
import argparse,hashlib,io,json,math,subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont

p=argparse.ArgumentParser();p.add_argument('movie');p.add_argument('--review',default='out/maxwell/review');args=p.parse_args()
out=Path(args.review);out.mkdir(parents=True,exist_ok=True);movie=Path(args.movie)
def run(*cmd):
 try:return subprocess.check_output(cmd,stderr=subprocess.STDOUT)
 except subprocess.CalledProcessError as e:
  print(e.output.decode(errors='replace'),flush=True);raise
probe=json.loads(run('ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and a['codec_name']=='aac' and v['pix_fmt']=='yuv420p'
assert (int(v['width']),int(v['height']))==(720,1280) and v['r_frame_rate']=='30/1'
assert int(v['nb_frames'])==2700 and abs(float(probe['format']['duration'])-90)<.06
run('ffmpeg','-hide_banner','-v','error','-i',str(movie),'-f','null','-')
cfg=json.loads(Path('content/maxwell.json').read_text(encoding='utf8'));voices=json.loads(Path('out/maxwell/voice_report.json').read_text(encoding='utf8'));physics=json.loads(Path('out/maxwell/physics_report.json').read_text(encoding='utf8'))
assert physics['result']=='PASS' and len(voices)==len(cfg['captions'])==12
for i,c in enumerate(cfg['captions']):
 assert c['end']>c['start'] and (i==0 or c['start']==cfg['captions'][i-1]['end'])
 assert voices[i]['start']>=c['start'] and voices[i]['end']<c['end']-.1
 assert all(len(line)*28<=610 for line in c['lines'])
font_path=next((str(p) for p in [Path('C:/Windows/Fonts/arial.ttf'),Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')] if p.exists()),None)
font=ImageFont.truetype(font_path,15) if font_path else ImageFont.load_default()
frame_dir=out/'frames';frame_dir.mkdir(exist_ok=True)
run('ffmpeg','-hide_banner','-v','error','-y','-i',str(movie),'-vf',r'select=eq(mod(n\,15)\,0)+eq(mod(n\,15)\,8)','-fps_mode','vfr',str(frame_dir/'f_%04d.jpg'))
frames=sorted(frame_dir.glob('f_*.jpg'));assert len(frames)==360
source_frames=[(k//2)*15+(8 if k%2 else 0) for k in range(360)]
tiles=[];rows=[]
for i,c in enumerate(cfg['captions']):
 indexes=[k for k,n in enumerate(source_frames) if c['start']<=n/30<c['end']]
 sheet=Image.new('RGB',(1440,math.ceil(len(indexes)/6)*451),'#081922')
 for j,k in enumerate(indexes):
  im=Image.open(frames[k]).convert('RGB').resize((240,427));x=j%6*240;y=j//6*451
  sheet.paste(im,(x,y+24));ImageDraw.Draw(sheet).text((x+6,y+3),f'{source_frames[k]/30:06.3f} s',font=font,fill='#f4d58e')
 sheet.save(out/f'cue_{i+1:02d}_dense.jpg',quality=93)
 mid=(c['start']+c['end'])/2;closest=min(range(360),key=lambda k:abs(source_frames[k]/30-mid))
 im=Image.open(frames[closest]).convert('RGB');im.save(out/f'cue_{i+1:02d}_full.jpg',quality=96);tiles.append(im.resize((240,427)))
 rows.append({'cue':i+1,'start':c['start'],'end':c['end'],'samples':len(indexes),'action':c['action'],'visual_review':'requires actual viewing'})
sheet=Image.new('RGB',(960,1281),'#081922')
for i,im in enumerate(tiles):sheet.paste(im,((i%4)*240,(i//4)*427))
sheet.save(out/'storyboard.jpg',quality=94)

# Every passage in the hard shot, several controller onsets, and all major edits.
events=sorted(set([7,13,23,30,37,43,49,55.05,56,59,62.7,63,65,71,79,89.8]+[round(e['t'],3) for e in physics['crossings'] if 13<=e['t']<30]+[round(d['start']+.28,3) for d in physics['decisions'] if d['allowed'] and 13<=d['start']<18]))
native_frames=sorted({n for t in events for n in range(round(t*30)-5,round(t*30)+6) if 0<=n<2700})
native_dir=out/'native';native_dir.mkdir(exist_ok=True)
intervals=[]
for n in native_frames:
 if intervals and n==intervals[-1][1]+1:intervals[-1][1]=n
 else:intervals.append([n,n])
expression='+'.join(r'between(n\,'+str(a)+r'\,'+str(b)+')' for a,b in intervals)
run('ffmpeg','-hide_banner','-v','error','-y','-i',str(movie),'-vf','select='+expression,'-fps_mode','vfr',str(native_dir/'n_%04d.jpg'))
native_files=sorted(native_dir.glob('n_*.jpg'));assert len(native_files)==len(native_frames)
native_map=dict(zip(native_frames,native_files));event_sheets=[]

# Inspect every frame of the entire difficult shot, with enough pixels to see
# circle/door clearance rather than trusting tiny full-film contact sheets.
gate_dir=out/'gate';gate_dir.mkdir(exist_ok=True)
run('ffmpeg','-hide_banner','-v','error','-y','-i',str(movie),'-vf',r'trim=start_frame=390:end_frame=690,crop=200:180:260:559','-fps_mode','vfr',str(gate_dir/'g_%04d.jpg'))
gate_files=sorted(gate_dir.glob('g_*.jpg'));assert len(gate_files)==300
for start in range(0,300,60):
 sheet=Image.new('RGB',(2000,1224),'#081922')
 for j,path in enumerate(gate_files[start:start+60]):
  x=j%10*200;y=j//10*204;sheet.paste(Image.open(path),(x,y+24));ImageDraw.Draw(sheet).text((x+4,y+3),f'{13+(start+j)/30:.3f}',font=font,fill='#f4d58e')
 sheet.save(out/f'gate_all_{start//60+1:02d}.jpg',quality=95)
for t in events:
 sheet=Image.new('RGB',(1584,280),'#081922')
 for j,n in enumerate(range(round(t*30)-5,round(t*30)+6)):
  if n not in native_map:continue
  im=Image.open(native_map[n]).convert('RGB').resize((144,256));sheet.paste(im,(j*144,24));ImageDraw.Draw(sheet).text((j*144+4,3),f'{n/30:.3f}',font=font,fill='#f4d58e')
 event_sheets.append(sheet)
for start in range(0,len(event_sheets),4):
 page=Image.new('RGB',(1584,1120),'#081922')
 for j,im in enumerate(event_sheets[start:start+4]):page.paste(im,(0,j*280))
 page.save(out/f'boundary_{start//4+1:02d}.jpg',quality=94)
report={'technical':'PASS','movie':str(movie),'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),'size':movie.stat().st_size,'duration':probe['format']['duration'],'fps':30,'dimensions':[720,1280],'video_frames':2700,'voice_segments':12,'dense_samples':360,'sampling_gap_max_seconds':8/30,'boundary_events':events,'native_unique_samples':len(native_frames),'boundary_display_samples':len(events)*11,'hard_shot_contiguous_frames':300,'shots':rows,'editorial':'requires actual review of decoded images; no artistic approval inferred from probes'}
(out/'technical_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in report.items() if k not in ['shots','boundary_events']},ensure_ascii=False),flush=True)
