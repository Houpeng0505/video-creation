import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import film from '../content/sisyphus.json';

const clip=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const v=clip(n);return v*v*(3-2*v)};
const up=(t:number,a:number,b:number)=>ease((t-a)/(b-a));
const down=(t:number,a:number,b:number)=>1-up(t,a,b);
const slope=(x:number)=>1490-(x-40)*.38;
const rand=(n:number)=>{const v=Math.sin(n*137.1+52.7)*9574.35;return v-Math.floor(v)};
const stars=Array.from({length:90},(_,i)=>({x:rand(i)*1080,y:rand(i+170)*1170,r:.7+rand(i+80)*1.7}));
const DUST=Array.from({length:16},(_,i)=>({u:rand(i+300),v:rand(i+520)}));

function Stone({x,t,isFalling}:{x:number,t:number,isFalling:boolean}){
  const y=slope(x)-164;
  const rotate=(x-560)/164*57.2958;
  return <g transform={'translate('+x+' '+y+') rotate('+rotate+')'}>
    <ellipse cy="176" cx="15" rx="177" ry="35" fill="#080e16" opacity=".33" filter="url(#blur)"/>
    <circle r="162" fill="url(#stone)" stroke="#a99276" strokeWidth="4"/>
    <path d="M-152 -42 L-95 -114 L-15 -158 L22 -98 -71 -16Z" fill="#aaa69b" opacity=".25"/>
    <path d="M22 -98 L109 -114 L152 -46 L81 35 L-9 19Z" fill="#777575" opacity=".45"/>
    <path d="M-71 -16 L-18 30 L-85 125 -139 62Z" fill="#171c2a" opacity=".51"/>
    <path d="M-18 30 L81 35 L121 100 L24 158 -85 125Z" fill="#202333" opacity=".64"/>
    <path d="M-95 -114 L-71 -16 L-18 30 24 158 M22 -98 L-9 19 L81 35 M-85 125 L-18 30"
      fill="none" stroke="#26232e" strokeWidth="8" opacity=".88"/>
    <path d="M-95 -114 L-71 -16 L-18 30 M22 -98 L-9 19 L81 35"
      fill="none" stroke="#d8ad83" strokeWidth="2.5" opacity=".66"/>
    <path d="M-116 -109 A160 160 0 0 1 60 -150" fill="none" stroke="#f3d19e" strokeWidth="5" opacity=".56"/>
    {Array.from({length:22},(_,i)=>{const a=i*2.399,r=60+rand(i)*85;return <path key={i}
      d={'M'+Math.cos(a)*r+' '+Math.sin(a)*r+' l'+(rand(i+33)*18-8)+' '+(rand(i+66)*24-14)}
      stroke="#ccb098" strokeWidth="2" opacity=".23"/>})}
    {isFalling&&DUST.map((p,i)=><path key={i} d={'M'+(-230+p.u*470)+' '+(-100+p.v*220)+' l-39 52'}
      stroke="#efbd85" strokeWidth={1.5+p.u*3} opacity=".32"/>)}
  </g>
}

