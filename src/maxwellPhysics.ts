/** Deterministic illustrated gas: elastic walls, speed-preserving point molecules.
 * The door aperture, not particle category, decides whether passage is physical.
 */
export const BOX={left:78,right:642,top:476,bottom:822,wall:360,doorY:649,doorHalf:58,r:7};
export type Molecule={id:number;x:number;y:number;vx:number;vy:number;fast:boolean};
export type Decision={id:number;start:number;arrival:number;allowed:boolean;fast:boolean;fromLeft:boolean;done:boolean};
export type Crossing={id:number;t:number;fromLeft:boolean;fast:boolean;opening:number;y:number};
export type Snapshot={t:number;particles:Molecule[];opening:number;decision:Decision|null;energyLeft:number;energyRight:number;nLeft:number;nRight:number;crossings:number;};
export const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export const smooth=(x:number)=>{const q=clamp(x);return q*q*(3-2*q);};
export const ramp=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
export const lerp=(a:number,b:number,q:number)=>a+(b-a)*q;
const fold=(n:number,lo:number,hi:number)=>{const w=hi-lo,q=((n-lo)%(2*w)+2*w)%(2*w);return lo+(q<=w?q:2*w-q);};
const seed=(i:number,phase:number)=>{const n=Math.sin(i*78.233+phase)*43758.5453;return n-Math.floor(n);};
function reverseState(x:number,v:number,seconds:number,lo:number,hi:number){
 const w=hi-lo,z=x-lo-v*seconds,q=((z%(2*w))+2*w)%(2*w);
 return {x:lo+(q<=w?q:2*w-q),v:(q<=w?1:-1)*v};
}
export function initialMolecules(stageSeed=17.09):Molecule[]{
 const list:Molecule[]=[];
 for(let id=0;id<24;id++){
  const left=id<12,fast=id%2===0;
  const speed=fast?150:59,a=seed(id+17,stageSeed)*Math.PI*2;
  list.push({id,x:(left?96:382)+seed(id+3,stageSeed)*237,y:497+seed(id+75,stageSeed)*302,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,fast});
 }
 // Deliberate staging at t=13, back-propagated through the SAME closed chamber.
 for(const [id,x,y,vx,vy] of [[0,244,639,150,9],[1,200,666,59,-2],[2,104,613,150,21],[13,492,664,-59,-3],[4,132,691,145,-17],[15,594,624,-59,5]]){
  const p=list[id],left=x<360;
  const xx=reverseState(x,vx,13,left?BOX.left+BOX.r:BOX.wall+BOX.r+3,left?BOX.wall-BOX.r-3:BOX.right-BOX.r);
  const yy=reverseState(y,vy,13,BOX.top+BOX.r,BOX.bottom-BOX.r);
  p.x=xx.x;p.vx=xx.v;p.y=yy.x;p.vy=yy.v;
 }
 return list;
}
export function simulate(stageSeed=17.09){
 const particles=initialMolecules(stageSeed),frames:Snapshot[]=[],crossings:Crossing[]=[],decisions:Decision[]=[],observations:Decision[]=[];
 const dt=1/120;let target:Decision|null=null,opening=0,closeFrom=0,closeAt=-1,lastId=-1,cooldown=0;
 let maxWallOverlap=0,maxStep=0;
 const initialEnergy=particles.reduce((s,p)=>s+p.vx*p.vx+p.vy*p.vy,0);
 for(let step=0;step<=90*120;step++){
  const t=step*dt,previousOpening=opening,active=t>=13&&t<37||t>=43&&t<55.05||t>=74;
  if(active&&step%6===0)for(const p of particles){
   const eta=(360-p.x)/p.vx,yy=fold(p.y+p.vy*eta,BOX.top+BOX.r,BOX.bottom-BOX.r);
   if(eta>.12&&eta<1.1&&Math.abs(yy-BOX.doorY)<BOX.doorHalf-BOX.r){const left=p.x<360;observations.push({id:p.id,start:t,arrival:t+eta,allowed:left?p.fast:!p.fast,fast:p.fast,fromLeft:left,done:false});}
  }
  if(target&&target.done&&t>cooldown){closeFrom=opening;closeAt=t;target=null;}
  if(!target){
   opening=closeAt>=0?closeFrom*(1-ramp(t,closeAt,closeAt+.22)):0;
   if(active&&opening<.01&&t>cooldown){
    const options=particles.map(p=>{
     const left=p.x<360,towards=left?p.vx>0:p.vx<0;
     const eta=towards?(360-p.x)/p.vx:100;
     const yy=fold(p.y+p.vy*eta,BOX.top+BOX.r,BOX.bottom-BOX.r);
     return {p,eta,yy,left};
    }).filter(o=>o.eta>.70&&o.eta<1.05&&Math.abs(o.yy-BOX.doorY)<BOX.doorHalf-BOX.r-7&&!(o.p.id===lastId&&t<cooldown+.3)).sort((a,b)=>a.eta-b.eta);
    const safeOptions=options.filter(o=>{
     if(!(o.left?o.p.fast:!o.p.fast))return true;
     return !particles.some(p=>{if(p.id===o.p.id)return false;const left=p.x<360,unwanted=left?!p.fast:p.fast,eta=(360-p.x)/p.vx,yy=fold(p.y+p.vy*eta,BOX.top+BOX.r,BOX.bottom-BOX.r);return unwanted&&eta>0&&eta<o.eta+.74&&Math.abs(yy-BOX.doorY)<BOX.doorHalf+BOX.r;});
    });
    if(safeOptions.length){const o=safeOptions[0];target={id:o.p.id,start:t,arrival:t+o.eta,allowed:o.left?o.p.fast:!o.p.fast,fast:o.p.fast,fromLeft:o.left,done:false};decisions.push({...target});lastId=o.p.id;closeAt=-1;}
   }
  }
  if(target){
   opening=target.allowed?ramp(t,target.start+.28,target.start+.48):0;
   if(!target.done&&!target.allowed&&t>target.arrival+.17){target.done=true;cooldown=t+.03;}
   if(!target.done&&target.allowed&&t>target.arrival+1.2){target.done=true;cooldown=t+.08;}
  }
  // Never close across a molecule already occupying the doorway tube.
  if(previousOpening>.1&&particles.some(p=>Math.abs(p.x-360)<BOX.r+3.1&&Math.abs(p.y-BOX.doorY)+BOX.r<BOX.doorHalf*previousOpening))opening=Math.max(opening,previousOpening);
  if(step%4===0){
   const left=particles.filter(p=>p.x<360),right=particles.filter(p=>p.x>=360);
   const energy=(a:Molecule[])=>a.reduce((sum,p)=>sum+p.vx*p.vx+p.vy*p.vy,0)/Math.max(1,a.length);
   frames.push({t,particles:particles.map(p=>({...p})),opening,decision:target?{...target}:null,energyLeft:energy(left),energyRight:energy(right),nLeft:left.length,nRight:right.length,crossings:crossings.length});
  }
  if(step===90*120)break;
  for(const p of particles){
   const oldX=p.x,oldY=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;
   if(p.x<BOX.left+BOX.r){p.x=2*(BOX.left+BOX.r)-p.x;p.vx=Math.abs(p.vx);}
   if(p.x>BOX.right-BOX.r){p.x=2*(BOX.right-BOX.r)-p.x;p.vx=-Math.abs(p.vx);}
   if(p.y<BOX.top+BOX.r){p.y=2*(BOX.top+BOX.r)-p.y;p.vy=Math.abs(p.vy);}
   if(p.y>BOX.bottom-BOX.r){p.y=2*(BOX.bottom-BOX.r)-p.y;p.vy=-Math.abs(p.vy);}
   const approaching=(oldX<360&&p.vx>0&&p.x>360-BOX.r-3)||(oldX>360&&p.vx<0&&p.x<360+BOX.r+3);
   const clear=Math.abs(p.y-BOX.doorY)+BOX.r<BOX.doorHalf*opening;
   if(approaching&&!clear){
    if(Math.abs(oldX-360)>=BOX.r+3){
     const boundary=oldX<360?360-BOX.r-3:360+BOX.r+3;
     p.x=2*boundary-p.x;p.vx=-p.vx;
    }else{
     const edge=BOX.doorY+(p.y>BOX.doorY?1:-1)*(BOX.doorHalf*opening-BOX.r);
     p.y=2*edge-p.y;p.vy=-p.vy;
    }
   }
   if((oldX<360)!==(p.x<360)){
    crossings.push({id:p.id,t:t+dt,fromLeft:oldX<360,fast:p.fast,opening,y:p.y});
    if(target?.id===p.id){target.done=true;cooldown=t+.31;}
   }
   if(Math.abs(p.x-360)<BOX.r+2&&Math.abs(p.y-BOX.doorY)+BOX.r>BOX.doorHalf*opening+1e-7)maxWallOverlap++;
   maxStep=Math.max(maxStep,Math.hypot(p.x-oldX,p.y-oldY));
  }
 }
 const finalEnergy=particles.reduce((s,p)=>s+p.vx*p.vx+p.vy*p.vy,0);
 return {frames,crossings,decisions,observations,initialEnergy,finalEnergy,maxWallOverlap,maxStep};
}
export const gas=simulate();
export const stateAt=(t:number)=>gas.frames[Math.max(0,Math.min(2700,Math.round(t*30)))];
export const memoryRecordTimes=Array.from({length:16},(_,i)=>i<3?44.0+i*1.55:49.2+(i-3)*.47);
export function memoryRecord(i:number){const t=memoryRecordTimes[i],frame=stateAt(t),p=frame.particles[(i*7+4)%24];return {time:t,id:p.id,bit:p.fast?1:0};}
