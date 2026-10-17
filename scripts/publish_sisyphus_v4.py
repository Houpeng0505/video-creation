"""Publish an explicitly selected, reviewed V4 artifact using existing Git credentials.

No credential is written to disk or emitted. A new draft release is published only
after every upload succeeds. Existing release assets are never replaced.
"""
import argparse,json,os,subprocess,urllib.request,urllib.error,hashlib
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');p.add_argument('--publish',action='store_true');p.add_argument('--movie');p.add_argument('--storyboard');p.add_argument('--target',default='sisyphus-v4');args=p.parse_args()
assert args.check or args.publish
env={**os.environ,'GCM_INTERACTIVE':'Never','GIT_TERMINAL_PROMPT':'0'}
r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',capture_output=True,text=True,env=env,timeout=20)
if r.returncode:raise SystemExit('Existing GitHub credential unavailable; use local delivery.')
cred=dict(line.split('=',1) for line in r.stdout.splitlines() if '=' in line)
token=cred.get('password');assert token,'GitHub credential missing'
base='https://api.github.com/repos/Houpeng0505/video-creation'
def api(url,method='GET',body=None,mime='application/json'):
 assert url.startswith(base) or url.startswith('https://uploads.github.com/repos/Houpeng0505/video-creation/releases/'),'Unexpected credential destination'
 data=(json.dumps(body).encode() if isinstance(body,dict) else body)
 req=urllib.request.Request(url,data=data,method=method,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','Content-Type':mime,'User-Agent':'sisyphus-v4-publisher','X-GitHub-Api-Version':'2022-11-28'})
 with urllib.request.urlopen(req,timeout=120) as response:return json.load(response)
repo=api(base)
if args.check:
 print(json.dumps({'repository':repo['full_name'],'push':repo.get('permissions',{}).get('push'),'public':not repo['private']}));raise SystemExit
movie=Path(args.movie);story=Path(args.storyboard)
report=json.loads(Path('out/v4_review/technical_report.json').read_text(encoding='utf8'))
assert report['technical']=='PASS' and report['sha256']==hashlib.sha256(movie.read_bytes()).hexdigest()
editorial=Path('docs/SISYPHUS_V4_QA.md')
assert editorial.is_file() and report['sha256'] in editorial.read_text(encoding='utf8'),'Editorial review must identify this exact artifact'
try:
 api(base+'/releases/tags/sisyphus-v4.0')
 raise SystemExit('V4 release already exists; refusing to overwrite.')
except urllib.error.HTTPError as e:
 if e.code!=404:raise
release=api(base+'/releases','POST',{'tag_name':'sisyphus-v4.0','target_commitish':args.target,'name':'西西弗斯 V4 · 90秒中文竖屏','draft':True,'body':'Independent V4 composition. Original V3 Mandarin narration and score preserved byte-for-byte. Refined terrain-linked rolling, planted gait, staged release, layered landscapes and new philosophical scenes. See docs/SISYPHUS_V4_QA.md in the source branch for decoded-frame checks and limitations. H.264/AAC, 720×1280, 30 fps, 90 seconds. V3 preserved.'})
assets=[]
for path,name,mime in [(movie,'Sisyphus-V4-90s.mp4','video/mp4'),(story,'Sisyphus-V4-storyboard.jpg','image/jpeg')]:
 upload=release['upload_url'].split('{')[0]+'?name='+name
 asset=api(upload,'POST',path.read_bytes(),mime);assets.append({'name':name,'size':asset['size'],'url':asset['browser_download_url']})
published=api(base+'/releases/'+str(release['id']),'PATCH',{'draft':False})
print(json.dumps({'published':True,'assets':[{'name':a['name'],'size':a['size'],'url':a['browser_download_url']} for a in published['assets']]},ensure_ascii=False))
