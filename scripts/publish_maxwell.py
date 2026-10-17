"""Publish only the reviewed Maxwell artifact; never replace existing assets.

Uses the existing Git credential in memory. No secrets are printed or saved.
"""
import argparse,hashlib,json,os,subprocess,urllib.error,urllib.parse,urllib.request
from pathlib import Path

p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');p.add_argument('--publish',action='store_true');p.add_argument('--target',default='maxwell-demon');args=p.parse_args()
assert args.check or args.publish
env={**os.environ,'GCM_INTERACTIVE':'Never','GIT_TERMINAL_PROMPT':'0'}
r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',capture_output=True,text=True,env=env,timeout=20)
if r.returncode:raise SystemExit('Existing GitHub credential unavailable; use the local deliverable.')
credential=dict(line.split('=',1) for line in r.stdout.splitlines() if '=' in line)
token=credential.get('password');assert token,'Existing GitHub credential missing'
base='https://api.github.com/repos/Houpeng0505/video-creation'

def api(url,method='GET',body=None,mime='application/json'):
 assert url.startswith(base) or url.startswith('https://uploads.github.com/repos/Houpeng0505/video-creation/releases/'),'Unexpected credential destination'
 data=json.dumps(body).encode() if isinstance(body,dict) else body
 req=urllib.request.Request(url,data=data,method=method,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','Content-Type':mime,'User-Agent':'maxwell-animation-publisher','X-GitHub-Api-Version':'2022-11-28'})
 with urllib.request.urlopen(req,timeout=120) as response:return json.load(response)

repo=api(base)
if args.check:
 print(json.dumps({'repository':repo['full_name'],'push':repo.get('permissions',{}).get('push'),'public':not repo['private']}));raise SystemExit
root=Path('out/maxwell');movie=root/'Maxwell-Demon-90s.mp4';review=root/'review_delivery'
report=json.loads((review/'technical_report.json').read_text(encoding='utf8'))
assert report['technical']=='PASS' and report['sha256']==hashlib.sha256(movie.read_bytes()).hexdigest()
qa=Path('docs/MAXWELL_QA.md').read_text(encoding='utf8');assert report['sha256'] in qa,'Editorial review must name this exact artifact'
assert 'Final visual review: PASS' in qa,'Actual visual review is required'
tag='maxwell-demon-v1.0'
try:
 api(base+'/releases/tags/'+tag);raise SystemExit('Release exists; refusing to overwrite.')
except urllib.error.HTTPError as e:
 if e.code!=404:raise
release=api(base+'/releases','POST',{'tag_name':tag,'target_commitish':args.target,'name':'麦克斯韦妖 · 90秒中文科普动画','draft':True,'body':'720×1280, 30 fps, H.264/AAC, 90 seconds. Deterministic particles and conditional physical gate; measurement, finite memory, reset heat, Landauer principle and modern quantum feedback. Original symbolic graphics and procedural score, Mandarin TTS. Actual prototype and full-film decoded-frame review, with fixes and limitations recorded in docs/MAXWELL_QA.md. Existing Sisyphus versions preserved. Direct MP4 plus storyboard and review package attached.'})
for path,name,mime in [(movie,movie.name,'video/mp4'),(review/'storyboard.jpg','Maxwell-Demon-storyboard.jpg','image/jpeg'),(root/'Maxwell-Demon-Review.zip','Maxwell-Demon-Review.zip','application/zip')]:
 assert path.is_file()
 api(release['upload_url'].split('{')[0]+'?name='+urllib.parse.quote(name),'POST',path.read_bytes(),mime)
published=api(base+'/releases/'+str(release['id']),'PATCH',{'draft':False})
print(json.dumps({'published':True,'tag':tag,'assets':[{'name':a['name'],'size':a['size'],'url':a['browser_download_url']} for a in published['assets']]},ensure_ascii=False))
