const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');const mod={exports:{}};
new Function('module','exports',ts.transpile(fs.readFileSync('src/maxwellPhysics.ts','utf8'),{module:ts.ModuleKind.CommonJS}))(mod,mod.exports);
const m=mod.exports,g=m.gas,B=m.BOX;
const stats={crossings:g.crossings.length,prototypeCrossings:g.crossings.filter(e=>e.t>=13&&e.t<23),wrong:g.crossings.filter(e=>e.fromLeft!==e.fast),maxWallOverlap:g.maxWallOverlap,maxStep:g.maxStep,energyError:g.finalEnergy-g.initialEnergy,ratioAt13:m.stateAt(13).energyRight/m.stateAt(13).energyLeft,ratioAt23:m.stateAt(23).energyRight/m.stateAt(23).energyLeft,ratioAt30:m.stateAt(30).energyRight/m.stateAt(30).energyLeft};
console.log(JSON.stringify(stats,null,2));
assert.equal(g.frames.length,2701);assert.equal(g.maxWallOverlap,0,'closed wall intersection');assert.ok(Math.abs(stats.energyError)<1e-6);
assert.equal(stats.wrong.length,0,'an unwanted category passed through the open door');assert.ok(stats.prototypeCrossings.length>=3,'prototype needs clear multiple sorting events');assert.ok(stats.ratioAt23>stats.ratioAt13+.12,'visible temperature difference develops');
for(const f of g.frames){assert.equal(f.particles.length,24);for(const [index,p] of f.particles.entries()){assert.equal(p.id,index);const initial=g.frames[0].particles[index];assert.equal(p.fast,initial.fast);assert.ok(Math.abs(p.vx*p.vx+p.vy*p.vy-initial.vx*initial.vx-initial.vy*initial.vy)<1e-6);assert.ok(p.x>=B.left+B.r-1e-7&&p.x<=B.right-B.r+1e-7&&p.y>=B.top+B.r-1e-7&&p.y<=B.bottom-B.r+1e-7);}}
assert.ok(g.maxStep<1.4,'no jump in particle position at 120Hz');
for(const e of g.crossings){assert.ok(Math.abs(e.y-B.doorY)+B.r<B.doorHalf*e.opening,'gate clearance');const d=g.observations.filter(d=>d.id===e.id&&d.start<e.t-.16&&d.allowed).at(-1);assert.ok(d,'observe before passage');}
console.log('PASS: deterministic identities, conserved energy, reflected walls, observed selective passage, finite aperture and warming trend.');
fs.mkdirSync('out/maxwell',{recursive:true});fs.writeFileSync('out/maxwell/physics_report.json',JSON.stringify({result:'PASS',...stats,decisions:g.decisions,crossings:g.crossings,memory:Array.from({length:16},(_,i)=>m.memoryRecord(i))},null,2));