function Human({x,t,rockX,push,opacity=1}:{x:number,t:number,rockX:number,push:boolean,opacity?:number}){
  const base=slope(x),hipX=x-39,hipY=base-196,shoulderX=x+10,shoulderY=base-339,headX=x-10,headY=base-440;
  const heelL=x-110,heelR=x+106;
  const step=push?Math.sin(t*3.9)*4:Math.sin(t*4)*11;
  const touchX=rockX-150,touchY=slope(rockX)-164-48;
  return <g opacity={opacity} transform={'translate('+step+' 0)'}>
    <ellipse cx={x-15} cy={base+15} rx="160" ry="25" fill="#0a101e" opacity=".44" filter="url(#blur)"/>
    <path d={'M'+(hipX-26)+' '+hipY+' Q'+(x-130)+' '+(base-129)+' '+(x-143)+' '+(base-89)+' L'+(heelL-4)+' '+(slope(heelL)-16)}
      stroke="#181e2b" strokeWidth="66" strokeLinecap="round" fill="none"/>
    <path d={'M'+(hipX+17)+' '+hipY+' Q'+(x+64)+' '+(base-150)+' '+(x+88)+' '+(base-105)+' L'+(heelR-20)+' '+(slope(heelR)-18)}
      stroke="#35313a" strokeWidth="59" strokeLinecap="round" fill="none"/>
    <path d={'M'+(hipX-23)+' '+hipY+' Q'+(x-130)+' '+(base-129)+' '+(x-143)+' '+(base-89)+' L'+(heelL-4)+' '+(slope(heelL)-16)}
      stroke="#b29378" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".8"/>
    <path d={'M'+(hipX+17)+' '+hipY+' Q'+(x+64)+' '+(base-150)+' '+(x+88)+' '+(base-105)+' L'+(heelR-20)+' '+(slope(heelR)-18)}
      stroke="#e1b287" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity=".76"/>
    <path d={'M'+(heelL-35)+' '+(slope(heelL)-10)+' l80 -8 15 22 -101 0Z'} fill="#242331" stroke="#ae967d" strokeWidth="3"/>
    <path d={'M'+(heelR-40)+' '+(slope(heelR)-10)+' l77 -2 17 22 -105 0Z'} fill="#242331" stroke="#ae967d" strokeWidth="3"/>
    <path d={'M'+(hipX-70)+' '+(hipY-25)+' l130 -31 -10 151 -48 -34 -61 53Z'}
      fill="#6a4d48" stroke="#be9273" strokeWidth="3"/>
    <path d={'M'+(hipX-60)+' '+(hipY+10)+' l110 -22 M'+(hipX-43)+' '+(hipY+39)+' l83 -12'}
      stroke="#cda480" strokeWidth="2.6" opacity=".48"/>
    <path d={'M'+(hipX-52)+' '+(hipY+12)+' Q'+(x-40)+' '+(base-272)+' '+(shoulderX-38)+' '+(shoulderY-43)
      +' Q'+(shoulderX+29)+' '+(shoulderY-78)+' '+(shoulderX+79)+' '+(shoulderY-8)
      +' Q'+(x+39)+' '+(base-254)+' '+(hipX+42)+' '+(hipY-10)+'Z'}
      fill="url(#body)" stroke="#dab088" strokeWidth="4"/>
    <path d={'M'+(shoulderX+4)+' '+(shoulderY-45)+' l-3 -43'} stroke="#8f6560" strokeWidth="37" strokeLinecap="round"/>
    <circle cx={headX} cy={headY} r="53" fill="url(#body)" stroke="#d4ab86" strokeWidth="4"/>
    <path d={'M'+(headX-52)+' '+(headY-1)+' Q'+(headX-42)+' '+(headY-58)+' '+(headX+14)+' '+(headY-49)
      +' Q'+(headX+51)+' '+(headY-30)+' '+(headX+42)+' '+(headY-9)+' Q'+headX+' '+(headY-18)+' '+(headX-52)+' '+(headY-1)}
      fill="#171b28"/>
    <path d={'M'+(headX+42)+' '+(headY-1)+' l18 13 -23 9'} fill="none" stroke="#dfae88" strokeWidth="3"/>
    {push?<g>
      <path d={'M'+(shoulderX+7)+' '+(shoulderY-8)+' Q'+(x+118)+' '+(shoulderY-55)+' '+(touchX-16)+' '+(touchY+25)+' L'+touchX+' '+touchY}
        fill="none" stroke="#44363b" strokeWidth="39" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={'M'+(shoulderX+7)+' '+(shoulderY-8)+' Q'+(x+118)+' '+(shoulderY-55)+' '+(touchX-16)+' '+(touchY+25)+' L'+touchX+' '+touchY}
        fill="none" stroke="#efbd92" strokeWidth="4" opacity=".86"/>
      <path d={'M'+(shoulderX+26)+' '+(shoulderY+29)+' Q'+(x+113)+' '+(shoulderY+40)+' '+(touchX-21)+' '+(touchY+49)+' L'+(touchX+13)+' '+(touchY+31)}
        fill="none" stroke="#76504a" strokeWidth="30" strokeLinecap="round"/>
      <path d={'M'+(shoulderX+26)+' '+(shoulderY+29)+' Q'+(x+113)+' '+(shoulderY+40)+' '+(touchX-21)+' '+(touchY+49)+' L'+(touchX+13)+' '+(touchY+31)}
        fill="none" stroke="#f6c190" strokeWidth="3" opacity=".73"/>
      <circle cx={touchX} cy={touchY} r="12" fill="#efbd91"/>
      <circle cx={touchX+13} cy={touchY+31} r="12" fill="#efbd91"/>
    </g>:<path d={'M'+(shoulderX+21)+' '+(shoulderY)+' Q'+(x+60)+' '+(shoulderY+112)+' '+(x-9)+' '+(base-174)}
        fill="none" stroke="#a77e6b" strokeWidth="30" strokeLinecap="round"/>}
    {DUST.slice(0,8).map((p,i)=>{const w=((t*.7+i*.19)%1);return <circle key={i} cx={heelL-17-w*75+p.u*39} cy={slope(heelL)-w*53} r={2+w*6} fill="#cba88b" opacity={.23*(1-w)}/>})}
  </g>;
}

