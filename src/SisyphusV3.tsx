import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import story from '../content/sisyphus_v3.json';

/** Semantic-first, time-pure illustrated motion. Every shot has a tangible verb. */
const K={bg:'#101723',deep:'#090f1b',ink:'#182434',soft:'#657387',white:'#F6F1E4',muted:'#B9B9B2',gold:'#FFD079',mint:'#7FE0D0',pink:'#FF837D',blue:'#88B9F7'};
const F=(n:number)=>Math.max(0,Math.min(1,n));
const E=(n:number)=>{const v=F(n);return v*v*(3-2*v);};
const R=(t:number,a:number,b:number)=>E((t-a)/(b-a));
const O=(t:number,a:number,b:number)=>1-R(t,a,b);
const L=(a:number,b:number,t:number)=>a+(b-a)*t;
const mix=(a:number,b:number,t:number)=>a+(b-a)*F(t);
const hill=(x:number,base=830,gradient=.50)=>base-gradient*(x-65);
const seed=(n:number)=>{const t=Math.sin(n*87.777+2.71)*10000;return t-Math.floor(t);};
const Particle:React.FC<{x:number;y:number;id:number;p:number;range?:number}> = ({x,y,id,p,range=1})=>{
  const v=seed(id+19), a=seed(id+44)*Math.PI*2;
  const dist=R(p,0,.85)*range*(22+v*65);
  return <circle cx={x+Math.cos(a)*dist} cy={y+Math.sin(a)*dist} r={2+v*3} fill={K.gold} opacity={F(1-p)*.58}/>;
};
const Text:React.FC<{x?:number;y:number;children:React.ReactNode;size?:number;color?:string;weight?:number;anchor?:'middle'|'start'|'end';spacing?:number;opacity?:number}> = ({x=360,y,children,size=42,color=K.white,weight=600,anchor='middle',spacing=0,opacity=1})=><text x={x} y={y} textAnchor={anchor} fontFamily="'Noto Sans CJK SC','Noto Sans SC',sans-serif" fontSize={size} fontWeight={weight} fill={color} letterSpacing={spacing} opacity={opacity}>{children}</text>;
const Ring:React.FC<{x:number;y:number;r:number;rot?:number;color?:string;thick?:number;fill?:string}> = ({x,y,r,rot=0,color=K.white,thick=7,fill='none'})=><g transform={`translate(${x} ${y}) rotate(${rot})`}><circle r={r} fill={fill} stroke={color} strokeWidth={thick}/><path d={`M${-r*.7} ${-r*.5} l${r*.36} ${-r*.12} M${r*.25} ${r*.56} l${r*.27} ${r*.11}`} stroke={color} strokeWidth={Math.max(2,thick*.44)} opacity=".55" strokeLinecap="round"/></g>;
const Line:React.FC<{x1:number;y1:number;x2:number;y2:number;color?:string;w?:number;dash?:string;opacity?:number}> = ({x1,y1,x2,y2,color=K.white,w=5,dash,opacity=1})=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeDasharray={dash} opacity={opacity} strokeLinecap="round"/>;

