export const R=1.25;
export const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=x=>{const v=clamp(x);return v*v*(3-2*v)};
export const ground=x=>-1.65+.27*x;
export function state(t){
 const pushing=t<3.25;
 const rockX=pushing?-.3+2.4*ease(t/3.25):2.1-5.4*ease((t-3.25)/2.75);
 const heroX=pushing?rockX-2.6:-.5;
 const rock={x:rockX,y:ground(rockX)+R,z:0};
 const hand={x:rock.x-.87*R,y:rock.y+.25*R,z:0};
 const feet=[heroX-.76,heroX+.62].map((x,i)=>({x,y:ground(x)+.08,z:i===0?-.35:.35}));
 return {t,pushing,rockX,heroX,rock,hand,feet,rockRotation:-(rockX+.3)/R};
}
export function verify(t){
 const s=state(t);
 if(Math.abs(s.rock.y-R-ground(s.rock.x))>1e-8)throw Error("Rock-ground detachment");
 for(const foot of s.feet)if(Math.abs(foot.y-ground(foot.x)-.08)>1e-8)throw Error("Foot-ground detachment");
 if(s.pushing && s.hand.x>=s.rock.x)throw Error("Hand on wrong side of rock");
 return s;
}
