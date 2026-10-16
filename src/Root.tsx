import React from 'react';
import {Composition} from 'remotion';
import {ScienceFilm} from './ScienceFilm';
import {SisyphusFilm} from './SisyphusFilm';
import film from '../content/film.json';
import sisyphus from '../content/sisyphus.json';
export const Root:React.FC=()=><>
  <Composition id="ScienceFilm" component={ScienceFilm} fps={30} width={720} height={1280}
    durationInFrames={Math.round(film.durationSeconds*30)}/>
  <Composition id="Sisyphus" component={SisyphusFilm} fps={30} width={720} height={1280}
    durationInFrames={Math.round(sisyphus.durationSeconds*30)}/>
</>;
