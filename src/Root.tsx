import React from 'react';
import {Composition} from 'remotion';
import {ScienceFilm} from './ScienceFilm';
import {SisyphusFilm} from './SisyphusFilm';
import {SisyphusV2} from './SisyphusV2';
import {SisyphusV3} from './SisyphusV3';
import {SisyphusV4} from './SisyphusV4';
import film from '../content/film.json';
import sisyphus from '../content/sisyphus.json';
import v2 from '../content/sisyphus_v2.json';
import v3 from '../content/sisyphus_v3.json';
export const Root:React.FC=()=><>
  <Composition id="ScienceFilm" component={ScienceFilm} fps={30} width={720} height={1280}
    durationInFrames={Math.round(film.durationSeconds*30)}/>
  <Composition id="Sisyphus" component={SisyphusFilm} fps={30} width={720} height={1280}
    durationInFrames={Math.round(sisyphus.durationSeconds*30)}/>
  <Composition id="SisyphusV2" component={SisyphusV2} fps={30} width={720} height={1280}
    durationInFrames={Math.round(v2.durationSeconds*30)}/>
  <Composition id="SisyphusV3" component={SisyphusV3} fps={30} width={720} height={1280}
    durationInFrames={Math.round(v3.durationSeconds*30)}/>
  <Composition id="SisyphusV4" component={SisyphusV4} fps={30} width={720} height={1280}
    durationInFrames={2700}/>
</>;
