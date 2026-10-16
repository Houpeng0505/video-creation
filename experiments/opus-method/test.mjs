import assert from 'node:assert/strict';
import {state,verify,R,ground} from './kinematics.mjs';
for(let f=0;f<=180;f++){const s=verify(f/30);
assert(Math.abs((s.rock.y-R)-ground(s.rock.x))<1e-8);
assert(Math.abs(Math.hypot(s.hand.x-s.rock.x,s.hand.y-s.rock.y)-R)<1e-8);}
assert(state(3).rockX>state(1).rockX);
assert(state(5).rockX<state(3.3).rockX);
assert(state(4).pushing===false);
console.log('PASS 181 exact geometric state constraints, rock motion and release cue');
