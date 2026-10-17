import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import story from '../content/maxwell.json';
import {BOX,gas,stateAt,memoryRecord,memoryRecordTimes,ramp,lerp,clamp} from './maxwellPhysics';

const C={bg:'#091b25',panel:'#102a36',line:'#668994',white:'#f0f3e7',muted:'#a1b8ba',fast:'#ff9679',slow:'#75c9ed',mint:'#70e1c5',gold:'#f4d58e'};
const font="'Microsoft YaHei','Noto Sans CJK SC',sans-serif";
function Text({x=360,y,size=30,color=C.white,children,anchor='middle',alpha=1,space=0}:{x?:number;y:number;size?:number;color?:string;children:React.ReactNode;anchor?:'start'|'middle'|'end';alpha?:number;space?:number}){return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontFamily={font} opacity={alpha} letterSpacing={space}>{children}</text>;}
function Arrow({d,color=C.gold,width=3,alpha=1}:{d:string;color?:string;width?:number;alpha?:number}){return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={alpha} markerEnd={`url(#arrow-${color.slice(1)})`}/>;}
function Heading({t}:{t:number}){
 const title=t<7?'麦克斯韦妖':t<13?'让分子接受筛选':t<23?'先判断，再开门':t<30?'温差，开始出现':t<37?'熵增，出现漏洞？':t<43?'把妖怪也算进去':t<49?'测量，写成记录':t<56?'记忆，也会写满':t<63?'为了下一轮，必须复位':t<71?'擦除，把热留给环境':t<79?'把完整循环算清楚':'信息有物理代价';
 const sub=t<7?'信息真的能打败熵增吗？':t<13?'同一种气体 · 速度不同':t<23?'快 → 右侧    慢 → 左侧':t<30?'平均动能不同，冷热逐渐分开':t<37?'只统计气体，漏掉了什么？':t<43?'控制者，也属于物理世界':t<49?'快 / 慢  →  1 / 0':t<56?'有限存储，无法无限记录':t<63?'不同的旧记录，回到同一初态':t<71?'兰道尔原理 / LANDAUER PRINCIPLE':t<79?'气体 + 控制器 + 记忆 + 环境':'统计物理 · 量子测量 · 反馈控制';
 return <g><Text y={184} size={13} color={C.gold} space={4}>{t<37?'01 / 看似免费的秩序':t<63?'02 / 被漏算的信息':'03 / 完整的物理账本'}</Text><Text y={249} size={t<7?48:title.length>11?34:39}>{title}</Text><Text y={299} size={t<7?29:21} color={C.muted}>{sub}</Text></g>;
}

function Demon({t,id,allowed}:{t:number;id?:number;allowed?:boolean}){
 const f=stateAt(t),p=f.particles[id??0],look=clamp((p.x-360)/200)*2-1;
 const judge=f.decision?clamp((t-f.decision.start)/.28):0;
 return <g data-object="demon"><path d="M337 374l-9 -18 23 9m18 -1 23 -9 -9 22" stroke={C.gold} strokeWidth="3" fill={C.panel} strokeLinejoin="round"/>
 <rect x="327" y="369" width="66" height="55" rx="22" fill={C.panel} stroke={C.gold} strokeWidth="3"/>
 <circle cx="347" cy="393" r="10" fill={C.bg} stroke={C.white} strokeWidth="2"/><circle cx="375" cy="393" r="10" fill={C.bg} stroke={C.white} strokeWidth="2"/>
 <circle cx={347+look*3} cy="394" r="4" fill={C.mint}/><circle cx={375+look*3} cy="394" r="4" fill={C.mint}/>
 <path d={`M351 410q9 ${allowed===false?-4:5} 18 0`} stroke={C.gold} strokeWidth="2" fill="none"/>
 <path d="M347 426L342 452L365 452L374 427M343 438L321 453L330 464M373 438L394 451L385 465" fill="none" stroke={C.gold} strokeWidth="3" strokeLinecap="round"/>
 <circle cx="360" cy="458" r="8" fill={f.opening>.3?C.mint:C.panel} stroke={C.gold} strokeWidth="2"/>
 <path d="M360 466V476" stroke={C.gold} strokeWidth="2"/>
 {id!==undefined&&<g><path d={`M360 406Q${(360+p.x)/2} 445 ${p.x} ${p.y}`} stroke={C.gold} strokeWidth="1.5" strokeDasharray="4 6" opacity=".38" fill="none"/><circle cx={p.x} cy={p.y} r={14+judge*3} fill="none" stroke={allowed===false?C.line:C.gold} strokeWidth="1.5"/></g>}
 </g>;
}

