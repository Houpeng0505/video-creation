const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
const m={exports:{}};new Function('module','exports',ts.transpile(fs.readFileSync('src/maxwellMotion.ts','utf8'),{module:ts.ModuleKind.CommonJS}))(m,m.exports);
const P=m.exports;
assert.equal(P.packets.length,4);
assert.equal(P.crossings.length,3);
let checks=0;
for(let t=0;t<=36;t+=1/120)for(const molecule of P.molecules){
  const v=P.ambient(molecule,t);
  const lo=molecule.side==='left'?116:381,hi=molecule.side==='left'?339:603;
  assert(v.x>=lo-1e-7&&v.x<=hi+1e-7,'molecule crossed solid partition');
  assert(v.y>=411-1e-7&&v.y<=810+1e-7,'molecule left chamber');
  checks++;
}
for(const {packet,t} of P.crossings){
 const v=P.packetState(packet,t);
 assert(Math.abs(v.x-360)<8,'crossing coordinate not centered at gate');
 assert(P.doorOpen(t)>.999,'gate not open while packet crosses');
 for(let tt=t-.18;tt<=t+.18;tt+=1/120){if(Math.abs(P.packetState(packet,tt).x-360)<13)assert(P.doorOpen(tt)>.99,'wall penetration during incomplete opening');}
}
for(let t=21.55;t<23.1;t+=1/120){
 const p=P.packetState(P.packets[1],t);
 assert(p.x<=330.001,'rejected slow particle passes wall');
 assert(P.doorOpen(t)<.01,'gate opened for rejected slow particle');
}
for(let i=1;i<P.crossings.length;i++){
 assert(P.crossings[i].t-P.crossings[i-1].t>.8,'gates overlap events');
}
const fast=P.molecules.find(x=>x.kind==='fast'),slow=P.molecules.find(x=>x.kind==='slow');
assert(Math.hypot(fast.vx,fast.vy)>Math.hypot(slow.vx,slow.vy)*2,'fast molecule motion not visibly faster');
console.log(JSON.stringify({test:'PASS',ambientBoundarySamples:checks,packets:P.packets.length,gateCrossings:P.crossings.length,verified:'gate open on contact; slow rejected; boundaries; speed separation'}));
