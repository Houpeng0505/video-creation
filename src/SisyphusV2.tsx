import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import story from '../content/sisyphus_v2.json';

type P={p:number;t:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const x=clamp(n);return x*x*(3-2*x)};
const hash=(n:number)=>{const x=Math.sin(n*71.23+13.4)*14376.5;return x-Math.floor(x)};
const shape='"Noto Serif CJK SC", "Source Han Serif SC", serif';
const sans='"Noto Sans CJK SC", "Noto Sans SC", sans-serif';
const stars=Array.from({length:84},(_,i)=>({x:hash(i+10)*1100,y:hash(i+700)*1470,r:1+hash(i+1700)*2}));
const pebbles=Array.from({length:45},(_,i)=>({x:hash(i+100)*1100,y:hash(i+440)*930,r:1+hash(i+1200)*5}));
function Stone({x,y,r=150,rot=0,shine=.6}:{x:number;y:number;r?:number;rot?:number;shine?:number}){
  return <g transform={'translate('+x+' '+y+') rotate('+rot+') scale('+(r/160)+')'}>
    <circle r="163" fill="#111521" stroke="#e6b789" strokeWidth="5"/>
    <path d="M-151 -55 L-94 -133 -13 -157 31 -99 -80 -8Z" fill="#99968c"/>
    <path d="M31 -99 L112 -115 154 -51 75 27 -16 12Z" fill="#605c66"/>
    <path d="M-80 -8 L-13 33 -81 128 -145 60Z" fill="#3a3b47"/>
    <path d="M-13 33 L75 27 128 97 27 155 -81 128Z" fill="#262a38"/>
    <path d="M-94 -133 L-80 -8 -13 33 27 155 M31 -99 L-16 12 75 27 M-81 128 L-13 33" stroke="#171923" strokeWidth="8" fill="none"/>
    <path d="M-94 -133 L-80 -8 -13 33 M31 -99 L-16 12 75 27" stroke="#e5bb93" strokeWidth="3" fill="none" opacity={shine}/>
    <path d="M-130 -100 A154 154 0 0 1 93 -127" fill="none" stroke="#ffe0b0" strokeWidth="6" opacity={shine}/>
    <circle cx="-60" cy="-70" r="19" fill="#d6bb9b" opacity=".13"/>
  </g>;
}
function Hero({x,y,s=1,pose='push',glow=0}:{x:number;y:number;s?:number;pose?:'push'|'stand'|'walk'|'fallen';glow?:number}){
  const push=pose==='push',walk=pose==='walk';
  const arm=push?'M15 -291 Q86 -314 158 -219':'M15 -290 Q73 -260 62 -188';
  return <g transform={'translate('+x+' '+y+') scale('+s+')'}>
    <path d="M-27 -200 Q-123 -105 -94 -15" stroke="#211d29" strokeWidth="60" strokeLinecap="round" fill="none"/>
    <path d="M-27 -200 Q34 -115 85 -17" stroke="#49404a" strokeWidth="57" strokeLinecap="round" fill="none"/>
    <path d="M-96 -23 L-36 -20 0 3 -110 4Z" fill="#24252b" stroke="#cbab8b" strokeWidth="3"/>
    <path d="M65 -21 L136 -18 145 6 52 6Z" fill="#24252b" stroke="#cbab8b" strokeWidth="3"/>
    <path d="M-66 -224 L56 -232 58 -113 9 -149 -55 -103Z" fill="#83594d" stroke="#e3b68d" strokeWidth="4"/>
    <path d="M-60 -205 Q-22 -276 -39 -338 Q18 -383 60 -315 L29 -213Z" fill="url(#body)" stroke="#dcb18a" strokeWidth="5"/>
    <path d="M10 -337 L0 -389" stroke="#8b6259" strokeWidth="40" strokeLinecap="round"/>
    <circle cx="-10" cy="-414" r="58" fill="url(#body)" stroke="#d8af8a" strokeWidth="4"/>
    <path d="M-64 -414 Q-45 -481 19 -466 Q57 -456 40 -417 Q-8 -435 -38 -421Z" fill="#151923"/>
    <path d="M37 -405 L60 -392 35 -381 M24 -409 L31 -409" stroke="#f5c394" strokeWidth="4" fill="none"/>
    <path d={arm} stroke="#45363a" strokeWidth="45" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d={arm} stroke="#edba8b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {push?<><circle cx="158" cy="-219" r="18" fill="#e0a77b" stroke="#fae1aa" strokeWidth="3"/><path d="M25 -272 Q97 -256 158 -195" stroke="#b18a77" strokeWidth="31" fill="none" strokeLinecap="round"/><circle cx="158" cy="-195" r="14" fill="#e4b48e"/></>:null}
    <path d="M-48 -188 L30 -209" stroke="#dcb08b" strokeWidth="2" opacity=".8"/>
    {glow>0&&<ellipse cx="30" cy="-280" rx="108" ry="185" fill="#fff0c0" opacity={glow*.08} filter="url(#blur)"/>}
  </g>;
}
function Ink({light=0}:{light?:number}){
  return <>
    <rect width="1080" height="1920" fill="url(#inkSky)"/>
    <rect width="1080" height="1920" fill="url(#dawnSky)" opacity={light}/>
    <circle cx="876" cy="532" r="180" fill="#f7bd83" opacity={light*.25} filter="url(#blur)"/>
    {stars.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f7d7b0" opacity={(1-light)*(.07+.19*Math.sin(i))}/>)}
  </>;
}
function Ridge({offset=0,shade=.65}:{offset?:number;shade?:number}){
  return <g transform={'translate('+offset+' 0)'}>
    <path d="M-200 1470 L95 1190 220 1340 448 1040 621 1260 830 928 1170 1200 1350 1020 V1920 H-200Z" fill="#4b4557" opacity={shade}/>
    <path d="M-200 1560 L193 1320 370 1445 574 1190 755 1440 952 1194 1320 1440 V1920 H-200Z" fill="#242c3f" opacity=".82"/>
    <path d="M-100 1700 Q380 1450 690 1510 T1200 1480 V1920 H-100Z" fill="#0f1629"/>
  </g>;
}
function Ground({startY=1380,delta=0.4}:{startY?:number;delta?:number}){
  const y=(x:number)=>startY-(x-90)*delta;
  return <g>
    <path d={'M-100 '+y(-100)+' L1180 '+y(1180)+' L1180 2000 L-100 2000Z'} fill="url(#cliff)" stroke="#e6b88d" strokeWidth="7"/>
    <path d={'M-100 '+(y(-100)+18)+' L1180 '+(y(1180)+18)} stroke="#141a29" strokeWidth="16"/>
    {Array.from({length:18},(_,i)=>{const x=i*74-100;return <path key={i} d={'M'+x+' '+(y(x)+35)+' l-35 140 90 35 -22 110'} fill="none" stroke="#deb08b" strokeWidth="2" opacity=".23"/>})}
  </g>;
}
const title=(text:string,x=540,y=310,size=90)=><text x={x} y={y} textAnchor="middle" fontFamily={shape} fontWeight="700" fontSize={size} fill="#fae9ce" letterSpacing="8">{text}</text>;
const line=(d:string,opacity=.5)=><path d={d} fill="none" stroke="#f2bd8c" strokeWidth="3" opacity={opacity}/>;
const dust=(x:number,y:number,p:number)=><g>{pebbles.slice(0,23).map((q,i)=>{const spread=p*(90+q.x*.45);return <circle key={i} cx={x+Math.sin(i*31)*spread} cy={y-(q.y%70)-p*(40+q.y*.2)} r={q.r*1.4} fill="#ddaa88" opacity={(.5-.4*p)*Math.max(0,p)} />})}</g>;

// 00–06: punitive verdict, chain and oppressive mass
function Shot0({p,t}:P){const k=ease(p);return <><Ink/><Ridge shade={.4}/>
  {Array.from({length:2},(_,side)=><g key={side} transform={'translate('+(side===0?140:940)+' 0)'}>
    {Array.from({length:7},(_,i)=><rect key={i} x="-26" y={145+i*116} width="52" height="92" rx="25" fill="none" stroke="#bd9472" strokeWidth="13" opacity={.14+i*.06} transform={'rotate('+(i%2===0?17:-18)+' 0 '+(191+i*116)+')'}/>)}</g>)}
  <g transform={'translate(0 '+(-210+215*k)+')'}><Stone x={545} y={635} r={300} rot={t*1.2}/></g>
  <path d="M-50 1510 L370 1220 570 1310 1000 1150 1200 1500 V1920 H-50Z" fill="#151a28" stroke="#897369" strokeWidth="6"/>
  <Hero x={445} y={1436} s={.52} pose="stand"/>
  {title('命 运 的 判 决',540,1278,53)}
  <path d="M355 1325 H727" stroke="#eab687" opacity=".6"/></>}
// 06–12: wide establishing incline, stone climbs
function Shot1({p,t}:P){const x=426+320*ease(p),y=1450-(x-90)*.48-158;return <><Ink/><Ridge/><Ground startY={1450} delta={.48}/>
  <path d="M245 360 Q555 270 895 242" stroke="#f6c48c" strokeWidth="2" strokeDasharray="8 17" fill="none" opacity=".5"/>
  <path d="M836 224 l63 18 -39 50" stroke="#f6c48c" strokeWidth="4" fill="none"/>
  <text x="876" y="205" fontFamily={shape} fontSize="31" fill="#e5b993">远处的山顶</text>
  <Hero x={x-305} y={1450-((x-305)-90)*.48} s={.82} pose="push"/>
  <Stone x={x} y={y} r={158} rot={(x-426)*.36}/>
  {dust(x-160,y+152,p*.5)}</>}
// 12–18: physically legible extreme close-up of hand, stone and footing
function Shot2({p,t}:P){const press=Math.sin(t*5)*10;return <><Ink/><Ridge shade={.38}/>
  <path d="M-90 1430 L1150 1030 V2000 H-90Z" fill="url(#cliff)" stroke="#bc9075" strokeWidth="10"/>
  <Stone x={785+press} y={790} r={424} rot={p*20}/>
  <path d={'M-150 1210 Q80 1200 260 1030 T'+(440+press)+' 830'} fill="none" stroke="#3e343b" strokeWidth="107" strokeLinecap="round"/>
  <path d={'M-150 1210 Q80 1200 260 1030 T'+(440+press)+' 830'} fill="none" stroke="#e4b48c" strokeWidth="10" strokeLinecap="round"/>
  <ellipse cx={435+press} cy="831" rx="47" ry="34" fill="#e5b48b" stroke="#fae1ae" strokeWidth="6"/>
  <path d={'M'+(443+press)+' 813 l43 -20 M'+(448+press)+' 825 l53 -7'} stroke="#a77662" strokeWidth="7"/>
  <path d="M45 1518 Q130 1438 210 1380 L328 1350 380 1420 219 1451 L183 1530Z" fill="#332e36" stroke="#d9a980" strokeWidth="9"/>
  <path d="M112 1502 Q188 1460 304 1423" stroke="#f3c598" strokeWidth="5" fill="none"/>
  {dust(385,1430,ease(p)*.9)}
  <text x="208" y="460" fontSize="39" fontFamily={shape} fill="#eac7a2" opacity=".7">每一寸，都要用尽全力</text>
  </>}
// 18–24: actual fall synchronised to words
function Shot3({p,t}:P){const u=ease(p),x=862-690*u,y=705+590*u;return <><Ink/><Ridge shade={.65}/>
  <path d="M-120 1440 L1000 620 1210 860 V1920 H-120Z" fill="url(#cliff)" stroke="#d8ab86" strokeWidth="8"/>
  <path d="M1000 620 L1100 553 1170 615" stroke="#f9d3a1" strokeWidth="7" fill="none"/>
  <Hero x={756} y={1040} s={.69} pose="stand"/>
  <path d={'M'+(x+120)+' '+(y-100)+' L'+(x+270)+' '+(y-200)} stroke="#f9c58d" strokeWidth="13" strokeLinecap="round" opacity={.2+.5*u}/>
  <Stone x={x} y={y} r={146} rot={-u*285}/>
  {dust(x+100,y+128,u)}
  <path d="M865 740 C770 910 490 1130 150 1380" fill="none" stroke="#f9c58d" strokeWidth="4" strokeDasharray="13 26" opacity=".6"/>
  </>}
// 24–30: empty summit, zero gains, physical cyclic route
function Shot4({p,t}:P){const k=ease(p);return <><Ink/><Ridge shade={.25}/>
  <path d="M0 1490 L260 1350 480 1100 690 880 1030 630 L1240 930 V1920 H0Z" fill="#282633" stroke="#9c7d70" strokeWidth="4"/>
  <path d="M790 690 L1040 633 1160 680" stroke="#d8ad85" strokeWidth="8" fill="none"/>
  <ellipse cx="945" cy="625" rx="130" ry="29" fill="none" stroke="#e3bc98" strokeWidth="5" opacity=".6"/>
  <g opacity={.75}><path d="M850 700 C480 320 -230 890 260 1410 C570 1700 1050 1410 740 1030" stroke="#e4ad79" strokeWidth="8" fill="none" strokeDasharray="25 16"/>
    <path d="M744 1030 l30 68 -80 -11" stroke="#eab687" strokeWidth="10" fill="none"/></g>
  {Array.from({length:3},(_,i)=><g key={i} opacity={.45-i*.1} transform={'translate('+(520-i*140)+' '+(1140+i*76)+')'}>
    <circle r="70" fill="none" stroke="#dcb58c" strokeWidth="5"/>
    <path d="M-50 -37 L-14 34 52 9" fill="none" stroke="#dcb58c" strokeWidth="4"/>
  </g>)}
  <text x="543" y="365" textAnchor="middle" fontSize="240" fill="#e5b58a" fontFamily="serif" opacity={.2+.17*k}>∞</text>
  {title('山顶空无一物',545,482,57)}</>}
// 30–36: ancient Greek history and identity in sculptural relief
function Shot5({p,t}:P){return <><Ink/><Ridge shade={.22}/>
  <path d="M40 540 L1040 540 990 450 90 450Z" fill="#a58b76" stroke="#e2c29f" strokeWidth="8"/>
  {Array.from({length:5},(_,i)=>{const x=120+i*202;return <g key={i} transform={'translate('+x+' 0)'}>
    <path d="M-52 610 H52 L35 637 -35 637Z" fill="#b49a83"/><rect x="-31" y="633" width="62" height="775" rx="8" fill="#7a6d68" stroke="#c4a48d" strokeWidth="7"/>
    <path d="M-18 645 V1400 M0 645 V1400 M18 645 V1400" stroke="#3e3b44" strokeWidth="7" opacity=".5"/>
    <path d="M-51 1410 H51 V1462 H-51Z" fill="#9d8877" stroke="#d8ac88" strokeWidth="5"/>
  </g>})}
  <rect x="235" y="720" width="610" height="565" rx="7" fill="#4d4651" stroke="#dcba99" strokeWidth="10"/>
  <path d="M275 760 H805 V1250 H275Z" fill="#343541"/>
  <path d="M280 1134 L797 820" stroke="#d1b095" strokeWidth="13"/>
  <g transform="translate(260 1068) scale(.49)"><Hero x={0} y={0} s={1} pose="push"/><Stone x={313} y={-172} r={167} rot={p*76}/></g>
  {title('ΣΙΣΥΦΟΣ',540,355,87)}
  <text x="540" y="1540" fontFamily={shape} textAnchor="middle" fontSize="68" letterSpacing="16" fill="#f4ddba">西 西 弗 斯</text>
  <path d="M190 1592 H890" stroke="#d1a985" opacity=".7" strokeWidth="3"/></>}
// 36–43: three timelines with distinct moving subjects
function Shot6({p,t}:P){return <><Ink/><Ridge shade={.18}/>
    <text x="540" y="355" textAnchor="middle" fontSize="240" fontFamily="serif" fill="#deb188" opacity=".17">∞</text>
    {[0,1,2].map((i)=>{const left=80+i*325;const mode=(p*3+i)%1;const px=left+73+83*ease(mode);const sy=1170-i*42;return <g key={i}>
      <rect x={left} y="525" width="280" height="790" rx="10" fill="#282637" stroke="#b9967e" strokeWidth="3" opacity=".94"/>
      <path d={'M'+(left+10)+' '+(sy+160)+' L'+(left+270)+' '+(sy-145)+' L'+(left+270)+' 1300 L'+(left+10)+' 1300Z'} fill="#584951" stroke="#caa386" strokeWidth="5"/>
      <g transform={'translate('+px+' '+(sy+86- (px-left)*.7)+') scale(.35)'}><Hero x={0} y={0} s={1} pose="push"/><Stone x={312} y={-168} r={166} rot={p*145+i*77}/></g>
      <path d={'M'+(left+30)+' 1330 H'+(left+260)} stroke="#dcb08f" strokeWidth="3" opacity=".65"/>
      <text x={left+140} y="1395" textAnchor="middle" fontSize="38" fontFamily={shape} fill="#f0d0aa">{['第一次','第一百次','无数次'][i]}</text>
      <path d={'M'+(left+230)+' 800 q85 130 -40 200'} stroke="#eab889" strokeWidth="4" fill="none" strokeDasharray="12 14"/>
    </g>})}
    <text x="540" y="463" textAnchor="middle" fontFamily={shape} fill="#f1d3b1" fontSize="42" letterSpacing="8">无穷重复的劳动</text>
  </>}
// 43–50: Camus and writing as visual causal bridge
function Shot7({p,t}:P){return <><Ink/><Ridge shade={.13}/>
  <path d="M-20 1385 Q600 1300 1150 1342 L1100 1920 H-30Z" fill="#332d36"/>
  <path d="M-20 1385 L1130 1385" stroke="#e1ad89" strokeWidth="13"/>
  {/* philosopher silhouette */}
  <g transform={'translate('+(75-25*ease(p))+' 0)'}>
    <path d="M135 1168 Q40 1172 67 1373 L440 1373 Q422 1210 340 1180 L310 1130 218 1150Z" fill="#171822" stroke="#bd8c76" strokeWidth="5"/>
    <circle cx="243" cy="1030" r="102" fill="#39313a" stroke="#d1a080" strokeWidth="6"/>
    <path d="M147 996 Q120 920 245 919 Q354 950 351 1030 Q290 986 218 995Z" fill="#0d1320"/>
    <path d="M313 1038 l65 17 -60 24" fill="none" stroke="#ecc09b" strokeWidth="5"/>
    <path d="M350 1170 Q432 1150 510 1260" stroke="#8a5f51" strokeWidth="40" fill="none" strokeLinecap="round"/>
  </g>
  <path d="M450 1196 Q660 1146 990 1210 L980 1533 458 1533Z" fill="#c4aa8e" stroke="#f8d5b0" strokeWidth="7"/>
  <path d="M450 1196 Q620 1150 700 1264 L710 1510 M700 1264 Q815 1150 990 1210" stroke="#55434a" strokeWidth="7" fill="none"/>
  {Array.from({length:9},(_,i)=><path key={i} d={'M730 '+(1272+i*21)+' H960 M480 '+(1310+i*21)+' H671'} stroke="#59484c" opacity=".37" strokeWidth="3"/>)}
  <circle cx={784} cy={1041} r={108+13*ease(p)} fill="none" stroke="#e1b592" strokeWidth="4" opacity=".7"/>
  <g transform={'translate(719 1160) scale(.29)'}><Hero x={0} y={0} s={1} pose="push" glow={.5}/><Stone x={312} y={-168} r={160} rot={p*45}/></g>
  <path d="M635 1036 Q718 870 841 927" fill="none" stroke="#f4cb98" strokeWidth="3" strokeDasharray="8 16"/>
  <text x="555" y="355" textAnchor="middle" fontFamily="serif" fontSize="104" letterSpacing="9" fill="#f2d2ad">CAMUS</text>
  <text x="555" y="427" textAnchor="middle" fontFamily="serif" fontSize="35" letterSpacing="8" fill="#d5a889">1942 / THE MYTH OF SISYPHUS</text>
  </>}
// 50–57: human demand for meaning and indifferent universe
function Shot8({p,t}:P){const k=ease(p);return <><Ink/>
  <circle cx="815" cy="670" r="264" fill="none" stroke="#6d6070" strokeWidth="3" opacity=".5"/>
  <circle cx="815" cy="670" r="205" fill="none" stroke="#6d6070" strokeWidth="2" opacity=".43"/>
  {stars.slice(0,47).map((s,i)=><circle key={i} cx={535+s.x*.47} cy={220+s.y*.71} r={s.r} fill="#e7cba9" opacity=".45"/>)}
  <path d="M-40 1460 L280 1240 450 1450 V1920 H-40Z" fill="#262a39" stroke="#d2a78b" strokeWidth="6"/>
  <g transform="translate(115 1395) scale(.82)"><Hero x={0} y={0} s={1} pose="stand" glow={.8}/></g>
  <path d={'M290 985 Q440 '+(750-60*k)+' 645 740'} fill="none" stroke="#edc997" strokeWidth="5" strokeDasharray="13 20"/>
  <path d="M625 720 l60 16 -38 44" fill="none" stroke="#ebbd89" strokeWidth="5"/>
  <path d="M714 634 l31 -33 34 51 M781 579 l34 26 -40 38" stroke="#f3d3ac" strokeWidth="4" opacity=".75" fill="none"/>
  <text x="270" y="471" fontFamily={shape} fontSize="58" fill="#f5d5ae" letterSpacing="8">人渴望意义</text>
  <text x="832" y="1073" textAnchor="middle" fontFamily={shape} fontSize="49" fill="#ab9ba0" opacity=".82" letterSpacing="7">世界沉默</text>
  <path d="M675 795 l46 46 M721 795 l-46 46" stroke="#d6b19d" strokeWidth="6" opacity={k}/>
  </>}
// 57–64: boulder falls *while* narrator says boulder falls
function Shot9({p,t}:P){const k=ease(p),x=838-612*k,y=620+760*k;return <><Ink/><Ridge shade={.35}/>
  <path d="M-100 1560 L1030 480 L1150 720 V1920 H-100Z" fill="url(#cliff)" stroke="#e2ad83" strokeWidth="9"/>
  <path d="M960 650 Q860 790 600 1050 T130 1430" fill="none" stroke="#edc29b" strokeWidth="5" strokeDasharray="14 20" opacity=".6"/>
  {Array.from({length:3},(_,i)=><circle key={i} cx={x+i*83*k} cy={y-i*110*k} r={118-i*17} fill="none" stroke="#d5b096" strokeWidth="5" opacity={k*.23}/>) }
  <Stone x={x} y={y} r={160} rot={-k*450}/>
  {dust(x+100,y+150,k)}
  <g transform="translate(665 1040) scale(.58)"><Hero x={0} y={0} s={1} pose="stand"/></g>
  <path d="M820 380 q80 -100 170 -10" fill="none" stroke="#edba8b" strokeWidth="6"/>
  <path d="M982 330 l13 65 -63 -12" fill="none" stroke="#edba8b" strokeWidth="6"/>
  </>}
// 64–71: choice is explicitly the step: boot lifts and plants
function Shot10({p,t}:P){const k=ease(p),lift=Math.sin(Math.PI*k)*117;return <><Ink/><Ridge shade={.21}/>
  <path d="M-100 1300 L1150 1040 V1920 H-100Z" fill="url(#cliff)" stroke="#bda185" strokeWidth="9"/>
  {Array.from({length:3},(_,i)=><g key={i} opacity={.12+.13*i} transform={'translate('+(160+i*160)+' '+(1170-i*40)+')'}>
    <ellipse cx="0" cy="0" rx="82" ry="25" transform="rotate(-9)" fill="#c49f7c"/>
    <ellipse cx="37" cy="-66" rx="34" ry="63" transform="rotate(-16 37 -66)" fill="#c49f7c"/></g>)}
  <path d={'M'+(125+270*k)+' '+(1000-lift)+' Q'+(180+260*k)+' '+(1080-lift)+' '+(270+260*k)+' '+(1085-lift)+' L'+(330+260*k)+' '+(1125-lift)+' L'+(337+260*k)+' '+(1184-lift)+' L'+(135+260*k)+' '+(1170-lift)+'Z'} fill="#433740" stroke="#f4c394" strokeWidth="9"/>
  <path d={'M'+(240+265*k)+' '+(1113-lift)+' l94 9'} stroke="#f8d1a7" strokeWidth="5"/>
  <path d={'M'+(485+240*k)+' '+(900-lift)+' l-65 230'} stroke="#262532" strokeWidth="101" strokeLinecap="round"/>
  <path d={'M'+(485+240*k)+' '+(900-lift)+' l-65 230'} stroke="#c69b7e" strokeWidth="8"/>
  {dust(460+240*k,1250,k*.8)}
  <text x="540" y="505" textAnchor="middle" fontSize="61" fontFamily={shape} fill="#ecd0af">结果并非由他决定</text>
  <text x="540" y="590" textAnchor="middle" fontSize="60" fontFamily={shape} fill="#ffdaab">但这一步是他迈出的</text>
  </>}
// 71–78: enlarged eye and changed perception
function Shot11({p,t}:P){const k=ease(p);return <><Ink light={k*.56}/>
  <path d="M-70 1200 Q60 650 525 534 Q942 545 1150 1210 L1110 1690 0 1690Z" fill="url(#body)" stroke="#d9ac8a" strokeWidth="11"/>
  <path d="M52 1026 Q540 '+(750-36*k)+' 1000 1010 Q534 '+(1290+15*k)+' 52 1026Z" fill="#e9c09c" stroke="#2e2d3a" strokeWidth="14"/>
  <ellipse cx="552" cy="1035" rx="266" ry="173" fill="#7f7072" stroke="#292631" strokeWidth="15"/>
  <ellipse cx="552" cy="1030" rx="165" ry="165" fill="#283044" stroke="#c29679" strokeWidth="10"/>
  <circle cx="552" cy="1030" r="91" fill="#101726"/>
  <circle cx="600" cy="978" r="51" fill="#ffcf92" opacity={.27+.4*k}/>
  <g transform="translate(510 1080) scale(.18)" opacity=".7"><Hero x={0} y={0} s={1} pose="push"/><Stone x={312} y={-168} r={165} rot={t*14}/></g>
  <path d="M35 1017 Q545 772 1010 1005" fill="none" stroke="#533c3f" strokeWidth="35" opacity=".5"/>
  <path d="M58 1225 Q540 1482 1022 1225" fill="none" stroke="#5a4448" strokeWidth="24" opacity=".67"/>
  <path d="M740 718 L960 420" stroke="#ffe0ac" strokeWidth="23" opacity={k*.54}/>
  </>}
// 78–85: pushing action; physical exertion, light and grains
function Shot12({p,t}:P){const k=ease(p),x=540+290*k;const y=1280-(x-220)*.37-185;return <><Ink light={.6+k*.3}/><Ridge shade={.52}/>
  <Ground startY={1390} delta={.37}/>
  <Hero x={x-339} y={1390-(x-339-90)*.37} s={.90} pose="push" glow={k*.8}/>
  <Stone x={x} y={y} r={185} rot={k*117} shine={1}/>
  {dust(x-90,y+140,k)}
  {Array.from({length:12},(_,i)=><path key={i} d={'M'+(x-205-i*30)+' '+(y-130+i*17)+' l-80 -24'} fill="none" stroke="#ffddb0" strokeWidth="3" opacity={k*.15}/>)}
  <path d="M740 0 L1130 0 520 1450Z" fill="#ffd59d" opacity={.1+.12*k}/></>}
// 85–90: epic long shot. Climb continues, never reaches apex.
function Shot13({p,t}:P){const k=ease(p),x=470+175*k;return <><Ink light={.95}/>
  <circle cx="868" cy="520" r="130" fill="#ffe1b2" opacity=".5"/>
  <path d="M-100 1400 L240 1100 415 1210 715 700 943 840 1210 390 V1940 H-100Z" fill="#4c4555" stroke="#c79579" strokeWidth="5"/>
  <path d="M-90 1550 L235 1340 418 1430 695 1120 930 1270 1180 1030 V1940 H-90Z" fill="#222a3a"/>
  <path d="M160 1380 L1180 690 V1960 H160Z" fill="#151a2a" stroke="#b88e77" strokeWidth="6"/>
  <g transform={'translate('+x+' '+(1280-(x-160)*.677)+') scale(.43)'}>
    <Hero x={-10} y={0} s={1} pose="push" glow={.2}/>
    <Stone x={296} y={-168} r={162} rot={k*103}/>
  </g>
  <path d="M670 0 L1090 0 350 1540Z" fill="#ffe2a6" opacity=".13"/>
  {title('清醒之后，仍然向前',540,370,65)}
  <path d="M290 411 H794" stroke="#f1c596" strokeWidth="3" opacity=".7"/>
  <text x="540" y="468" fontFamily="serif" letterSpacing="5" fontSize="26" textAnchor="middle" fill="#f2c69c">COURAGE WITHOUT GUARANTEE</text></>}
const scenes=[Shot0,Shot1,Shot2,Shot3,Shot4,Shot5,Shot6,Shot7,Shot8,Shot9,Shot10,Shot11,Shot12,Shot13];
function Caption({text,lines,k}:{text:string;lines:string[];k:number}){return <g opacity={k}>
  <rect x="54" y="1602" width="972" height="217" rx="22" fill="#0b1120" opacity=".96" stroke="#ad896e" strokeWidth="2"/>
  <path d="M105 1620 H977" stroke="#d8b18e" strokeWidth="1.6" opacity=".5"/>
  {lines.map((a,i)=><text key={i} x="540" y={1692+i*67} textAnchor="middle" fontSize="49" letterSpacing="1.6" fontFamily={sans} fontWeight="600" fill="#fdf1db">{a}</text>)}
</g>}
export const SisyphusV2:React.FC=()=>{
  const t=useCurrentFrame()/30;let index=story.captions.findIndex(c=>t>=c.start&&t<c.end);
  if(index<0)index=story.captions.length-1;
  const cue=story.captions[index],p=(t-cue.start)/(cue.end-cue.start);
  const Scene=scenes[index];
  const fade=ease(p*14)*(1-ease((p-.945)/.055));
  return <AbsoluteFill style={{backgroundColor:'#0a0e1b'}}>
    <svg viewBox="0 0 1080 1920" height="100%" width="100%">
      <defs>
        <linearGradient id="inkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#090c1b"/><stop offset=".55" stopColor="#27283b"/><stop offset="1" stopColor="#51404c"/></linearGradient>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#383348"/><stop offset=".48" stopColor="#af705d"/><stop offset="1" stopColor="#ebbb8e"/></linearGradient>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a87d70"/><stop offset=".48" stopColor="#725155"/><stop offset="1" stopColor="#252a3b"/></linearGradient>
        <linearGradient id="cliff" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stopColor="#71605e"/><stop offset=".43" stopColor="#343444"/><stop offset="1" stopColor="#101626"/></linearGradient>
        <radialGradient id="vignette"><stop offset=".45" stopColor="#060911" stopOpacity="0"/><stop offset="1" stopColor="#050812" stopOpacity=".64"/></radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="27"/></filter>
        <pattern id="texture" width="89" height="93" patternUnits="userSpaceOnUse"><circle cx="23" cy="17" r="1.2" fill="#fff1d7" opacity=".14"/><circle cx="52" cy="75" r="1" fill="#fff1d7" opacity=".11"/></pattern>
      </defs>
      <Scene t={t} p={p}/>
      <rect x="0" y="0" width="1080" height="1920" fill="url(#texture)" opacity=".8"/>
      <rect x="0" y="0" width="1080" height="1920" fill="url(#vignette)"/>
      <g><text x="68" y="100" fontFamily="serif" fontSize="24" letterSpacing="6" fill="#efd1ad">THE MYTH OF SISYPHUS</text>
        <text x="1015" y="100" textAnchor="end" fontFamily="serif" fontSize="24" fill="#efd1ad">{String(index+1).padStart(2,'0')} / 14</text>
        <path d="M66 120 H1015" stroke="#deb28b" strokeWidth="2" opacity=".64"/></g>
      <Caption text={cue.text} lines={cue.lines} k={fade}/>
      <text x="540" y="1895" fontFamily={sans} textAnchor="middle" fontSize="22" letterSpacing="3" fill="#dfb690" opacity=".86">据加缪《西西弗神话》改编 · VIDEO CREATION</text>
    </svg>
  </AbsoluteFill>;
};