const SceneWord=({t,a,b,title,sub}:{t:number,a:number,b:number,title:string,sub:string})=>{
  const vis=up(t,a,a+.6)*down(t,b-.8,b);
  return <g opacity={vis} transform={'translate(0 '+((1-vis)*45)+')'}>
    <text x="540" y="311" textAnchor="middle" fontFamily="'Noto Serif CJK SC',serif" fontSize="94" fontWeight="700" letterSpacing="18" fill="#fff1d8">{title}</text>
    <text x="540" y="371" textAnchor="middle" fontFamily="serif" fontSize="24" letterSpacing="6" fill="#e6b38b">{sub}</text>
    <path d="M360 404 H720" stroke="#e8bb88" opacity=".7" strokeWidth="2"/>
  </g>;
};

export const SisyphusFilm:React.FC=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const first=up(t,8,23.8),again=up(t,78,89);
  const rockX=t<24.5?560+285*first:t<34?845-390*up(t,24.5,33.5):t<78?455:455+260*again;
  const manX=t<24.5?rockX-238:t<35?607:t<78?607-390*up(t,35,76):rockX-238;
  const pushing=t<24.5||t>=78;
  const isFalling=t>=24.5&&t<34;
  const light=up(t,58,86);
  const zoom=t<12?.79+.22*up(t,0,11):t<33?1.01+.12*up(t,13,23)-.30*up(t,25,32):t<62?.83+.19*up(t,39,55):t<78?1.02-.12*up(t,62,76):.9-.11*again;
  const focusX=t<34?(rockX+manX)/2:t<78?manX+172:(rockX+manX)/2;
  const tremor=isFalling?Math.sin(t*68)*8*down(t,25,34):0;
  const world='translate('+(540-focusX*zoom+tremor)+' '+(940-1155*zoom)+') scale('+zoom+')';
  const cue=film.captions.find(c=>t>=c.start&&t<c.end);
  return <AbsoluteFill style={{backgroundColor:'#0a101e'}}>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <defs>
        <linearGradient id="sky" x2="0" y2="1"><stop offset="0" stopColor="#090e1d"/><stop offset=".55" stopColor="#28273a"/><stop offset="1" stopColor="#6e4b50"/></linearGradient>
        <linearGradient id="morning" x2="0" y2="1"><stop offset="0" stopColor="#33324e"/><stop offset=".5" stopColor="#b9755a"/><stop offset="1" stopColor="#edb985"/></linearGradient>
        <linearGradient id="stone"><stop offset="0" stopColor="#b0a9a0"/><stop offset=".36" stopColor="#777072"/><stop offset=".74" stopColor="#3b3d49"/><stop offset="1" stopColor="#141c2a"/></linearGradient>
        <linearGradient id="body"><stop offset="0" stopColor="#b68b77"/><stop offset=".43" stopColor="#755957"/><stop offset="1" stopColor="#252637"/></linearGradient>
        <linearGradient id="land"><stop offset="0" stopColor="#574750"/><stop offset=".48" stopColor="#2d303f"/><stop offset="1" stopColor="#0b1020"/></linearGradient>
        <radialGradient id="shade"><stop offset=".48" stopColor="#040914" stopOpacity="0"/><stop offset="1" stopColor="#040914" stopOpacity=".68"/></radialGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="15"/></filter>
        <clipPath id="landClip"><path d={'M-420 '+slope(-420)+' L1500 '+slope(1500)+' L1500 2500 L-420 2500Z'}/></clipPath>
        <pattern id="grain" width="79" height="79" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="21" r="1.2" fill="#fff6dd" opacity=".14"/>
          <circle cx="51" cy="61" r=".8" fill="#fff6dd" opacity=".11"/>
        </pattern>
      </defs>
      <rect width="1080" height="1920" fill="url(#sky)"/>
      <rect width="1080" height="1920" fill="url(#morning)" opacity={light}/>
      <circle cx="947" cy="515" r="110" fill="#ffe3ae" opacity={light*.5}/>
      <circle cx="947" cy="515" r="195" fill="#f6b97e" opacity={light*.13} filter="url(#blur)"/>
      {stars.map((s,i)=><circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f8d5a9" opacity={(1-light)*(.15+.13*Math.sin(t*.65+i))}/>)}
      <path d="M-60 1350 L140 1110 314 1220 485 992 665 1214 880 1052 1160 1290 V1930 H-60Z" fill="#565162" opacity=".5"/>
      <path d="M-80 1430 L146 1244 289 1350 460 1155 639 1370 866 1117 1170 1320 V1930 H-80Z" fill="#262e43" opacity=".8"/>
      <g transform={world}>
        <path d={'M-420 '+slope(-420)+' L1500 '+slope(1500)+' L1500 2400 L-420 2400Z'} fill="url(#land)" stroke="#a68979" strokeWidth="6"/>
        <g clipPath="url(#landClip)">
          {Array.from({length:22},(_,i)=><path key={i} d={'M-400 '+(1230+i*52)+' Q500 '+(1050+i*68)+' 1500 '+(1070+i*40)}
            stroke="#b18b80" strokeWidth={i%4===0?3:1.5} opacity=".19" fill="none"/>)}
        </g>
        <path d={'M-420 '+(slope(-420)-12)+' L1500 '+(slope(1500)-12)} stroke="#f4c090" strokeWidth="3.2" opacity=".45"/>
        <path d={'M-420 '+(slope(-420)+9)+' L1500 '+(slope(1500)+9)} stroke="#121722" strokeWidth="17" opacity=".65"/>
        {t>=35&&t<49&&Array.from({length:4},(_,i)=><Human key={i} x={manX+i*87} t={t-i*3} rockX={manX+i*87+238} push={true} opacity={up(t,35,39)*down(t,46,49)*(.08+i*.03)}/>)}
        {isFalling&&Array.from({length:9},(_,i)=>{const x=rockX+(845-rockX)*(i/10);return <circle key={i} cx={x} cy={slope(x)-164} r={154-i*9} fill="#e1ae80" opacity={.02*(1-i/10)}/>})}
        <Human x={manX} t={t} rockX={rockX} push={pushing}/>
        <Stone x={rockX} t={t} isFalling={isFalling}/>
        {isFalling&&DUST.map((p,i)=>{const x=rockX-200+p.u*390;return <circle key={i} cx={x} cy={slope(x)-p.v*80} r={p.v*7+2} fill="#dcb188" opacity={.35*up(t,26,29)*down(t,32,34)}/>})}
      </g>
      {t>=36&&t<59&&<g opacity={up(t,36,40)*down(t,54,59)}>
        {Array.from({length:5},(_,i)=><ellipse key={i} cx="540" cy="1040" rx={190+i*120} ry={350+i*81} fill="none" stroke="#d3ae8d" strokeWidth="1.5" strokeDasharray="3 17" opacity={.26-i*.035}/>)}
      </g>}
      {light>0&&<path d="M790 0 L1080 0 L185 1610Z" fill="#f5d49e" opacity={light*.11}/>}
      <rect width="1080" height="1920" fill="url(#grain)" opacity=".65"/>
      <rect width="1080" height="1920" fill="url(#shade)"/>
      <SceneWord t={t} a={.6} b={7} title="推 石 者" sub="THE MYTH OF SISYPHUS"/>
      <SceneWord t={t} a={34} b={42} title="徒  劳" sub="AN ENDLESS PUNISHMENT"/>
      <SceneWord t={t} a={49} b={56} title="荒  诞" sub="THE ABSURD"/>
      <SceneWord t={t} a={69} b={76} title="反  抗" sub="THE REVOLT"/>
      <g opacity={up(t,82,84)}>
        <text x="540" y="315" textAnchor="middle" fontSize="46" letterSpacing="5" fontFamily="'Noto Serif CJK SC',serif" fill="#fff0d9">清醒之后，仍然向前</text>
        <text x="540" y="380" textAnchor="middle" fontFamily="serif" fontSize="23" letterSpacing="5" fill="#f5c592">COURAGE WITHOUT GUARANTEE</text>
      </g>
      <text x="64" y="88" fontFamily="serif" fill="#e8c49b" letterSpacing="5" fontSize="23">MYTH / PHILOSOPHY</text>
      <text x="1016" y="88" textAnchor="end" fill="#e8c49b" letterSpacing="3" fontSize="23">01 / 01</text>
      <path d="M64 105 H1016" stroke="#d4ae8d" strokeWidth="1.4" opacity=".5"/>
      {cue&&<g opacity={up(t,cue.start,cue.start+.28)*down(t,cue.end-.38,cue.end)}>
        <path d="M68 1580 H1012" stroke="#ddbc95" opacity=".7"/>
        <rect x="67" y="1597" width="946" height="225" rx="21" fill="#101725" opacity=".95"/>
        {cue.lines.map((line,i)=><text key={i} x="540" y={1680+i*66} textAnchor="middle" fontFamily="'Noto Sans CJK SC',sans-serif" fontWeight="550" letterSpacing="1.5" fontSize="46" fill="#fff1da">{line}</text>)}
      </g>}
      <text x="540" y="1886" textAnchor="middle" fontSize="21" fill="#bfaa90" letterSpacing="4">据加缪《西西弗神话》改编 · VIDEO CREATION</text>
    </svg>
  </AbsoluteFill>;
};
