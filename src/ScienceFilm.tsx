import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import film from '../content/film.json';

const ease = Easing.bezier(0.22, 0.72, 0.22, 1);
const within = (v: number) => Math.max(0, Math.min(1, v));
const reveal = (frame: number, start: number, end: number) =>
  ease(within((frame - start) / (end - start)));

const stemPaths = [
  'M540 1050 C470 985 360 965 260 785',
  'M540 1050 C560 960 575 860 640 700',
  'M540 1050 C650 1050 770 1020 860 880'
];
const tips: Array<[number,number]> = [[260,785],[640,700],[860,880]];
const labels = ['过往', '行动', '目标'];
const TAU = Math.PI * 2;

export const ScienceFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const growth = reveal(frame, 130, 410);
  const focus = reveal(frame, 420, 625);
  const titleOpacity = interpolate(frame, [0,35,140,190], [0,1,1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const subtitle = film.captions.find((c) => seconds >= c.start && seconds < c.end);
  const subtitleFade = subtitle ? Math.min(1, (seconds - subtitle.start) * 3.5, (subtitle.end-seconds)*3.5) : 0;
  const particles = Array.from({length:44}, (_,i) => ({
    x: (i*317.3+69)%1080,
    y: (i*463.1+23)%1920,
    r: 1 + ((i*7)%5)/4,
    phase: i * 0.71
  }));
  return (
    <AbsoluteFill style={{backgroundColor:'#070e12', overflow:'hidden'}}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" role="img" aria-label="目的与行动：连续几何分支科普动画">
        <defs>
          <radialGradient id="space" cx="50%" cy="48%" r="75%">
            <stop offset="0" stopColor="#1b2b30" />
            <stop offset="0.64" stopColor="#0c171c" />
            <stop offset="1" stopColor="#060b0e" />
          </radialGradient>
          <radialGradient id="seed"><stop offset="0" stopColor="#fff5d9"/><stop offset="0.28" stopColor="#cfb887"/><stop offset="1" stopColor="#cfb887" stopOpacity="0"/></radialGradient>
          <linearGradient id="gold" x1="0%" x2="100%" y1="100%" y2="0%">
            <stop offset="0" stopColor="#58665d"/><stop offset="0.5" stopColor="#d9c79c"/><stop offset="1" stopColor="#f2e6c6"/>
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="11"/></filter>
          <pattern id="grain" patternUnits="userSpaceOnUse" width="37" height="47"><circle cx="5" cy="8" r="0.75" fill="#f7eed7" opacity="0.08"/><circle cx="24" cy="38" r="0.5" fill="#fff" opacity="0.04"/></pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#space)"/>
        <rect width="1080" height="1920" fill="url(#grain)"/>
        <circle cx="540" cy="1010" r={375+frame*0.028} fill="none" stroke="#657675" strokeWidth="1.3" opacity="0.17"/>
        <circle cx="540" cy="1010" r={260+Math.sin(frame/55)*14} fill="none" stroke="#8d9687" strokeWidth="1.2" opacity="0.22"/>
        {Array.from({length:6},(_,i) => <circle key={i} cx="540" cy="1010" r={165+i*74+frame*0.045} stroke="#9e9d81" opacity={0.08+(i%2)*0.05} fill="none" strokeDasharray="3 22"/>)}
        {particles.map((p,i)=><circle key={i} cx={p.x+Math.sin(frame/170+p.phase)*9} cy={p.y+Math.cos(frame/154+p.phase)*12} r={p.r} fill="#d9d8b9" opacity={0.11+0.24*(1+Math.sin(frame/47+p.phase))/2}/>)}
        <g transform={`translate(540 1050)`}>
          {Array.from({length:8},(_,i)=>{
            const a=i*TAU/8+frame*0.003;
            return <line key={i} x1={Math.cos(a)*55} y1={Math.sin(a)*55} x2={Math.cos(a)*133} y2={Math.sin(a)*133} stroke="#cab98b" opacity={0.2*(1-focus)} strokeWidth="2"/>;
          })}
        </g>
        {stemPaths.map((path,i)=>(
          <g key={path}>
            <path d={path} fill="none" stroke="#cbb682" strokeWidth="16" opacity={0.11} filter="url(#glow)" strokeDasharray="610" strokeDashoffset={610*(1-growth)}/>
            <path d={path} fill="none" stroke="url(#gold)" strokeWidth="4" opacity={0.75+0.2*focus} strokeLinecap="round" strokeDasharray="610" strokeDashoffset={610*(1-growth)}/>
            <circle cx={tips[i][0]} cy={tips[i][1]} r={14+8*Math.sin(frame/24+i)**2} fill="#cdbd91" opacity={growth*0.7}/>
            <circle cx={tips[i][0]} cy={tips[i][1]} r={44+frame%74} stroke="#c5b389" strokeWidth="1" fill="none" opacity={growth*0.20*(1-frame%74/74)}/>
            <text x={tips[i][0]} y={tips[i][1]-74} textAnchor="middle" fontSize="36" letterSpacing="7" fill="#f3e9d2" opacity={growth * (i===2 ? 0.8+0.2*focus : 0.8*(1-focus))}>{labels[i]}</text>
          </g>
        ))}
        <circle cx="540" cy="1050" r="145" fill="url(#seed)" opacity={0.50+0.17*Math.sin(frame/35)}/>
        <circle cx="540" cy="1050" r={11+focus*9} fill="#f5e8c8"/>
        <circle cx="540" cy="1050" r={45+growth*32} fill="none" stroke="#d1bf95" strokeWidth="2" opacity={0.6}/>
        <g transform={`translate(${540+(860-540)*focus} ${1050+(880-1050)*focus})`} opacity={focus}>
          <circle r={54+Math.sin(frame/15)*4} fill="none" stroke="#f5dfad" strokeWidth="3"/>
          <circle r="28" fill="#cdb88c" opacity="0.13"/>
          <circle r="8" fill="#f8dfaa"/>
          <path d="M-75 0 H-120 M75 0 H120 M0 -75 V-120 M0 75 V120" stroke="#d4c7a5" strokeWidth="2" opacity="0.7"/>
        </g>
        <text x="540" y="277" textAnchor="middle" fill="#eee8d7" fontSize="66" letterSpacing="18" opacity={titleOpacity}>目的与行动</text>
        <text x="540" y="347" textAnchor="middle" fill="#9faca6" fontSize="26" letterSpacing="9" opacity={titleOpacity}>A QUESTION OF PURPOSE</text>
        <path d="M270 397 H810" stroke="#8b8d72" strokeWidth="1" opacity={titleOpacity*0.5}/>
        {subtitle && <g opacity={within(subtitleFade)}>
          <rect x="90" y="1614" width="900" height="170" rx="28" fill="#071014" opacity="0.92" stroke="#58645e" strokeWidth="1"/>
          <text x="540" y="1709" textAnchor="middle" fontSize="43" fill="#fff2d8" letterSpacing="1" fontWeight="500">{subtitle.text}</text>
          <path d="M415 1743 H665" stroke="#ae9b72" strokeWidth="2" opacity="0.58"/>
        </g>}
        <text x="540" y="1855" textAnchor="middle" fontSize="21" letterSpacing="8" fill="#717c79">VIDEO CREATION / CONCEPT DEMO</text>
      </svg>
    </AbsoluteFill>
  );
};
