export type Coord = [number, number];
export type Grid<T> = T[][];
export type Dir = 'U' | 'D' | 'L' | 'R' | 'UL' | 'UR' | 'DL' | 'DR';

export const allDirections: Dir[] = [
  'U',
  'D',
  'L',
  'R',
  'UL',
  'UR',
  'DL',
  'DR',
];