function energyAt(t:number,left:boolean){let sum=0;for(let i=0;i<15;i++){const s=stateAt(Math.max(0,t-i/30));sum+=left?s.energyLeft:s.energyRight;}return sum/15;}
function Gauge({x,t,left}:{x:number;t:number;left:boolean}){
 const e=energyAt(t,left),q=clamp((e-3000)/20000),color=q>.55?C.fast:q<.38?C.slow:C.muted;
 return <g><Text x={x} y={869} size={19} color={color}>{t<13?(left?'左侧':'右侧'):(left?'左侧 · 更冷':'右侧 · 更热')}</Text><rect x={x-99} y="889" width="198" height="9" rx="4" fill={C.bg} stroke={C.line} strokeWidth="1"/><rect x={x-98} y="890" width={196*q} height="7" rx="3" fill={color}/><Text x={x} y={925} size={13} color={C.muted}>平均动能 · 示意</Text></g>;
}

function Chamber({t,showGauge=true,mini=false}:{t:number;showGauge?:boolean;mini?:boolean}){
 const f=stateAt(t),d=f.decision;
 const recent=memoryRecordTimes.map((_,i)=>memoryRecord(i)).find(r=>t>=r.time-.15&&t<r.time+.22);
 const observedId=recent?.id??d?.id;
 const leftLevel=clamp((13000-energyAt(t,true))/11000),rightLevel=clamp((energyAt(t,false)-13000)/11000);
 const decisionVisible=!!d&&t-d.start>.28;
 return <g>
 <rect x="78" y="476" width="564" height="346" rx="8" fill={C.panel}/>
 <rect x="79" y="477" width="279" height="344" fill={C.slow} opacity={.025+.1*leftLevel}/><rect x="362" y="477" width="279" height="344" fill={C.fast} opacity={.025+.1*rightLevel}/>
 <g clipPath="url(#gas-inside)">{f.particles.map(p=>{
  const color=p.fast?C.fast:C.slow;const trail=[];for(let j=6;j>=0;j--){const old=stateAt(Math.max(0,t-j/30)).particles[p.id];trail.push(`${old.x},${old.y}`);}
  return <g key={p.id} data-id={p.id}><polyline points={trail.join(' ')} stroke={color} strokeWidth={p.fast?3:2} strokeLinecap="round" strokeLinejoin="round" opacity={p.fast?.30:.18} fill="none"/><circle cx={p.x} cy={p.y} r={BOX.r} fill={color}/><circle cx={p.x-2} cy={p.y-2} r="1.7" fill={C.white} opacity=".45"/>
  </g>;
 })}</g>
 <rect x="78" y="476" width="564" height="346" rx="8" stroke={C.white} strokeWidth="2.5" fill="none"/>
 <path d="M360 476V591M360 707V822" stroke={C.white} strokeWidth="6"/>
 <rect x="357" y="591" width="6" height={58*(1-f.opening)} fill={f.opening>.1?C.mint:C.gold}/><rect x="357" y={649+58*f.opening} width="6" height={58*(1-f.opening)} fill={f.opening>.1?C.mint:C.gold}/>
 <path d="M347 591H373M347 707H373" stroke={C.gold} strokeWidth="1" opacity=".4"/>
 <Demon t={t} id={observedId} allowed={d?.allowed}/>
 {!mini&&<g>
 <Text x={217} y={445} size={15} color={C.fast}>珊瑚红 = 快</Text><Text x={512} y={445} size={15} color={C.slow}>青蓝色 = 慢</Text>
 {t>=13&&t<37&&<g><rect x="416" y="343" width="207" height="50" rx="10" fill={C.bg} stroke={decisionVisible?(d?.allowed?C.mint:C.line):C.line} strokeWidth="1"/><Text x={520} y={375} size={19} color={decisionVisible?(d?.allowed?C.mint:C.muted):C.gold}>{d?(decisionVisible?(d.allowed?(d.fast?'快 → 放行':'慢 ← 放行'):'关门 · 留在原侧'):'观察速度…'):'等待下一次判断'}</Text></g>}
 {t>=55.05&&t<63&&<Text x={522} y={370} size={20} color={t>=62.7?C.mint:C.fast}>{t>=62.7?'复位完成':t>=59?'正在复位 · 暂停':'记忆已满 · 暂停'}</Text>}
 </g>}
 {showGauge&&<><Gauge x={218} t={t} left/><Gauge x={502} t={t} left={false}/></>}
 </g>;
}

