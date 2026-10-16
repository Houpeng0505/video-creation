import * as THREE from 'three';
import {gsap} from 'gsap';
import {R,ground,ease,verify} from './kinematics.mjs';
const canvas=document.getElementById('surface');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setSize(720,1280,false);renderer.setPixelRatio(1);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;
const stage=new THREE.Scene();stage.background=new THREE.Color(0x101426);stage.fog=new THREE.FogExp2(0x1a2033,.027);
const camera=new THREE.PerspectiveCamera(36,720/1280,.1,120);
stage.add(new THREE.HemisphereLight(0xe8dcce,0x1c2840,2.1));
const key=new THREE.DirectionalLight(0xffc69a,4.8);key.position.set(4,9,6);stage.add(key);
const edge=new THREE.DirectionalLight(0x7897cc,2.3);edge.position.set(-6,6,-4);stage.add(edge);
const groundGroup=new THREE.Group();
groundGroup.position.y=ground(0);groundGroup.rotation.z=Math.atan(.27);
const plane=new THREE.Mesh(new THREE.PlaneGeometry(100,40),new THREE.MeshStandardMaterial({color:0x38343c,roughness:1,side:THREE.DoubleSide}));
plane.rotation.x=-Math.PI/2;groundGroup.add(plane);stage.add(groundGroup);
const hash=n=>{const f=Math.sin(n*17.71+13.2)*43453.77;return f-Math.floor(f)};
const pebbleMat=new THREE.MeshStandardMaterial({color:0x77706b,roughness:1,flatShading:true});
for(let i=0;i<90;i++){const x=(hash(i+1)-.5)*30,z=(hash(i+199)-.5)*18;const r=.02+hash(i+99)*.07;
 const m=new THREE.Mesh(new THREE.DodecahedronGeometry(r,0),pebbleMat);
 m.position.set(x,ground(x)+r*.21,z);stage.add(m);}
function mountains(z,col,seed){
 const pts=[];for(let i=0;i<=24;i++)pts.push(new THREE.Vector3(-47+i*4,-2+hash(seed+i)*3.7,z));
 const arr=[];for(let i=0;i<24;i++){const a=pts[i],b=pts[i+1];arr.push(a.x,-30,z,a.x,a.y,z,b.x,b.y,z,a.x,-30,z,b.x,b.y,z,b.x,-30,z);}
 const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));geom.computeVertexNormals();
 stage.add(new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide})));
}
mountains(-35,0x33374b,11);mountains(-25,0x2d3042,42);
const rock=new THREE.Group();stage.add(rock);
const geom=new THREE.IcosahedronGeometry(R,2);
const pos=geom.attributes.position;for(let i=0;i<pos.count;i++){const p=new THREE.Vector3().fromBufferAttribute(pos,i);p.multiplyScalar(1+.05*Math.sin(p.x*11+p.y*7+p.z*3));pos.setXYZ(i,p.x,p.y,p.z);}geom.computeVertexNormals();
rock.add(new THREE.Mesh(geom,new THREE.MeshStandardMaterial({color:0x8c8178,roughness:.96,flatShading:true})));
rock.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom,20),new THREE.LineBasicMaterial({color:0x242631,transparent:true,opacity:.25})));
const skin=new THREE.MeshStandardMaterial({color:0x9b6859,roughness:1}),cloth=new THREE.MeshStandardMaterial({color:0x604646,roughness:1});
const hero=new THREE.Group();stage.add(hero);
function ball(mat,scale){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),mat);mesh.scale.set(...scale);hero.add(mesh);return mesh;}
const hip=ball(cloth,[.54,.34,.42]),chest=ball(skin,[.42,.74,.39]),head=ball(skin,[.38,.44,.37]);
const hair=ball(new THREE.MeshStandardMaterial({color:0x252027}),[.38,.2,.38]);
const sandals=[ball(cloth,[.34,.10,.20]),ball(cloth,[.34,.10,.20])];
const bones=[];function limb(mat){const m=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,12),mat);hero.add(m);return m;}
for(let i=0;i<8;i++)bones.push(limb(skin));
const hands=[ball(skin,[.16,.13,.13]),ball(skin,[.16,.13,.13])];
const upAxis=new THREE.Vector3(0,1,0);
function fit(mesh,a,b,r){const d=b.clone().sub(a);mesh.position.copy(a).addScaledVector(d,.5);mesh.quaternion.setFromUnitVectors(upAxis,d.clone().normalize());mesh.scale.set(r,d.length(),r);}
const particles=[];const dustMaterial=new THREE.MeshStandardMaterial({color:0xe0b58e,roughness:1,transparent:true,opacity:.34});
for(let i=0;i<32;i++){const p=new THREE.Mesh(new THREE.TetrahedronGeometry(.025+hash(i+521)*.06),dustMaterial.clone());stage.add(p);particles.push(p);}
function draw(t){
 const s=verify(t);rock.position.set(s.rock.x,s.rock.y,0);rock.rotation.z=s.rockRotation;
 const y=ground(s.heroX);hip.position.set(s.heroX-.05,y+1.24,0);
 chest.position.set(s.heroX+.07,y+2.08,0);chest.rotation.z=-.27;
 head.position.set(s.heroX-.16,y+2.88,0);hair.position.set(s.heroX-.20,y+3.16,0);
 for(let j=0;j<2;j++){
  const z=j===0?-.33:.35,foot=s.feet[j];
  const atFoot=new THREE.Vector3(foot.x,foot.y,z),atHip=new THREE.Vector3(s.heroX-.05,y+1.24,z);
  const knee=atFoot.clone().lerp(atHip,.5).add(new THREE.Vector3(j===0?-.37:.36,.15,0));
  fit(bones[j*2],atHip,knee,.19);fit(bones[j*2+1],knee,atFoot,.15);
  sandals[j].position.set(foot.x+.15,foot.y,foot.z);
  const shoulder=new THREE.Vector3(s.heroX+.25,y+2.39,z);
  const wrist=s.pushing?new THREE.Vector3(s.hand.x,s.hand.y,z):shoulder.clone().add(new THREE.Vector3(.2,-1.05,0));
  const elbow=shoulder.clone().lerp(wrist,.51).add(new THREE.Vector3(-.14,-.2,0));
  fit(bones[4+j*2],shoulder,elbow,.17);fit(bones[5+j*2],elbow,wrist,.13);hands[j].position.copy(wrist);
 }
 for(let i=0;i<particles.length;i++){
  const a=hash(i+3)*Math.PI*2,speed=hash(i+53),life=Math.max(0,(t-3.2)/2.8);
  particles[i].visible=t>3.2;particles[i].position.set(s.rock.x+Math.cos(a)*(.2+speed)-life*(.4+speed),ground(s.rock.x)+.08+life*(.08+speed*.7),Math.sin(a)*(.4+life));
 }
 const center=(s.rockX+s.heroX)*.5;
 camera.position.set(center+1.8,3.55,15.0-.9*ease(t/3.25));
 camera.lookAt(center,.3,0);
 key.intensity=4.8+1.2*ease((t-3.25)/2.75);
 document.getElementById('cue').textContent=s.pushing?'EFFORT · 00:00':'RELEASE · 00:04';
 renderer.render(stage,camera);
}
const playhead={t:0};
const tl=gsap.timeline({paused:true});
tl.to(playhead,{t:6,duration:6,ease:'none',onUpdate:()=>draw(playhead.t)},0);
window.__timelines={opusExperiment:tl};
window.renderAt=draw;window.getState=verify;
draw(0);
