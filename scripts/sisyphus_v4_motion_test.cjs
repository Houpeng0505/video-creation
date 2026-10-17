const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
const mod={exports:{}};
new Function('module','exports',ts.transpile(fs.readFileSync('src/sisyphusV4Motion.ts','utf8'),{module:ts.ModuleKind.CommonJS}))(mod,mod.exports);
const m=mod.exports;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
let stanceSamples=0;
for(let d=100;d<700;d+=.1){
 for(const offset of [0,.5]){
  const f=m.foot(d,offset),next=m.foot(d+.001,offset);
  if(f.stance&&next.stance){assert.ok(Math.abs(f.s-next.s)<1e-8,'stance foot must stay planted');assert.equal(f.h,0);stanceSamples++;}
  assert.ok(f.h>=0&&f.h<=18.001);
  const hip=m.terrain(d-5,56+1.5*Math.cos(d/62*Math.PI*4)),ankle=m.terrain(f.s,f.h);
  assert.ok(dist(hip,ankle)<73,'leg target reachable');
  const knee=m.joint(hip,ankle,36,37,-1);
  assert.ok(Math.abs(dist(hip,knee)-36)<1e-7&&Math.abs(dist(knee,ankle)-37)<1e-7,'two-bone leg lengths');
 }
}
for(let frame=0;frame<720;frame++){
 const t=frame/30,s=m.openingState(t),n=m.openingState(t+1/3000);
 assert.ok(Math.abs(s.stone-n.stone)<.1&&Math.abs(s.person-n.person)<.1&&Math.abs(s.aside-n.aside)<.1,'continuous state');
 const center=m.terrain(s.stone,51),ground=m.terrain(s.stone);
 assert.ok(Math.abs(dist(center,ground)-51)<1e-7,'stone tangent to ground');
 if(t>19.1&&Math.abs(s.stone-s.person)<65)assert.ok(s.aside>2*51+10,'person clears rolling corridor');
 if(t>=18.35)assert.ok(n.stone<=s.stone,'downhill monotonic');
 const nextCenter=m.terrain(n.stone,51),contactVector={x:ground.x-center.x,y:ground.y-center.y};
 const deltaAngle=n.rotation-s.rotation;
 const surfaceVelocity={x:nextCenter.x-center.x-contactVector.y*deltaAngle,y:nextCenter.y-center.y+contactVector.x*deltaAngle};
 assert.ok(Math.hypot(surfaceVelocity.x,surfaceVelocity.y)<1e-7,'no-slip contact velocity cancels translation');
}
for(const t of [6,12,17.7,18.35,85]){
 const fn=t===85?m.endingState:m.openingState;
 assert.ok(Math.abs(fn(t-.00001).stone-fn(t+.00001).stone)<.01,'cue boundary continuity');
}
console.log(JSON.stringify({result:'PASS',stanceSamples,openingFrames:720,contracts:['planted soles','reachable two-bone legs','terrain tangent','distance-linked rotation','continuous cue boundaries','clear rolling corridor']}));
