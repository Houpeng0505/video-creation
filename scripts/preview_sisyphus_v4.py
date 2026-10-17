"""Local-only delivery player with byte-range support for precise MP4 seeking."""
import re
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]/'out'
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
 def send_head(self):
  self.byte_range=None
  path=Path(self.translate_path(self.path)).resolve()
  if not path.is_relative_to(ROOT.resolve()):self.send_error(403);return None
  header=self.headers.get('Range')
  if not header or not path.is_file():return super().send_head()
  match=re.fullmatch(r'bytes=(\d+)-(\d*)',header.strip())
  size=path.stat().st_size
  if not match:self.send_error(416);return None
  start=int(match[1]);end=min(int(match[2]) if match[2] else size-1,size-1)
  if start>end:
   self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
  file=path.open('rb');file.seek(start)
  self.send_response(206);self.send_header('Content-Type',self.guess_type(str(path)))
  self.send_header('Accept-Ranges','bytes');self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
  self.send_header('Content-Length',str(end-start+1));self.end_headers()
  self.byte_range=end-start+1;return file
 def copyfile(self,source,outputfile):
  try:
   if self.byte_range is None:return super().copyfile(source,outputfile)
   remaining=self.byte_range
   while remaining:
    data=source.read(min(65536,remaining))
    if not data:break
    outputfile.write(data);remaining-=len(data)
  except (BrokenPipeError,ConnectionResetError):pass
if __name__=='__main__':
 print('V4 player: http://localhost:3125',flush=True)
 ThreadingHTTPServer(('127.0.0.1',3125),Handler).serve_forever()
