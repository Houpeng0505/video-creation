/** GPT-6 V4 comparison branch.
 * Canonical slope basis in SCREEN coordinates: tangent e=(cosθ,-sinθ),
 * outward normal n=(-sinθ,-cosθ), with downhill = -e.
 * Keep V4's corrected no-slip sign: positive SVG rotation during uphill motion.
 * New visual authoring eliminates motion-dependent foot position blending.
 */
export type P={x:number;y:number};
export const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export const smooth=(x:number)=>{const q=clamp(x);return q*q*(3-2*q);};
export const ramp=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const slope=.43;
export const angle=Math.atan(slope);
export const terrain=(s:number,h=0):P=>({x:74+Math.cos(angle)*s-Math.sin(angle)*h,y:848-Math.sin(angle)*s-Math.cos(angle)*h});
export const stepLength=62;
export function foot(distance:number,offset:number):{s:number;h:number;stance:boolean}{
 const q=distance/stepLength+offset,n=Math.floor(q),u=q-n;
 const anchor=(n-offset)*stepLength+stepLength*.31;
 if(u<.62)return {s:anchor,h:0,stance:true};
 const v=(u-.62)/.38;
 return {s:anchor+stepLength*smooth(v),h:18*Math.sin(Math.PI*v)**2,stance:false};
}
export function joint(a:P,b:P,l1:number,l2:number,side=1):P{
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(.001,Math.hypot(dx,dy));
 const k=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-k*k));
 return {x:a.x+dx*k/d-side*dy*height/d,y:a.y+dy*k/d+side*dx*height/d};
}
export const stoneRadius=51;
export function ascent(t:number):number{
 if(t<6)return 235;
 if(t<12)return lerp(235,425,ramp(t,6,12));
 return lerp(425,520,ramp(t,12,17.9));
}
export function fall(t:number):number{
 const p=clamp((t-18.35)/5.65);
 return 520-430*p*p;
}
export function openingState(t:number){
 const released=t>=18.35;
 const stone=released?fall(t):ascent(t);
 const retreat=ramp(t,17.7,19.1);
 return {stone,person:(t>=17.7?ascent(17.7)-109:ascent(t)-109)+retreat*40,aside:retreat*120+24*Math.sin(Math.PI*retreat),released,rotation:(stone-235)/stoneRadius};
}
export function endingState(t:number){
 const s=lerp(228,487,ramp(t,78.7,90));
 return {stone:s,person:s-109,rotation:(s-228)/stoneRadius};
}