function Memory({t,compact=false}:{t:number;compact?:boolean}){
 const records=memoryRecordTimes.map((_,i)=>memoryRecord(i)),reset=ramp(t,59.0,62.7),full=t>=55.05&&t<59;
 const used=records.filter(r=>t>=r.time+.2).length;
 return <g data-object="memory"><rect x="140" y="711" width="440" height="225" rx="15" fill={C.panel} stroke={full?C.fast:C.line} strokeWidth="1.5"/>
 <Text x={162} y={742} anchor="start" size={18} color={full?C.fast:C.gold}>记忆</Text><Text x={558} y={742} anchor="end" size={15} color={C.muted}>{t>=62.7?'16 格已复位':`${used} / 16`}</Text>
 {records.map((r,i)=>{
  const x=170+(i%4)*99,y=760+Math.floor(i/4)*40,written=t>=r.time+.2,erased=reset>=(i+1)/16,bit=erased?0:r.bit;
  const flash=1-ramp(Math.abs(t-r.time-.2),0,.25);
  return <g key={i}><rect x={x} y={y} width="83" height="30" rx="5" stroke={erased?C.mint:written?C.gold:C.line} strokeWidth={written&&flash>.1?2.5:1} fill={erased?'#153d3c':written?'#3b392c':C.bg}/>
  {written&&<Text x={x+41.5} y={y+23} size={21} color={erased?C.mint:C.gold}>{bit}</Text>}</g>;
 })}
 {!compact&&<Text y={970} size={15} color={C.muted}>{t<56?'1 = 快；0 = 慢（记录编码示意）':t<59?'缓冲区已满，无法继续写入':'复位：不同记录 → 统一的 0'}</Text>}
 </g>;
}

function Apparatus({t}:{t:number}){
 const reveal=ramp(t,37.5,43),z=lerp(1,.64,reveal),dy=-122*reveal;
 const transform=(x:number,y:number)=>({x:360+(x-360)*z,y:650+dy+(y-650)*z});
 const recent=memoryRecordTimes.map((_,i)=>({r:memoryRecord(i),i})).find(o=>t>=o.r.time&&t<o.r.time+.45);
 return <g>
 <g transform={`translate(360 ${650+dy}) scale(${z}) translate(-360 -650)`}><Chamber t={t} showGauge={!(t>=30&&t<37)}/></g>
 {t>42.3&&<g opacity={ramp(t,42.3,43)}><Memory t={t}/></g>}
 {recent&&(()=>{const p=stateAt(recent.r.time).particles[recent.r.id],start=transform(p.x,p.y),x=211.5+(recent.i%4)*99,y=775+Math.floor(recent.i/4)*40,q=ramp(t,recent.r.time,recent.r.time+.2);return <g><path d={`M${start.x} ${start.y}Q${x} ${start.y+90} ${x} ${y}`} stroke={C.gold} strokeWidth="1.4" strokeDasharray="3 6" opacity=".6" fill="none"/><circle cx={lerp(start.x,x,q)} cy={lerp(start.y,y,q)} r="6" fill={C.gold}/></g>;})()}
 {t>=30&&t<37&&<g><path d="M89 466H631V834H89Z" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray="8 8" opacity=".6"/><Text x={360} y={350} size={23} color={C.gold}>气体熵 ↓ ？</Text>
 <Arrow d="M584 835Q584 896 408 896" color={C.fast}/><Arrow d="M313 896Q132 896 132 835" color={C.slow}/>
 <g transform={`translate(360 896) rotate(${(t-30)*96})`}><circle r="33" stroke={C.white} strokeWidth="2" fill={C.panel}/>{[0,1,2,3].map(i=><path key={i} d="M0 0Q22 -8 27 -20" stroke={C.gold} strokeWidth="3" fill="none" transform={`rotate(${i*90})`}/>)}</g>
 <Arrow d="M360 859V831" color={C.gold}/><Text y={969} size={16} color={C.gold}>设想：利用温差做功，代价在哪里？</Text></g>}
 {t>=37&&t<43&&<g opacity={ramp(t,37.2,39)}><g transform={`translate(360 ${650+dy}) scale(${z}) translate(-360 -650)`}><path d="M311 347H409V473H311Z" stroke={C.gold} strokeWidth="2" fill="none" strokeDasharray="6 5"/></g><Text x={540} y={344} size={21} color={C.gold}>控制者也有记忆</Text></g>}
 {t>=59&&<g opacity={ramp(t,59,60)}><Arrow d="M575 804Q636 822 599 931" color={C.fast}/><Text x={626} y={965} size={14} color={C.fast}>热</Text></g>}
 </g>;
}

