"""Decode the delivered movie, sample the entire timeline, and retain review evidence.

Automated checks are not an editorial approval. Inspect generated sheets and crops.
"""
import argparse,hashlib,json,math,subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np

parser=argparse.ArgumentParser();parser.add_argument('movie');parser.add_argument('--review',default='out/v4_review');args=parser.parse_args()
movie=Path(args.movie);out=Path(args.review);out.mkdir(parents=True,exist_ok=True)
def run(*a):return subprocess.check_output(a,stderr=subprocess.STDOUT)
probe=json.loads(run('ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)))
v=next(s for s in probe['streams'] if s['codec_type']=='video');audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and audio['codec_name']=='aac'
assert (int(v['width']),int(v['height']))==(720,1280) and v['r_frame_rate']=='30/1'
assert v['pix_fmt']=='yuv420p' and abs(float(probe['format']['duration'])-90)<.06
assert int(v['nb_frames'])==2700
assert abs(float(audio['duration'])-90)<.06
run('ffmpeg','-hide_banner','-v','error','-i',str(movie),'-f','null','-')
original=Path('out/reference/Sisyphus-V3-90s.mp4')
audiohash=[]
for f in [original,movie]:
 audiohash.append(run('ffmpeg','-hide_banner','-v','error','-i',str(f),'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-').decode().strip())
assert audiohash[0]==audiohash[1],'original V3 audio payload must be preserved'

frame_dir=out/'frames';frame_dir.mkdir(exist_ok=True)
run('ffmpeg','-hide_banner','-v','error','-y','-i',str(movie),'-vf','fps=4',str(frame_dir/'f_%04d.jpg'))
frames=sorted(frame_dir.glob('f_*.jpg'));assert len(frames)==360
font_candidates=['C:/Windows/Fonts/arial.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
font_path=next((p for p in font_candidates if Path(p).exists()),None)
font=ImageFont.truetype(font_path,15) if font_path else ImageFont.load_default()
cues=json.loads(Path('content/sisyphus_v3.json').read_text(encoding='utf8'))['captions']
scene_tiles=[];rows=[]
for i,c in enumerate(cues):
 indexes=list(range(c['start']*4,c['end']*4))
 cols=6;tilew,tileh=240,451
 sheet=Image.new('RGB',(cols*tilew,math.ceil(len(indexes)/cols)*tileh),'#0c1824')
 for j,k in enumerate(indexes):
  im=Image.open(frames[k]).convert('RGB');im.thumbnail((240,427))
  x=(j%cols)*tilew;y=(j//cols)*tileh
  sheet.paste(im,(x,y+24));ImageDraw.Draw(sheet).text((x+6,y+3),f'{k/4:05.2f} s',font=font,fill='#e0bc81')
 sheet.save(out/f'cue_{i+1:02d}_dense.jpg',quality=92)
 midpoint=(c['start']+c['end'])/2
 im=Image.open(frames[min(359,int(midpoint*4))]).convert('RGB')
 im.save(out/f'cue_{i+1:02d}_full.jpg',quality=95)
 tile=im.resize((240,427));scene_tiles.append(tile)
 arrays=[np.asarray(Image.open(frames[k]).crop((55,330,665,955)).resize((122,125)),dtype=float) for k in indexes]
 changes=[float(np.abs(b-a).mean()) for a,b in zip(arrays,arrays[1:])]
 rows.append({'cue':i+1,'interval':[c['start'],c['end']],'dense_frames':len(indexes),'maximum_adjacent_change':round(max(changes),3),'visual_review':'pending'})

overview=Image.new('RGB',(960,1708),'#0c1824')
for i,im in enumerate(scene_tiles):overview.paste(im,((i%4)*240,(i//4)*427))
overview.save(out/'storyboard.jpg',quality=93)

# Decode 11 consecutive native-rate frames around every cut, pose change and release.
events=[6,12,17.55,17.7,18,18.35,19.1,23,24,30,36,43,45,50,57,64,65.2,70.6,71,78,78.7,85]
event_dir=out/'events';event_dir.mkdir(exist_ok=True)
for t in events:
 sheet=Image.new('RGB',(11*144,280),'#0c1824')
 for j,f in enumerate(range(round(t*30)-5,round(t*30)+6)):
  data=run('ffmpeg','-hide_banner','-v','error','-ss',f'{max(0,f)/30:.6f}','-i',str(movie),'-frames:v','1','-f','image2pipe','-vcodec','mjpeg','-')
  import io
  im=Image.open(io.BytesIO(data)).convert('RGB').resize((144,256));sheet.paste(im,(j*144,24))
  ImageDraw.Draw(sheet).text((j*144+4,3),f'{f/30:.3f}',font=font,fill='#e0bc81')
 sheet.save(event_dir/f'event_{t:05.2f}.jpg',quality=92)

event_files=sorted(event_dir.glob('event_*.jpg'))
for start in range(0,len(event_files),4):
 page=Image.new('RGB',(1584,1120),'#0c1824')
 for row,path in enumerate(event_files[start:start+4]):page.paste(Image.open(path),(0,row*280))
 page.save(out/f'boundary_page_{start//4+1:02d}.jpg',quality=94)

report={'technical':'PASS','file':str(movie),'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),'duration':probe['format']['duration'],'frames':2700,'audio_payload_sha256':audiohash[0],'original_audio_unchanged':True,'entire_timeline_samples':360,'native_rate_boundary_samples':len(events)*11,'cues':rows,'editorial_approval':'requires actual visual review of decoded sheets and full-size images'}
(out/'technical_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in report.items() if k!='cues'},ensure_ascii=False),flush=True)
