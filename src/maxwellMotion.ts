/** Maxwell Demon: deterministic 2D chamber / sensor / gate model. Coordinates in SVG world units.
 * All animated molecules share this source of truth. A wall at x=360 is solid except aperture 578..642.
 */
export type Kind='fast'|'slow';
export const W={left:104,right:616,top:395,bottom:825,wall:360,apTop:578,apBottom:642};
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const smooth=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
export const ramp=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
export const mix=(a:number,b:number,k:number)=>a+(b-a)*k;
export const hash=(n:number)=>{const x=Math.sin(32.17*n+119.92)*43876.21;return x-Math.floor(x)};
export const fold=(x:number,lo:number,hi:number)=>{
 const len=hi-lo,q=((x-lo)%(2*len)+2*len)%(2*len);return lo+(q>len?2*len-q:q);
};
export type Molecule={id:number;kind:Kind;side:'left'|'right';x:number;y:number;vx:number;vy:number};
export const molecules:Molecule[]=Array.from({length:25},(_,id)=>{
 const side=id%2===0?'left':'right';
 const kind=id%4<2?'fast':'slow';
 const speed=kind==='fast'?53:19;
 const ang=hash(id+3)*Math.PI*2;
 return {id,kind,side,x:side==='left'?121+hash(id+61)*209:390+hash(id+61)*209,y:412+hash(id+43)*394,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed};
});
export const ambient=(m:Molecule,t:number)=>{
 const lo=m.side==='left'?116:381,hi=m.side==='left'?339:603;
 return {x:fold(m.x+m.vx*t,lo,hi),y:fold(m.y+m.vy*t,411,810)};
};
/** Hero molecules are a separate, explicit controlled thought-experiment lane.
 * Hot packets left→right; one cold approach on left is rejected; a cold right→left packet admitted.
 * Fast and slow in the same chamber are distinguishable by path length over equal time.
 */
export type Packet={id:string;kind:Kind;mode:'cross'|'reflect';start:number;end:number;from:number;to:number;y:number};
export const packets:Packet[]=[
 {id:'H1',kind:'fast',mode:'cross',start:18.55,end:21.0,from:195,to:525,y:610},
 {id:'C0',kind:'slow',mode:'reflect',start:20.95,end:23.35,from:260,to:330,y:610},
 {id:'H2',kind:'fast',mode:'cross',start:23.05,end:25.65,from:192,to:523,y:610},
 {id:'C1',kind:'slow',mode:'cross',start:25.73,end:28.37,from:532,to:196,y:610},
];
export function packetState(packet:Packet,t:number){
 const u=clamp((t-packet.start)/(packet.end-packet.start));
 const curve=packet.mode==='reflect'?(u<.5?smooth(2*u):smooth(2-2*u)):smooth(u);
 const x=mix(packet.from,packet.to,curve);
 return {x,y:packet.y,active:t>=packet.start&&t<=packet.end,progress:u,crossed:packet.mode==='cross'&&((packet.from<360)?x>360:x<360)};
}
export const crossings=packets.filter(p=>p.mode==='cross').map(p=>({
 packet:p,
 // The symmetric smoothstep crosses the wall at ~0.5 of its period.
 t:p.start+(p.end-p.start)*.5,
}));
export const doorOpen=(t:number)=>Math.max(0,...crossings.map(({t:c})=>ramp(t,c-.57,c-.30)*(1-ramp(t,c+.30,c+.59))));
export const memoryLevel=(t:number)=>Math.round(24*clamp((t-54.5)/6.1));
export const eraseProgress=(t:number)=>ramp(t,64.0,66.6);