function Erasure({t}:{t:number}){
 const q=ramp(t,63.35,67.3),heat=ramp(t,65,70.4),zero={x:360,y:717};
 return <g>
 <Text y={367} size={19} color={C.muted}>未知的旧记录，有两种可能</Text>
 {[0,1].map(i=>{const x=i?502:218;return <g key={i}><circle cx={x} cy="466" r="44" fill={C.panel} stroke={C.gold} strokeWidth="2"/><Text x={x} y={482} size={43} color={C.gold}>{i}</Text><Arrow d={`M${x} 523Q${x} 644 360 665`} color={C.gold} alpha={.5}/><circle cx={lerp(x,zero.x,q)} cy={lerp(526,zero.y,q)} r="10" fill={C.gold} opacity={1-ramp(q,.83,1)}/></g>;})}
 <rect x="295" y="662" width="130" height="90" rx="14" fill="#153f3c" stroke={C.mint} strokeWidth="2"/><Text x={360} y={725} size={53} color={C.mint}>0</Text>
 <Text x={544} y={702} size={16} color={C.gold}>复位做功 W</Text><Arrow d="M536 717H446" color={C.gold}/>
 <Arrow d="M360 765V825" color={C.fast}/><Text x={401} y={802} size={19} color={C.fast}>热 Q</Text>
 <rect x="126" y="841" width="468" height="70" rx="12" fill="#3e2c2a" stroke={C.fast} strokeWidth="1.5"/><Text y={884} size={22} color={C.fast}>环境热库 · 温度 T</Text>
 {Array.from({length:5},(_,i)=>{const u=clamp((t-64.6-i*.62)/1.5);return <circle key={i} cx={360+Math.sin(i*2.2)*u*145} cy={lerp(765,866,u)} r={3+u*3} fill={C.fast} opacity={ramp(u,0,.12)*(1-ramp(u,.8,1))}/>;})}
 <g opacity={heat}><Text y={954} size={30} color={C.gold}>Q ≥ k<tspan baselineShift="sub" fontSize="19">B</tspan> T ln 2</Text><Text y={983} size={13} color={C.muted}>对称、等概率的 1 bit · 等温复位 · 平均下限</Text></g>
 </g>;
}

function Ledger({t}:{t:number}){
 const p=ramp(t,71,73.5);
 return <g>
 <rect x="48" y="342" width="624" height="639" rx="22" fill="none" stroke={C.gold} strokeWidth="1.5" strokeDasharray={`${12*p} ${8*(1-p)+2}`} opacity={.4+.5*p}/>
 <g transform="translate(360 540) scale(.62) translate(-360 -650)"><Chamber t={t} showGauge={false} mini/></g>
 <Text x={183} y={671} size={21} color={C.slow}>气体：熵降低</Text><Text x={530} y={671} size={21} color={C.fast}>环境：熵增加</Text>
 <g transform="translate(203 762) scale(.39) translate(-360 -820)"><Memory t={64} compact/></g>
 <Text x={203} y={833} size={16} color={C.gold}>记忆回到初态</Text>
 <rect x="430" y="736" width="170" height="78" rx="12" fill="#3e2c2a" stroke={C.fast} strokeWidth="1.5"/><Text x={515} y={781} size={24} color={C.fast}>环境热库</Text>
 <Arrow d="M301 774H407" color={C.fast}/><Text x={354} y={755} size={16} color={C.fast}>热 Q</Text>
 <Arrow d="M515 827Q515 881 385 886" color={C.fast}/><Arrow d="M203 849Q203 886 325 886" color={C.slow}/>
 <Text y={934} size={32} color={C.white} alpha={p}>平均总熵变 ≥ 0</Text><Text y={966} size={15} color={C.muted}>完整循环 · 把控制与信息处理一起计入</Text>
 </g>;
}

