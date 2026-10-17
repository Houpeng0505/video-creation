const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
const mod={exports:{}};new Function('module','exports',ts.transpile(fs.readFileSync('src/sisyphusV4GPT6Motion.ts','utf8'),{module:ts.ModuleKind.CommonJS}))(mod,mod.exports);
const m=mod.exports,EPS=1e-5,R=51,a=Math.atan(.43),e={x:Math.cos(a),y:-Math.sin(a)},n={x:-Math.sin(a),y:-Math.cos(a)};
const dist=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y),dot=(p,q)=>p.x*q.x+p.y*q.y;
let planted=0,swing=0,rolling=0;
for(const [start,end,fn] of [[6.01,17.62,m.openingState],[78.72,89.90,m.endingState]])for(let t=start;t<end;t+=1/240){
 const st=fn(t),next=fn(t+1/240);
 for(const shift of [0,.5]){
  const v=m.foot(st.person,shift),w=m.foot(next.person,shift);
  const p=m.terrain(v.s,v.h),q=m.terrain(w.s,w.h);
  if(v.stance&&w.stance){assert(dist(p,q)<EPS,'planted foot slides at '+t);planted++;}
  else if(!v.stance){swing++;assert(v.h>=-EPS,'swing foot below slope');}
 }
}
assert(planted>1000&&swing>100,'samples need motion coverage');
for(const s of [-300,-30,90,235,425,520,775]){
 const g=m.terrain(s),c=m.terrain(s,R),v={x:c.x-g.x,y:c.y-g.y};
 assert(Math.abs(dot(v,e))<EPS,'normal not orthogonal to terrain');
 assert(Math.abs(dot(v,n)-R)<EPS,'center to terrain normal must be radius');
 const h=m.terrain(s-R*Math.sqrt(1-.37*.37),R*1.37);
 assert(Math.abs(dist(h,c)-R)<EPS,'hand not on exact radius');
}
for(const [start,end,fn] of [[6,17.65,m.openingState],[18.4,23.9,m.openingState],[79,89.9,m.endingState]])for(let t=start;t<end;t+=1/120){
 const a=fn(t),b=fn(t+1/120),p=m.terrain(a.stone,R),q=m.terrain(b.stone,R);
 const dr=b.rotation-a.rotation,rad={x:-n.x*R,y:-n.y*R};
 const vx=q.x-p.x-rad.y*dr,vy=q.y-p.y+rad.x*dr;
 assert(Math.hypot(vx,vy)<EPS,'contact velocity nonzero/rotation sign wrong at '+t);rolling++;
}
for(const t of [6,12,17.7,17.9,18.35,19.1,23.99,78.7,85]){
 const fn=t>75?m.endingState:m.openingState,A=fn(t-1e-5),B=fn(t+1e-5);
 assert(Math.abs(A.stone-B.stone)<.1&&Math.abs(A.person-B.person)<.1,'teleport near '+t);
}
for(let t=18.35;t<24;t+=1/60){const s=m.openingState(t);if(Math.abs(s.stone-s.person)<65)assert(s.aside>=112,'figure inside boulder corridor');}
console.log(JSON.stringify({status:'PASS',planted,rolling,swing,tests:['independent normal/tangent','world-space stance foot','contact radius','signed no-slip velocity','continuity','collision corridor']}));