type FigureProps={x:number;y:number;scale?:number;phase?:number;pose?:'push'|'stand'|'walk'|'reach'|'fall';rock?:{x:number;y:number;r:number};color?:string;alpha?:number;slope?:number;};
const Figure:React.FC<FigureProps>=({x,y,scale=1,phase=0,pose='stand',rock,color=K.white,alpha=1,slope=.5})=>{
  const pushing=pose==='push'&&!!rock;
  const stride=(pose==='walk'||pushing)?Math.sin(phase*2*Math.PI):0;
  const legA=-26-17*stride,legB=35+18*stride;
  const footYA=-slope*legA,footYB=-slope*legB;
  const lean=pushing?8:pose==='reach'?12:0;
  const shoulderX=lean+14, shoulderY=-112;
  const hx=rock?((rock.x-rock.r*Math.sqrt(1-.12*.12)-x)/scale):0;
  const hy=rock?((rock.y+rock.r*.12-y)/scale):0;
  return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={alpha} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M${lean} -55 L${shoulderX} -112`} strokeWidth="10"/>
    <circle cx={lean+13} cy="-144" r="25" strokeWidth="7"/>
    <path d={`M${lean} -55 Q${-7+stride*10} -22 ${legA} ${footYA} M${lean} -55 Q${16-stride*9} -25 ${legB} ${footYB}`} strokeWidth="9"/>
    <path d={`M${legA-9} ${footYA} L${legA+14} ${footYA} M${legB-7} ${footYB} L${legB+15} ${footYB}`} strokeWidth="7"/>
    {pushing? <><path d={`M${shoulderX} ${shoulderY} Q${shoulderX+43} -120 ${hx} ${hy}`} strokeWidth="9"/><path d={`M${shoulderX} ${shoulderY+19} Q${shoulderX+32} -93 ${hx} ${hy+13}`} strokeWidth="7"/><circle cx={hx} cy={hy} r="5" fill={color} stroke="none"/></> : pose==='reach'?<><path d={`M${shoulderX} ${shoulderY} L108 -171`}/><path d={`M${shoulderX} ${shoulderY+15} L46 -67`}/></>:<><path d={`M${shoulderX} ${shoulderY} Q${shoulderX+16+stride*10} -76 ${shoulderX+10-stride*13} -55`} strokeWidth="8"/><path d={`M${shoulderX} ${shoulderY+10} Q${shoulderX-36} -80 ${shoulderX-31+stride*13} -60`} strokeWidth="8"/></>}
  </g>;
};
const Ground:React.FC<{base?:number;gradient?:number;alpha?:number;start?:number;end?:number}> = ({base=830,gradient=.5,alpha=1,start=30,end=690})=><g opacity={alpha}>
  <path d={`M${start} ${hill(start,base,gradient)} L${end} ${hill(end,base,gradient)}`} fill="none" stroke={K.muted} strokeWidth="7" strokeLinecap="round"/>
  <path d={`M${start} ${hill(start,base,gradient)+8} L${end} ${hill(end,base,gradient)+8}`} fill="none" stroke={K.white} strokeWidth="2" opacity=".23"/>
</g>;
const Star:React.FC<{x:number;y:number;r?:number;alpha?:number}> = ({x,y,r=7,alpha=1})=><path d={`M${x} ${y-r*1.9} L${x+r*.38} ${y-r*.35} L${x+r*1.9} ${y} L${x+r*.38} ${y+r*.35} L${x} ${y+r*1.9} L${x-r*.38} ${y+r*.35} L${x-r*1.9} ${y} L${x-r*.38} ${y-r*.35}Z`} fill={K.gold} opacity={alpha}/>;
type Shot={p:number;t:number;d:number};

// 00–06: punishment physically closes over a human and a stone.
const Punishment:React.FC<Shot>=({p})=>{
 const fall=R(p,.04,.63),close=R(p,.35,.86),light=R(p,.72,1);
 return <g><g opacity=".55">{Array.from({length:11},(_,i)=><Line key={i} x1={35+i*65} y1={130} x2={35+i*65} y2={930} color={K.soft} w={2} opacity={.18+.16*close}/>)}</g>
   <g opacity={close}>{Array.from({length:5},(_,i)=><Line key={i} x1={70+i*145} x2={70+i*145} y1={110-320*(1-close)} y2={930-320*(1-close)} color={K.pink} w={4} opacity={.15+.22*close}/>)}</g>
   <path d="M65 858 H660" stroke={K.soft} strokeWidth="6" strokeLinecap="round"/>
   <Figure x={355} y={844} pose="stand" scale={.86} alpha={1}/>
   <Ring x={356} y={180+420*fall} r={114} color={K.white} thick={9} rot={fall*190}/>
   <path d={`M280 -16 L280 ${82+295*fall} M433 -16 L433 ${82+295*fall}`} stroke={K.gold} strokeWidth="6" strokeDasharray="13 17" opacity={.8-close*.62}/>
   <Text y={322} size={29} spacing={9} color={K.pink} opacity={light}>没有终点的刑罚</Text>
   <Text y={926} size={24} weight={400} color={K.muted} spacing={4}>A SENTENCE WITHOUT END</Text>
 </g>;
};

// 06–12: one coupled rolling rock + walking figure, not a static postcard.
const Uphill:React.FC<Shot>=({p,t})=>{
 const v=R(p,.06,.89),x=L(292,536,v),y=hill(x)-42;
 return <g><path d="M78 482 L638 482" stroke={K.soft} strokeWidth="2" strokeDasharray="5 14" opacity=".43"/>
  <path d="M78 400 L78 840" stroke={K.soft} strokeWidth="2" opacity=".23"/>
  <Ground/><path d="M640 565 l0 -60 M630 505 h20" stroke={K.gold} strokeWidth="6" strokeLinecap="round"/>
  <path d="M99 811 L627 547" stroke={K.gold} strokeWidth="3.5" strokeDasharray="7 10" opacity=".3"/>
  <Figure x={x-153} y={hill(x-153)} rock={{x,y,r:42}} pose="push" phase={v*3.7} alpha={1}/>
  <Ring x={x} y={y} r={42} rot={-(x-292)/42*180/Math.PI} color={K.white} thick={7} fill={K.ink}/>
  <Line x1={115} y1={300} x2={L(115,605,v)} y2={300} color={K.gold} w={7}/>
  <Text x={115} y={275} anchor="start" color={K.gold} size={28}>攀登</Text>
  <Text x={608} y={275} anchor="end" color={K.white} size={24} weight={400}>{Math.round(14+v*66)}%</Text>
  {Array.from({length:5},(_,i)=><Particle key={i} x={x-120} y={hill(x-120)} id={i} p={((t*1.6+i*.21)%1)} range={.43}/>)}
 </g>;
};

// 12–18: strive close to the summit. Show hand contact and rising progress.
const Almost:React.FC<Shot>=({p})=>{
 const v=R(p,.03,.85),x=L(409,563,v),y=hill(x,855,.53)-48;
 return <g><Ground base={855} gradient={.53} end={680}/>
  <path d="M563 566 l46 -33 l32 0" stroke={K.gold} strokeWidth="6" fill="none" strokeLinecap="round"/>
  <Figure x={x-158} y={hill(x-158,855,.53)} rock={{x,y,r:48}} pose="push" phase={v*4} alpha={1} slope={.53}/>
  <Ring x={x} y={y} r={48} rot={-v*154} color={K.white} thick={8} fill={K.ink}/>
  <path d="M110 320 H620" stroke={K.soft} strokeWidth="11" strokeLinecap="round" opacity=".4"/>
  <path d={`M110 320 H${L(380,603,v)}`} stroke={K.gold} strokeWidth="11" strokeLinecap="round"/>
  <Text x={113} y={282} anchor="start" size={29} color={K.muted}>离终点，只剩</Text>
  <Text x={615} y={281} anchor="end" size={45} color={K.gold}>{Math.floor(L(81,99,v))}%</Text>
  {Array.from({length:8},(_,i)=><path key={i} d={`M${x-142+(i%4)*9} ${y+39+Math.floor(i/4)*15} l${-20-8*v} ${12+v*12}`} opacity={v*.4} stroke={K.gold} strokeWidth={2}/>) }
 </g>;
};

// 18–24: semantic timing contract: the rock STARTS rolling downhill at 18.4s.
const Rollback:React.FC<Shot>=({p})=>{
 const v=R(p,.055,.8),x=L(610,120,v),y=hill(x,855,.53)-43;
 return <g><Ground base={855} gradient={.53} start={30} end={690}/>
  <Figure x={466} y={hill(466,855,.53)} pose={p<.09?'push':'stand'} rock={{x:610,y:hill(610,855,.53)-43,r:43}} color={K.white} alpha={1} slope={.53}/>
  <g opacity={R(p,.15,.55)*.7}>{Array.from({length:7},(_,i)=><path key={i} d={`M${x+65+i*18} ${y-39} l${40+i*3} -11`} stroke={K.pink} strokeWidth="4" strokeLinecap="round" opacity={.6-i*.07}/>)}</g>
  <Ring x={x} y={y} r={43} rot={v*580} color={K.pink} thick={8} fill={K.ink}/>
  {Array.from({length:14},(_,i)=><Particle key={i} x={x} y={hill(x,855,.53)} id={i+30} p={(p*2+i*.03)%1} range={.8}/>)}
  <Text y={283} size={38} color={K.pink} opacity={R(p,.12,.4)} spacing={5}>进度归零</Text>
  <path d="M136 333 H595" stroke={K.soft} strokeWidth="7" opacity=".5"/>
  <path d={`M136 333 H${L(590,136,v)}`} stroke={K.pink} strokeWidth="7"/>
 </g>;
};

// 24–30: visualize an endless return circuit, NO reward at the summit.
const NoReward:React.FC<Shot>=({p})=>{
 const a=p*2*Math.PI*1.8;
 const cx=360,cy=595,r=195;
 return <g><circle cx={cx} cy={cy} r={r} stroke={K.soft} strokeWidth="7" strokeDasharray="9 16" opacity=".6" fill="none"/>
  <path d="M197 705 Q280 420 435 440 Q540 480 527 580" fill="none" stroke={K.gold} strokeWidth="8" strokeLinecap="round"/>
  <path d="M514 558 l15 25 l21 -20" fill="none" stroke={K.gold} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx={cx+Math.cos(a)*r} cy={cy+Math.sin(a)*r} r="32" stroke={K.white} strokeWidth="7" fill={K.ink}/>
  <g transform={`translate(${cx+Math.cos(a)*r} ${cy+Math.sin(a)*r}) rotate(${p*648})`}><Line x1={-17} x2={18} y1={0} y2={0} color={K.pink} w={7}/></g>
  <path d="M475 335 L588 320 L588 441" fill="none" stroke={K.soft} strokeWidth="4"/>
  <path d="M582 319 L582 371 L648 352 L648 319Z" stroke={K.soft} strokeWidth="5" fill="none" opacity={.65}/>
  <path d="M578 321 L648 377" stroke={K.pink} strokeWidth="6"/>
  <Text y={878} size={39} color={K.white} spacing={4}>有努力，却没有结算</Text>
  <Text y={921} size={21} color={K.muted} spacing={2} weight={400}>THE END IS ALWAYS OUT OF REACH</Text>
 </g>;
};

// 30–36: The Greek myth in a deliberately different visual grammar.
const NameTheMyth:React.FC<Shot>=({p})=>{
 const show=R(p,.07,.48),translate=R(p,.12,.85),pulse=Math.sin(p*10)*5;
 return <g><g opacity={show}>
  <path d="M140 725 V405 Q140 333 360 333 Q580 333 580 405 V725" fill="none" stroke={K.muted} strokeWidth="8"/>
  {[-1,1].map((s,i)=><g key={i} transform={`translate(${360+s*190} 0)`}><rect x="-25" y="401" width="50" height="345" rx="5" stroke={K.soft} fill={K.ink} strokeWidth="5"/><path d="M-35 401 H35 M-35 744 H35" stroke={K.white} strokeWidth="9"/></g>)}
  <circle cx="360" cy="565" r="125" stroke={K.gold} strokeWidth="4" opacity=".65" fill="none"/>
  <path d="M265 675 L458 491" stroke={K.white} strokeWidth="6"/>
  <Figure x={326+38*translate} y={627-36*translate} scale={.5} pose="push" rock={{x:421+30*translate,y:543-32*translate,r:23}} color={K.white} phase={p*3} slope={1}/>
  <Ring x={421+30*translate} y={543-32*translate} r={23} thick={5} color={K.gold} rot={p*160}/>
 </g>
  <Text y={843} size={30} color={K.gold} opacity={R(p,.33,.65)} spacing={8}>Σ Ι Σ Υ Φ Ο Σ</Text>
  <Text y={907+pulse*.07} size={62} color={K.white} opacity={R(p,.48,.82)} spacing={5}>西西弗斯</Text>
 </g>;
};

// 36–43: simultaneous triptych, proof repetition is not productive.
const Endless:React.FC<Shot>=({p})=>{
 const margin=105;
 return <g><Text y={252} color={K.muted} size={28} spacing={6}>每一次，都要从零开始</Text>
 {Array.from({length:3},(_,i)=>{
    const local=(p*2.2+i*.34)%1;const up=local<.54?E(local/.54):1-E((local-.54)/.46);
    const startY=467+i*165,x=L(218,523,up),y=startY-.18*(x-160)-27;
    return <g key={i} opacity={R(p,.01+i*.08,.25+i*.12)}>
      <path d={`M150 ${startY} L590 ${startY-.18*440}`} stroke={K.muted} strokeWidth="4" opacity=".63"/>
      <Ring x={x} y={y} r={27} color={local<.54?K.gold:K.pink} thick={5} rot={-(x-218)/27*180/Math.PI}/>
      <Figure x={x-85} y={startY-.18*(x-85-160)} scale={.42} pose={local<.54?'push':'stand'} rock={{x,y,r:27}} slope={.18} color={K.white} alpha={.9}/>
      <Text x={89} y={startY-10} color={K.soft} size={25}>{String(i+1).padStart(2,'0')}</Text>
    </g>;
 })}
 <path d="M118 859 h480" stroke={K.soft} opacity=".15" strokeWidth="3"/>
 <Text y={910} color={K.pink} size={28} opacity={R(p,.58,.85)} spacing={7}>一次又一次</Text>
 </g>;
};

// 43–50: an argument appears ON an open book, rather than a headline over the hill.
const Camus:React.FC<Shot>=({p})=>{
 const open=R(p,.02,.33),ink=R(p,.29,.65),hero=R(p,.53,.92);
 const fold=L(0,94,open);
 return <g><g transform="translate(0 15)">
  <path d={`M359 394 Q${312-fold} ${335} 115 405 L115 848 Q255 804 359 863Z`} fill={K.white} opacity={.92} stroke={K.soft} strokeWidth="6"/>
  <path d={`M360 394 Q${402+fold} ${335} 606 405 L606 848 Q476 804 360 863Z`} fill="#E3DBC7" stroke={K.soft} strokeWidth="6"/>
  <path d="M360 394 L360 866" stroke={K.bg} strokeWidth="7"/>
  {Array.from({length:6},(_,i)=><path key={i} d={`M155 ${462+i*42} H${318-i*4}`} stroke={K.soft} strokeWidth="5" opacity={open*.35}/>)}
  <path d="M411 513 C489 471 536 527 503 568 C470 609 451 648 458 696" fill="none" stroke={K.ink} strokeWidth="11" strokeDasharray="405" strokeDashoffset={405*(1-ink)} strokeLinecap="round"/>
  <circle cx="458" cy="732" r="8" fill={K.ink} opacity={ink}/>
  <g opacity={hero} transform={`translate(0 ${25*(1-hero)})`}>
    <circle cx="506" cy="627" r="41" fill={K.gold} opacity=".32"/>
    <Figure x={524} y={808} scale={.59} pose="push" color={K.ink} rock={{x:587,y:666,r:34}} phase={p*4} slope={0}/>
    <Ring x={587} y={666} r={34} thick={6} color={K.bg}/>
  </g>
 </g>
 <Text y={292} size={28} color={K.muted} spacing={6}>1942 · ALBERT CAMUS</Text>
 <Text y={955} size={32} color={K.gold} opacity={hero} spacing={5}>荒诞的英雄</Text>
 </g>;
};

// 50–57: a visible request for meaning receives no reply.
const Absurd:React.FC<Shot>=({p})=>{
 const signal=R(p,.04,.5),empty=R(p,.48,.86);
 return <g><rect x="60" y="309" width="298" height="540" rx="25" fill="#19293a" stroke={K.mint} strokeWidth="3" opacity=".95"/>
  <rect x="362" y="309" width="298" height="540" rx="25" fill="#10121c" stroke={K.soft} strokeWidth="3" opacity=".95"/>
  <Text x={210} y={364} size={27} color={K.mint} spacing={2}>人</Text>
  <Text x={509} y={364} size={27} color={K.soft} spacing={2}>世界</Text>
  <Figure x={173} y={780} scale={.95} pose="reach" color={K.white}/>
  <Star x={294} y={501} r={15} alpha={signal}/>
  <Text x={260} y={454} size={24} color={K.gold} opacity={signal}>意义？</Text>
  {Array.from({length:4},(_,i)=>{const dx=signal*(83+i*64);const alpha=(1-empty)*(.7-i*.15);return <path key={i} d={`M${276+dx} ${552-i*20} q24 -32 48 0`} fill="none" stroke={K.mint} strokeWidth="5" opacity={alpha}/>;})}
  <path d={`M368 633 L${L(368,562,signal)} 633`} stroke={K.gold} strokeWidth="5" strokeDasharray="14 13" opacity={1-empty}/>
  {Array.from({length:15},(_,i)=><circle key={i} cx={391+seed(i)*244} cy={421+seed(i+51)*315} r={1.5+seed(i+7)*3} fill={K.soft} opacity={.12+.13*empty}/>)}
  {/* An actual travelling unanswered signal, not just a label. */}
  <circle cx={L(295,553,signal)} cy={L(501,631,signal)} r={17+signal*13} fill={K.gold} opacity={(1-empty)*.92}/>
  <circle cx={L(295,553,signal)} cy={L(501,631,signal)} r={35+signal*26} fill="none" stroke={K.mint} strokeWidth="4" opacity={(1-empty)*.72}/>
  <path d={`M295 501 Q408 ${445-21*signal} 555 630`} fill="none" stroke={K.gold} strokeWidth={6+3*signal} strokeDasharray="13 18" opacity={(1-empty)*.87}/>
  <rect x="60" y="309" width="298" height="540" rx="25" fill={K.deep} opacity={empty*.62}/>
  <rect x="362" y="309" width={298*empty} height="540" rx="25" fill="#050910" opacity={empty*.91}/>
  <Text x={511} y={713} size={26} color={K.muted} opacity={empty}>······</Text>
  <Text y={923} size={27} color={K.muted} spacing={2}>渴望回应 ↔ 沉默不答</Text>
 </g>;
};

// 57–64: repeat rolling DOWNHILL throughout the voice window.
const Gravity:React.FC<Shot>=({p})=>{
 const local=(p*1.92)%1;const fall=E(local);
 const x=L(585,170,fall), y=hill(x,816,.54)-39;
 return <g><Ground base={816} gradient={.54} start={90} end={630}/>
 <Ring x={x} y={y} r={39} rot={fall*540} color={K.pink} thick={8}/>
 <g opacity=".32"><path d="M180 460 A220 220 0 0 1 530 425" fill="none" stroke={K.gold} strokeWidth="4" strokeDasharray="8 14"/><path d="M516 400 l20 28 l-31 1" fill="none" stroke={K.gold} strokeWidth="6"/></g>
 <Text y={282} size={33} color={K.muted}>重力不会因愿望而改变</Text>
 <path d="M120 347 H596" stroke={K.soft} opacity=".36" strokeWidth="7"/>
 <path d={`M120 347 H${L(598,120,fall)}`} stroke={K.pink} strokeWidth="7"/>
 <Text y={914} size={30} color={K.pink} spacing={6}>仍然回到原点</Text>
 </g>;
};

// 64–71: a clear bodily step constitutes a decision; no faux anatomy.
const Choice:React.FC<Shot>=({p})=>{
 const move=R(p,.3,.78);const x=L(256,439,move);
 return <g><path d="M81 789 H646" stroke={K.soft} strokeWidth="6" strokeLinecap="round"/>
  <path d="M255 790 Q330 729 455 630 Q511 577 599 555" fill="none" stroke={K.gold} strokeWidth="6" strokeDasharray="10 13" opacity=".75"/>
  <path d="M255 790 Q334 834 446 874" fill="none" stroke={K.soft} strokeWidth="5" strokeDasharray="12 13" opacity=".47"/>
  <Text x={536} y={529} size={26} color={K.gold}>继续</Text>
  <Text x={472} y={909} size={25} color={K.soft}>停下</Text>
  <Figure x={x} y={785} scale={1.1} phase={move*1.1} pose={move<.04?'stand':'walk'} color={K.white} slope={0}/>
  {Array.from({length:5},(_,i)=>{const show=R(p,.35+i*.07,.48+i*.07);return <g key={i} opacity={show*.68} transform={`translate(${286+i*33} ${814-i*3}) rotate(-18)`}><ellipse cx="0" cy="0" rx="13" ry="26" stroke={K.gold} strokeWidth="3" fill="none"/></g>})}
  <circle cx="245" cy="791" r={85+move*50} fill="none" stroke={K.mint} strokeWidth="3" opacity={.28*(1-move)}/>
  <Text y={326} color={K.white} size={35}>命运不可选择</Text>
  <Text y={375} color={K.mint} size={34} opacity={R(p,.35,.72)}>迈步可以</Text>
 </g>;
};

// 71–78: eye-as-symbol reveals the loop and highlights awareness.
const Awake:React.FC<Shot>=({p})=>{
 const open=R(p,.09,.47),light=R(p,.43,.86),spin=p*600;
 const aperture=40+open*157;
 return <g>
  <path d={`M90 617 Q360 ${617-aperture} 630 617 Q360 ${617+aperture} 90 617Z`} fill={K.ink} stroke={K.white} strokeWidth="9" strokeLinejoin="round"/>
  <circle cx="360" cy="617" r={76*open} stroke={K.gold} strokeWidth="7" fill="none" opacity={open}/>
  <circle cx="360" cy="617" r={28*open} fill={K.gold} opacity={open}/>
  <circle cx="360" cy="617" r={9*open} fill={K.deep}/>
  <path d={`M${360-52*open} ${617-18*open} a${58*open} ${58*open} 0 1 1 ${95*open} ${75*open}`} fill="none" stroke={K.mint} strokeWidth="4" strokeDasharray="6 9" opacity={open*.9}/>
  <path d={`M${330} ${595} q-17 -24 14 -49`} stroke={K.white} strokeWidth="4" opacity={light}/>
  <path d={`M360 617 L${360+Math.cos(spin*Math.PI/180)*52*open} ${617+Math.sin(spin*Math.PI/180)*52*open}`} stroke={K.gold} strokeWidth="4" opacity={open}/>
  <g opacity={light}><path d="M528 429 L637 286 M556 478 L668 413 M568 547 H692" stroke={K.gold} strokeWidth="5" strokeLinecap="round"/></g>
  <Text y={330} size={32} color={K.soft}>看清循环</Text>
  <Text y={916} size={32} color={K.mint} opacity={light}>而不是闭上眼睛</Text>
 </g>;
};

// 78–85: same simple limbs but coherent contact. Outcome remains uncertain.
const Revolt:React.FC<Shot>=({p})=>{
 const v=R(p,.08,.87),x=L(305,550,v),y=hill(x,822,.37)-49;
 return <g><Ground base={822} gradient={.37} start={48} end={685}/>
 <path d="M95 302 H629" stroke={K.soft} strokeWidth="6" opacity=".4" strokeDasharray="10 16"/>
 <path d={`M95 302 H${L(95,523,v)}`} stroke={K.mint} strokeWidth="8" strokeLinecap="round"/>
 <Figure x={x-170} y={hill(x-170,822,.37)} phase={v*4.4} pose="push" rock={{x,y,r:49}} color={K.white} slope={.37}/>
 <Ring x={x} y={y} r={49} color={K.gold} rot={-v*320} thick={8} fill={K.ink}/>
 {Array.from({length:11},(_,i)=><Particle key={i} x={x-120} y={hill(x-120,822,.37)} id={i+92} p={(v*3+i*.18)%1} range={.56}/>)}
 <Text y={268} size={29} color={K.mint} spacing={6}>仍然行动</Text>
 <Text y={915} size={27} color={K.muted} spacing={2}>不是保证成功，而是拒绝屈服</Text>
 </g>;
};

// 85–90: camera pulls away; mountain has no visible finish.
const Forward:React.FC<Shot>=({p})=>{
 const scale=L(1.7,.44,R(p,.1,.95));const x=L(300,464,p);const y=hill(x,802,.42)-27;
 const glow=R(p,.18,.92);
 return <g><circle cx="559" cy="283" r={90+40*glow} fill={K.gold} opacity={.1+.16*glow}/>
  <circle cx="559" cy="283" r="57" fill={K.gold} opacity={glow*.83}/>
  <path d="M0 815 Q140 709 249 751 Q415 475 720 240" stroke={K.soft} strokeWidth="5" fill="none" opacity=".3"/>
  <path d="M-70 945 Q200 702 350 650 Q525 540 810 180" stroke={K.gold} strokeWidth="5" fill="none" opacity=".7"/>
  <g transform={`translate(${360*(1-scale*.7)} ${525*(1-scale*.7)}) scale(${scale*.7})`}>
    <path d="M-60 910 L770 562" stroke={K.muted} strokeWidth="7" strokeLinecap="round"/>
    <Figure x={x-80} y={910+(770-(x-80))*(-348/830)} scale={.5} pose="push" color={K.white} phase={p*4} rock={{x,y:910+(770-x)*(-348/830)-28,r:27}} slope={.42}/>
    <Ring x={x} y={910+(770-x)*(-348/830)-28} r={27} thick={5} color={K.gold} rot={p*320}/>
  </g>
  <Text y={394} size={38} weight={700} color={K.white} spacing={4} opacity={R(p,.18,.52)}>清醒之后</Text>
  <Text y={453} size={46} weight={700} color={K.gold} spacing={5} opacity={R(p,.38,.7)}>仍然向前</Text>
  <Text y={925} size={21} color={K.muted} spacing={2} opacity={R(p,.62,.95)}>THE COURAGE TO CONTINUE</Text>
 </g>;
};

const shots:React.FC<Shot>[]=[Punishment,Uphill,Almost,Rollback,NoReward,NameTheMyth,Endless,Camus,Absurd,Gravity,Choice,Awake,Revolt,Forward];
const captions=story.captions;
export const SisyphusV3:React.FC=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 return <AbsoluteFill style={{backgroundColor:K.bg}}><svg width="100%" height="100%" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="paperWash" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#172335"/><stop offset="1" stopColor="#0d121d"/></linearGradient>
    <linearGradient id="clearSkies" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#30435a"/><stop offset="1" stopColor="#121925"/></linearGradient>
    <clipPath id="artboard"><rect x="0" y="128" width="720" height="819"/></clipPath>
  </defs>
  <rect x="0" y="0" width="720" height="1280" fill="url(#paperWash)"/>
  <circle cx="-30" cy="150" r="245" fill={K.blue} opacity=".025"/>
  <circle cx="738" cy="943" r="280" fill={K.gold} opacity=".028"/>
  <g clipPath="url(#artboard)">{shots.map((Shot,i)=>{
   const c=captions[i];const local=t-c.start;const d=c.end-c.start;
   if(local<-.52||local>d+.52)return null;
   const fade=R(local,-.38,.22)*O(local,d-.30,d+.28);
   return <g key={i} opacity={fade}><Shot p={F(local/d)} t={local} d={d}/></g>;
  })}</g>
  <path d="M58 104 H662" stroke={K.soft} strokeWidth="1.5" opacity=".44"/>
  <Text x={58} y={75} anchor="start" color={K.muted} size={16} spacing={4} weight={500}>思想实验  /  PHILOSOPHY</Text>
  <Text x={661} y={75} anchor="end" color={K.gold} size={17} weight={500}>{String(Math.floor(t/60)).padStart(2,'0')}:{String(Math.floor(t%60)).padStart(2,'0')}</Text>
  <path d="M59 960 H661" stroke={K.gold} strokeWidth="2" opacity=".67"/>
  <rect x="42" y="977" width="636" height="165" rx="19" fill="#0D1624" opacity=".97"/>
  {captions.map((c,i)=>{
    const vis=R(t,c.start,c.start+.25)*O(t,c.end-.31,c.end);
    if(vis<.01)return null;
    return <g key={i} opacity={vis}>{c.lines.map((line,j)=><Text key={j} y={1041+j*55} color={K.white} size={33} weight={500}>{line}</Text>)}</g>;
  })}
  <g><rect x="58" y="1180" width="604" height="4" rx="2" fill="#3a4859"/>
    <rect x="58" y="1180" width={604*F(t/story.durationSeconds)} height="4" rx="2" fill={K.gold}/>
    <Text y={1226} size={15} color={K.muted} weight={400} spacing={3}>据加缪《西西弗神话》改编 · SIMPLE FORMS, PRECISE MEANING</Text>
  </g>
 </svg></AbsoluteFill>;
};