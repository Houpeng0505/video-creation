import React from 'react';
import {Composition} from 'remotion';
import {ScienceFilm} from './ScienceFilm';
import film from '../content/film.json';

export const Root: React.FC = () => (
  <Composition
    id="ScienceFilm"
    component={ScienceFilm}
    fps={30}
    width={720}
    height={1280}
    durationInFrames={Math.round(film.durationSeconds * 30)}
  />
);