function Modern({t}:{t:number}){
 const pulse=(t-79)*.20,p=ramp(t,79,80.6),nodes=[{x:360,y:460,label:'量子测量',color:C.gold},{x:548,y:728,label:'反馈控制',color:C.mint},{x:172,y:728,label:'物理系统',color:C.slow}];
 const paths=['M404 505Q553 540 548 660','M490 753Q360 827 229 753','M172 660Q170 540 316 505'];
 return <g opacity={p}>
 {paths.map((d,i)=>{const u=((t-79)/3-i/3+10)%1,a=[[404,505],[490,753],[172,660]][i],b=[[553,540],[360,827],[170,540]][i],c=[[548,660],[229,753],[316,505]][i];return <g key={i}><Arrow d={d} color={nodes[i].color} width={2.5}/><circle cx={(1-u)*(1-u)*a[0]+2*(1-u)*u*b[0]+u*u*c[0]} cy={(1-u)*(1-u)*a[1]+2*(1-u)*u*b[1]+u*u*c[1]} r="5" fill={nodes[i].color}/></g>;})}
 {nodes.map((n,i)=>{const active=.35+.65*(.5+.5*Math.cos((pulse-i/3)*Math.PI*2));return <g key={i}><circle cx={n.x} cy={n.y} r="64" fill={C.panel} stroke={n.color} strokeWidth="2"/><circle cx={n.x} cy={n.y} r="73" fill="none" stroke={n.color} strokeWidth="1" opacity={active*.3}/><Text x={n.x} y={n.y+6} size={22} color={n.color}>{n.label}</Text></g>;})}
 <g transform="translate(360 639)"><circle r="56" fill="none" stroke={C.white} strokeWidth="1" opacity=".4"/><ellipse rx="56" ry="17" fill="none" stroke={C.line} strokeWidth="1"/><path d="M0 56V-56M-36 42L36 -42" stroke={C.line} strokeWidth="1"/><Arrow d={`M0 0L${Math.cos((t-79)*.5)*37} ${-26-Math.sin((t-79)*.5)*15}`} color={C.white} width={2}/></g>
 <Text y={886} size={29} color={C.white}>我们知道了什么？</Text><Text y={935} size={29} color={C.gold} alpha={ramp(t,84.8,88)}>又为此付出了什么？</Text>
 </g>;
}

export const MaxwellDemon:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const i=story.captions.findIndex(c=>t>=c.start&&t<c.end),cue=story.captions[Math.max(0,i)];
 return <AbsoluteFill style={{backgroundColor:C.bg}}><svg width="100%" height="100%" viewBox="0 0 720 1280">
 <defs><linearGradient id="lab" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#193b45"/><stop offset="1" stopColor={C.bg}/></linearGradient><clipPath id="gas-inside"><rect x="79" y="477" width="562" height="344" rx="7"/></clipPath><clipPath id="lab-stage"><rect x="32" y="324" width="656" height="674"/></clipPath>{[C.gold,C.fast,C.slow,C.mint].map(color=><marker key={color} id={`arrow-${color.slice(1)}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1L6 4L1 7" stroke={color} strokeWidth="1.2" fill="none"/></marker>)}</defs>
 <rect width="720" height="1280" fill="url(#lab)"/>
 {Array.from({length:11},(_,i)=><path key={i} d={`M${60+i*60} 130V993M36 ${340+i*60}H684`} stroke={C.line} strokeWidth=".6" opacity=".06"/>)}
 <Text x={52} y={75} anchor="start" size={12} color={C.gold} space={3}>MAXWELL'S DEMON</Text><Text x={668} y={75} anchor="end" size={13} color={C.muted}>信息 × 热力学</Text><path d="M52 109H668" stroke={C.line} strokeWidth="1" opacity=".6"/>
 <Heading t={t}/>
 <g clipPath="url(#lab-stage)">{t<63?<Apparatus t={t}/>:t<71?<Erasure t={t}/>:t<79?<Ledger t={t}/>:<Modern t={t}/>}</g>
 <path d="M51 1013H669" stroke={C.gold} opacity=".4"/>
 <Text x={54} y={1042} anchor="start" size={12} color={C.gold} space={3}>{String(i+1).padStart(2,'0')} / {t<37?'思想实验':t<71?'信息处理':'完整循环'}</Text>
 <rect x="41" y="1056" width="638" height="116" rx="9" fill={C.bg} opacity=".82"/>
 {cue.lines.map((l,j)=><Text key={j} y={1097+j*46} size={28}>{l}</Text>)}
 <path d="M54 1201H666" stroke={C.line} strokeWidth="2" opacity=".6"/><path d={`M54 1201H${54+612*t/90}`} stroke={C.mint} strokeWidth="3"/>
 <Text y={1240} size={12} color={C.muted}>{t<63?'示意动画 · 颜色区分快慢，非不同气体':'信息是物理的 · 测量、记忆与反馈的完整账本'}</Text>
 </svg></AbsoluteFill>;
};
