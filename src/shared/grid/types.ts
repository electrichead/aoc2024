export type Grid<T> = T[][];
export type HorizontalDir = 'U' | 'D' | 'L' | 'R';
export type Dir = HorizontalDir | 'UL' | 'UR' | 'DL' | 'DR';
export type CaretDir = '^' | '>' | 'v' | '<';

export const fourDirections: Dir[] = ['U', 'R', 'D', 'L'];
export const allDirections: Dir[] = [...fourDirections, 'UL', 'UR', 'DL', 'DR'];
