import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import story from '../content/sisyphus_v3.json';
import {P,terrain,foot,joint,ramp,lerp,clamp,openingState,endingState,stoneRadius,angle} from './sisyphusV4GPT6Motion';

const C={bg:'#101c2b',night:'#172b3b',ink:'#293e4a',cream:'#eee6d3',gold:'#dfb87b',copper:'#c58265',mint:'#88b9ae',muted:'#91a3a7',red:'#db8c7f'};
const font="'Microsoft YaHei','Noto Sans CJK SC',sans-serif";
const T=({x=360,y,size=30,color=C.cream,children,opacity=1,anchor='middle',spacing=0}:{x?:number;y:number;size?:number;color?:string;children:React.ReactNode;opacity?:number;anchor?:'middle'|'start'|'end';spacing?:number})=><text x={x} y={y} fill={color} fontFamily={font} fontSize={size} textAnchor={anchor} letterSpacing={spacing} opacity={opacity}>{children}</text>;
const line=(a:P,b:P)=>`M${a.x} ${a.y}L${b.x} ${b.y}`;
const D=({a,b,color=C.cream,w=5,opacity=1}:{a:P;b:P;color?:string;w?:number;opacity?:number})=><path d={line(a,b)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" opacity={opacity}/>;
const Title=({kicker,title,sub,alpha=1}:{kicker:string;title:string;sub?:string;alpha?:number})=><g opacity={alpha}><T y={208} size={14} color={C.gold} spacing={5}>{kicker}</T><T y={269} size={39}>{title}</T>{sub&&<T y={312} size={20} color={C.muted}>{sub}</T>}</g>;

function Boulder({s,rotation=0,r=stoneRadius,h=r,color=C.gold}:{s:number;rotation?:number;r?:number;h?:number;color?:string}){
 const p=terrain(s,h);
 return <g data-object="boulder"><ellipse cx={terrain(s).x} cy={terrain(s).y+4} rx={r*.82} ry={r*.16} fill="#060e17" opacity=".48" transform={`rotate(${-angle*180/Math.PI} ${terrain(s).x} ${terrain(s).y})`}/><g transform={`translate(${p.x} ${p.y}) rotate(${rotation*180/Math.PI})`}>
 <circle r={r} fill="url(#stone)" stroke={color} strokeWidth={3}/>
 <path d={`M${-r*.7} ${-r*.34}L${-r*.15} ${-r*.75}L${r*.51} ${-r*.43}L${r*.76} ${r*.15}L${r*.34} ${r*.61}L${-r*.42} ${r*.64}Z`} fill="none" stroke={color} strokeWidth="1.6" opacity=".46"/>
 <path d={`M${-r*.15} ${-r*.75}L${r*.1} ${-r*.14}L${r*.76} ${r*.15}M${r*.1} ${-r*.14}L${-r*.42} ${r*.64}M${-r*.7} ${-r*.34}L${r*.1} ${-r*.14}L${r*.34} ${r*.61}`} fill="none" stroke={color} strokeWidth="1.2" opacity=".4"/>
 <circle cx={-r*.38} cy={-r*.48} r={r*.085} fill={C.cream}/>
 </g></g>;
}

function Person({s,rock,walk=true,gait=1,aside=0,release=0,scale=1,color=C.cream,brace=0}:{s:number;rock?:number;walk?:boolean;gait?:number;aside?:number;release?:number;scale?:number;color?:string;brace?:number}){
 const amount=walk?gait:0,fa=foot(s,0),fb=foot(s,.5);
 // Each stance foot is defined in slope world coordinates and NEVER blended toward the hip.
 // Rendering-side gait easing is reserved for arm swing and torso compression.
 const f1=fa, f2=fb;
 const bob=amount*1.5*Math.cos(s/62*Math.PI*4);
 // Arm and shoulder follow release, but contact is still computed from the rock's surface.
 const tr=(ss:number,hh:number)=>terrain(s+(ss-s)*scale,(hh*scale)+aside);
 const upright=rock===undefined?1:release;
 const hip=tr(s-5,56+11*upright+bob),shoulder=tr(s+lerp(15,1,upright)+8*brace,99+11*upright+bob-9*brace);
 const head=tr(s+lerp(15,1,upright)+6*brace,127+11*upright+bob-5*brace);
 const a=tr(f1.s,f1.h),b=tr(f2.s,f2.h);
 const ka=joint(hip,a,36*scale,37*scale,-1),kb=joint(hip,b,36*scale,37*scale,-1);
 const swing=Math.sin(s/62*Math.PI*2)*18*amount;
 const rest=tr(s+9+swing,66);
 const contact=rock!==undefined?terrain(rock-stoneRadius*Math.sqrt(1-.37**2),stoneRadius*1.37):rest;
 const hand={x:lerp(contact.x,rest.x,release),y:lerp(contact.y,rest.y,release)};
 const backShoulder={x:shoulder.x-5,y:shoulder.y+7};
 const backHand=rock!==undefined?{x:hand.x-4,y:hand.y+9}:tr(s-12-swing,68);
 const elbow=joint(shoulder,hand,34*scale,35*scale,1),backElbow=joint(backShoulder,backHand,34*scale,35*scale,1);
 const limb=(aa:P,k:P,bb:P,c:string,w:number)=><path d={`${line(aa,k)}L${bb.x} ${bb.y}`} fill="none" stroke={c} strokeWidth={w*scale} strokeLinecap="round" strokeLinejoin="round"/>;
 return <g data-object="person">
 {limb(hip,kb,b,C.muted,7)}{limb(backShoulder,backElbow,backHand,C.muted,6)}
 <path d={`${line(hip,shoulder)}`} stroke={color} strokeWidth={11*scale} strokeLinecap="round"/>
 <D a={shoulder} b={{x:head.x,y:head.y+13*scale}} color={color} w={5*scale}/>
 <path d={`${line(hip,shoulder)}`} stroke={C.gold} strokeWidth={3*scale} strokeLinecap="round" opacity=".7"/>
 {limb(hip,ka,a,color,8)}{limb(shoulder,elbow,hand,color,7)}
 <circle cx={head.x} cy={head.y} r={15*scale} fill={C.bg} stroke={color} strokeWidth={4*scale}/>
 <path d={`M${head.x-9*scale} ${head.y-7*scale}q${11*scale} ${-11*scale} ${21*scale} ${1*scale}`} fill="none" stroke={C.gold} strokeWidth={3*scale}/>
 {[a,b].map((p,i)=><path key={i} d={`M${p.x-5*scale} ${p.y+2*scale}l${15*scale} ${-6.45*scale}`} stroke={i===0?color:C.muted} strokeWidth={5*scale} strokeLinecap="round"/>)}
 </g>;
}

function Landscape({t=0,ledge=false}:{t?:number;ledge?:boolean}){
 const start=terrain(-300),end=terrain(1300);
 return <g>
 <circle cx="579" cy="409" r="88" fill={C.gold} opacity=".055"/><circle cx="579" cy="409" r="60" fill="none" stroke={C.gold} opacity=".2"/>
 <path d="M-100 790L75 556L220 686L436 414L738 671L850 840V1100H-100Z" fill="#213545"/>
 <path d="M-80 887L171 729L317 828L545 542L823 842V1150H-80Z" fill="#29404c"/>
 <path d={`M${start.x} ${start.y}L${end.x} ${end.y}L1300 1600H-500Z`} fill="#1b2a35"/>
 <D a={start} b={end} color={C.gold} w={3}/>
 <D a={terrain(-300,-7)} b={terrain(1300,-7)} color={C.muted} w={1} opacity={.4}/>
 {Array.from({length:11},(_,i)=>{const p=terrain(i*75-100,-35);return <path key={i} d={`M${p.x} ${p.y}l40 -17m-14 35l32 -14`} fill="none" stroke={C.gold} opacity=".07"/>;})}
 {ledge&&<g opacity={ramp(t,16.8,17.5)}><path d={`${line(terrain(412,120),terrain(505,120))}L${terrain(582,0).x} ${terrain(582,0).y}L${terrain(348,0).x} ${terrain(348,0).y}Z`} fill="#29414c"/><D a={terrain(412,120)} b={terrain(505,120)} color={C.mint} w={4}/><D a={terrain(505,120)} b={terrain(582,0)} color={C.muted} w={1} opacity={.3}/><path d={`${line(terrain(403,15),terrain(433,100))}`} fill="none" stroke={C.mint} strokeWidth="1.5" strokeDasharray="3 5" opacity=".5"/></g>}
 </g>;
}

function Ascent({t,ending=false}:{t:number;ending?:boolean}){
 const st=ending?{...endingState(t),aside:0,released:false}:openingState(t);
 const zoom=ending?lerp(1.12,.72,ramp(t,84.8,90)):lerp(1,1.19,ramp(t,11.5,17));
 const cameraX=ending?lerp(-22,110,ramp(t,84.8,90)):-22*ramp(t,11.5,17);
 const cameraY=ending?lerp(-10,70,ramp(t,84.8,90)):-40*ramp(t,11.5,17);
 const release=ending?0:ramp(t,17.55,17.8);
 return <g>
 <Title kicker={ending?'IV / LA RÉVOLTE':'I / LE MYTHE'} title={ending?(t<85?'再次出发':'清醒之后，仍然向前'):(t<6?'没有终点的刑罚':t<12?'把巨石推向山顶':t<18?'终点，近在眼前':'一切重新开始')} sub={ending?'选择仍然属于他':t<18?'每一步，都是向上的挣扎':'巨石落下，命运再次归零'}/>
 <g transform={`translate(${cameraX} ${cameraY}) translate(360 610) scale(${zoom}) translate(-360 -610)`}>
 <Landscape t={t} ledge={!ending}/>
 {!ending&&t<6&&<g opacity={1-ramp(t,4.7,6)}>{[140,245,350,455,560].map((x,i)=><path key={i} d={`M${x} ${lerp(900,394,ramp(t,.3+i*.18,2.3+i*.18))}V913`} stroke={C.copper} strokeWidth="2" opacity=".5"/>)}<path d="M114 908H604" stroke={C.copper} strokeWidth="3" opacity={ramp(t,.8,3.5)}/></g>}
 <path d={`${line(terrain(98,-22),terrain(st.stone,-22))}`} stroke={ending?C.mint:C.gold} strokeWidth="4" strokeLinecap="round" opacity=".65"/>
 <Person s={st.person} rock={st.released?undefined:st.stone} aside={st.aside} release={release} brace={!ending?ramp(t,16.7,17.3)*(1-ramp(t,17.75,18.25)):0} walk={ending||t>=6&&t<17.55} gait={ending?ramp(t,78.7,79.3):ramp(t,6,6.4)*(1-ramp(t,17.15,17.55))}/>
 <Boulder s={st.stone} rotation={st.rotation} color={!ending&&t>18.35?C.copper:C.gold}/>
 {!ending&&t>=17.7&&t<=20.0&&<g opacity={.5*(ramp(t,17.7,18.0))*(1-ramp(t,19.1,20.0))}><path d={`${line(terrain(ascent(17.7)-109,14),terrain(ascent(17.7)-69,120))}`} fill="none" stroke={C.mint} strokeWidth="2" strokeDasharray="5 8"/></g>}
 {!ending&&t>18.35&&<g opacity={ramp(t,18.35,19)*(1-ramp(t,23,24))}>{Array.from({length:9},(_,i)=>{const q=clamp((t-18.35)*1.5-i*.1);const p=terrain(st.stone+35+i*8,5+Math.sin(q*Math.PI)*18);return <circle key={i} cx={p.x} cy={p.y} r={1.5+(i%3)} fill={C.copper} opacity={.3}/>;})}</g>}
 </g>
 {!ending&&t>6&&t<24&&<g><path d="M110 915H610" stroke={C.muted} strokeWidth="2" opacity=".3"/><path d={`M110 915H${110+500*clamp((st.stone-90)/435)}`} stroke={t<18.35?C.gold:C.copper} strokeWidth="4"/><T x={110} y={947} size={15} color={C.muted} anchor="start">{t<18.35?'攀登的进度':'回到起点'}</T><T x={610} y={947} size={17} color={C.gold} anchor="end">{Math.round(clamp((st.stone-90)/435)*99)}%</T></g>}
 </g>;
}

function Circuit({t}:{t:number}){
 const p=ramp(t,24,25.1),a=(t-24)*1.15-Math.PI*.55,r=187;
 return <g opacity={p}><Title kicker="I / SANS FIN" title="没有真正的结束" sub="付出无法累积成一个结局"/>
 <circle cx="360" cy="615" r="225" fill="none" stroke={C.gold} strokeWidth="1" opacity=".15"/>
 <circle cx="360" cy="615" r={r} fill="none" stroke={C.muted} strokeWidth="3" strokeDasharray="3 10"/>
 <path d="M194 700A187 187 0 1 1 538 560" fill="none" stroke={C.gold} strokeWidth="6"/><path d="M522 550L539 570L551 544" fill="none" stroke={C.gold} strokeWidth="4"/>
 <g transform={`translate(${360+Math.cos(a)*r} ${615+Math.sin(a)*r}) rotate(${a*180/Math.PI})`}><circle r="28" fill={C.ink} stroke={C.gold} strokeWidth="3"/><path d="M-16 -8L5 -18L16 5L-6 16Z" fill="none" stroke={C.cream} strokeWidth="1"/></g>
 <T y={605} size={48} color={C.cream}>∞</T><T y={646} size={18} color={C.muted}>努力 · 归零 · 再来</T>
 <T y={918} size={19} color={C.copper}>没有胜利  /  没有奖赏</T></g>;
}

function Myth({t}:{t:number}){
 const p=ramp(t,30,31.4),s=lerp(260,340,ramp(t,31,35.8));
 return <g><Title kicker="GREEK MYTHOLOGY" title="西西弗斯" sub="Σ Ι Σ Υ Φ Ο Σ"/>
 <g transform={`translate(360 625) scale(${lerp(.86,1,p)}) translate(-360 -625)`} opacity={p}>
 <path d="M105 852V454L360 362L615 454V852Z" fill="#213643" stroke={C.gold} strokeWidth="2"/>
 <path d="M90 459L360 356L630 459M90 852H630M112 874H608" fill="none" stroke={C.gold} strokeWidth="5"/>
 {[145,575].map(x=><g key={x}><path d={`M${x} 491V820`} stroke={C.gold} strokeWidth="24" opacity=".23"/><path d={`M${x-22} 484H${x+22}M${x-22} 823H${x+22}`} stroke={C.gold} strokeWidth="4"/>{[-7,0,7].map(n=><path key={n} d={`M${x+n} 497V810`} stroke={C.gold} opacity=".4"/>)}</g>)}
 <circle cx="360" cy="646" r="159" fill={C.bg} stroke={C.gold} strokeWidth="2"/>
 <g transform="translate(119 231) scale(.66)"><D a={terrain(100)} b={terrain(590)} color={C.gold} w={4}/><Person s={s-109} rock={s}/><Boulder s={s} rotation={(s-260)/51}/></g>
 </g><T y={933} size={16} color={C.muted} spacing={4}>神话中的推石者</T></g>;
}

function Repetition({t}:{t:number}){
 return <g><Title kicker="II / L'EFFORT INUTILE" title="一次，又一次" sub="所有的挣扎，都被带回原点"/>
 {[0,1,2].map(i=>{const q=clamp((t-36-i*.55)/5.4),v=q<.56?ramp(q,0,.56):1-ramp(q,.56,1);const x=220+v*330,y=493+i*153-.28*(x-163)-25*Math.sqrt(1+.28**2);return <g key={i} opacity={ramp(t,36+i*.18,36.7+i*.18)}><path d={`M163 ${493+i*153}l414 ${-414*.28}`} stroke={C.muted} strokeWidth="2"/><path d={`M163 ${503+i*153}l${(x-163)} ${-.28*(x-163)}`} stroke={q<.56?C.gold:C.copper} strokeWidth="3"/><g transform={`translate(${x} ${y}) rotate(${v*330*Math.sqrt(1+.28**2)/25*180/Math.PI})`}><circle r="25" fill={C.ink} stroke={q<.56?C.gold:C.copper} strokeWidth="3"/><path d="M-13 -13L10 -17L15 11L-7 14Z" stroke={C.cream} fill="none" opacity=".5"/></g><T x={111} y={494+i*153} size={18} color={C.gold}>{'0'+(i+1)}</T></g>;})}
 <T y={924} size={20} color={C.copper}>终点并未因此靠近</T></g>;
}

function Book({t}:{t:number}){
 const open=ramp(t,43.1,45),question=ramp(t,44.7,47),reveal=ramp(t,46.8,49.4);
 return <g><Title kicker="1942 / ALBERT CAMUS" title="荒诞的英雄" sub="加缪重新凝视这个古老的神话"/>
 <g transform={`translate(360 690) scale(${lerp(.8,1,open)} 1) translate(-360 -690)`}>
 <path d="M104 450Q228 416 360 472Q496 416 616 450V832Q489 799 360 853Q229 799 104 832Z" fill={C.cream} stroke={C.gold} strokeWidth="3"/>
 <path d="M360 473V851" stroke={C.copper} strokeWidth="2"/>
 {[0,1,2,3,4].map(i=><path key={i} d={`M141 ${518+i*44}Q226 ${498+i*44} 320 ${528+i*44}`} fill="none" stroke={C.ink} strokeWidth="2" opacity={.13+open*.2}/>)}
 <T x={479} y={670} size={143} color={C.ink} opacity={question*(1-reveal*.8)}>?</T>
 <path d={`M360 473Q${360-165*open} 374 ${360-232*open} 444V824Q${360-116*open} 770 360 853Z`} fill={C.gold} opacity={(1-open)*.9}/>
 <g opacity={reveal}><path d="M400 766L578 683" stroke={C.copper} strokeWidth="3"/><circle cx="530" cy="674" r="29" fill="none" stroke={C.ink} strokeWidth="3"/><path d="M462 738L469 703L493 691M469 703L456 680M462 738L441 762M462 738L480 743" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round"/><circle cx="453" cy="665" r="9" fill="none" stroke={C.ink} strokeWidth="3"/></g>
 </g><T y={935} size={18} color={C.gold}>《西西弗神话》</T></g>;
}

function Silence({t}:{t:number}){
 const local=t-50,blank=ramp(local,4.8,6.7);
 return <g><Title kicker="II / L'ABSURDE" title="渴望意义，遭遇沉默"/>
 <path d="M360 376V863" stroke={C.muted} strokeWidth="1" opacity=".35"/>
 <T x={180} y={417} size={21} color={C.mint}>人的追问</T><T x={538} y={417} size={21} color={C.muted}>世界</T>
 <circle cx="176" cy="637" r="76" stroke={C.mint} strokeWidth="2" fill={C.night}/>
 <path d="M149 692L160 650L184 629L214 607M160 650L135 630M149 692L125 726M149 692L171 718" fill="none" stroke={C.cream} strokeWidth="5" strokeLinecap="round"/><circle cx="178" cy="608" r="12" stroke={C.cream} strokeWidth="3" fill="none"/>
 <circle cx="543" cy="639" r="119" fill="#0b1520" stroke={C.muted} strokeWidth="1" opacity=".85"/>
 {[0,1,2].map(i=>{const q=clamp((local-.5-i*.75)/3.5),x=lerp(254,554,q),fade=ramp(q,0,.1)*(1-ramp(q,.6,1));return <g key={i} opacity={fade}><path d={`M${x} 611Q${x+26} 639 ${x} 667`} fill="none" stroke={C.mint} strokeWidth="4"/><circle cx={x-13} cy="639" r="4" fill={C.gold}/></g>;})}
 <path d="M259 639H428" stroke={C.muted} strokeDasharray="4 8" opacity=".3"/>
 <T x={541} y={646} size={31} color={C.muted} opacity={blank*.7}>···</T>
 <T y={900} size={20} color={C.muted} opacity={ramp(local,3.7,5.5)}>没有回应的回声</T></g>;
}

function Gravity({t}:{t:number}){
 const q=clamp((t-57.1)/6.4),s=lerp(550,100,q*q);
 const p=terrain(s,51);
 return <g><Title kicker="III / LA CONDITION" title="石头仍然会落下" sub="重力没有因愿望而改变"/><Landscape/>
 <path d={`${line(terrain(550,51),p)}`} stroke={C.copper} opacity=".25" strokeWidth="2" strokeDasharray="4 7"/>
 <Boulder s={s} rotation={(s-550)/51} color={C.copper}/>
 <path d={`M${p.x} ${p.y+74}v57m-9 -12l9 12l9 -12`} fill="none" stroke={C.copper} strokeWidth="2" opacity={1-ramp(q,.87,1)}/>
 </g>;
}

function Choice({t}:{t:number}){
 const s=lerp(205,333,ramp(t,65.2,70.6));
 return <g><Title kicker="III / LE CHOIX" title="下一步，由他决定" sub="命运之外，仍有选择的余地"/><Landscape/>
 <g opacity={1-ramp(t,65.3,67)}><circle cx={terrain(205,60).x} cy={terrain(205,60).y} r="93" fill="none" stroke={C.mint} strokeWidth="1.5"/></g>
 {[202,234,266,298].map((ss,i)=>{const p=terrain(ss,-3);return <path key={i} d={`M${p.x-5} ${p.y}l17 -7`} stroke={C.mint} strokeWidth="5" strokeLinecap="round" opacity={ramp(s,ss+14,ss+30)*.8}/>;})}
 <Person s={s} gait={ramp(t,65.2,65.65)*(1-ramp(t,70.15,70.6))}/>
 <path d={`${line(terrain(365,0),terrain(485,0))}`} stroke={C.mint} strokeWidth="3" strokeDasharray="3 7" opacity={ramp(t,66,68)}/>
 <T y={929} size={20} color={C.mint} opacity={ramp(t,66.5,69)}>停顿之后，主动迈出</T></g>;
}

function Awake({t}:{t:number}){
 const open=ramp(t,71.2,73.3),light=ramp(t,74.2,77.3),a=(t-71)*.4;
 return <g><Title kicker="III / LA LUCIDITÉ" title="看清困境" sub="意识到循环，仍保留自己的意志"/>
 <circle cx="360" cy="625" r="225" fill="none" stroke={C.muted} strokeWidth="1" strokeDasharray="4 9" opacity=".3"/>
 <g transform={`translate(360 625) scale(1 ${Math.max(.02,open)}) translate(-360 -625)`}><path d="M97 625Q360 351 623 625Q360 899 97 625Z" fill={C.night} stroke={C.cream} strokeWidth="4"/><circle cx="360" cy="625" r="105" fill={C.bg} stroke={C.gold} strokeWidth="2"/><circle cx="360" cy="625" r="75" fill="none" stroke={C.muted} strokeWidth="2" strokeDasharray="3 7"/><path d="M300 670A75 75 0 1 1 434 612" fill="none" stroke={C.mint} strokeWidth="5" opacity={light}/><circle cx={360+75*Math.cos(a)} cy={625+75*Math.sin(a)} r="9" fill={C.gold}/><circle cx="360" cy="625" r="30" fill={C.gold}/><circle cx="366" cy="617" r="9" fill={C.cream}/></g>
 <path d="M569 488L607 446M598 537L653 511M613 590L670 585" stroke={C.gold} strokeWidth="2" opacity={light}/>
 <T y={929} size={21} color={C.mint} opacity={light}>清醒，是行动的起点</T></g>;
}

function Scene({t}:{t:number}){
 if(t<24)return <Ascent t={t}/>;
 if(t<30)return <Circuit t={t}/>;
 if(t<36)return <Myth t={t}/>;
 if(t<43)return <Repetition t={t}/>;
 if(t<50)return <Book t={t}/>;
 if(t<57)return <Silence t={t}/>;
 if(t<64)return <Gravity t={t}/>;
 if(t<71)return <Choice t={t}/>;
 if(t<78)return <Awake t={t}/>;
 return <Ascent t={t} ending/>;
}

export const SisyphusV4GPT6:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;
 const index=story.captions.findIndex(c=>t>=c.start&&t<c.end),cue=story.captions[Math.max(0,index)];
 const chapter=t<36?'神话':t<57?'荒诞':t<78?'清醒':'反抗';
 return <AbsoluteFill style={{backgroundColor:C.bg}}><svg width="100%" height="100%" viewBox="0 0 720 1280">
 <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#243c4b"/><stop offset="1" stopColor={C.bg}/></linearGradient><linearGradient id="stone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#526067"/><stop offset=".5" stopColor="#334551"/><stop offset="1" stopColor="#20303d"/></linearGradient><radialGradient id="halo"><stop stopColor={C.gold} stopOpacity=".08"/><stop offset="1" stopColor={C.gold} stopOpacity="0"/></radialGradient><clipPath id="v4stage"><rect x="0" y="150" width="720" height="813"/></clipPath></defs>
 <rect width="720" height="1280" fill="url(#sky)"/><circle cx="100" cy="350" r="480" fill="url(#halo)"/>
 {Array.from({length:26},(_,i)=><circle key={i} cx={(i*197+57)%720} cy={155+(i*83)%680} r={i%3===0?1.5:.65} fill={C.cream} opacity={.08+(i%4)*.025}/>)}
 <path d="M54 116H666" stroke={C.gold} strokeWidth="1" opacity=".35"/>
 <T x={54} y={82} size={14} color={C.gold} anchor="start" spacing={4}>SISYPHUS</T><T x={666} y={82} size={13} color={C.muted} anchor="end" spacing={3}>西西弗斯 / V4 · GPT-6</T>
 <g clipPath="url(#v4stage)"><Scene t={t}/></g>
 <path d="M54 981H666" stroke={C.gold} opacity=".5"/>
 <T x={58} y={1021} size={13} color={C.gold} anchor="start" spacing={4}>{String(index+1).padStart(2,'0')} / {chapter}</T>
 <rect x="46" y="1038" width="628" height="126" rx="8" fill="#101d2b" opacity=".84"/>
 {cue.lines.map((l,i)=><T key={i} y={1085+i*49} size={30}>{l}</T>)}
 <path d="M57 1196H663" stroke={C.muted} strokeWidth="2" opacity=".25"/><path d={`M57 1196H${57+606*clamp(t/90)}`} stroke={C.gold} strokeWidth="3"/>
 <T y={1236} size={12} color={C.muted} spacing={2}>据加缪《西西弗神话》改编 · 90 秒思想短片</T>
 </svg></AbsoluteFill>;
};
