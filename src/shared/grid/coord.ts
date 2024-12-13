import { Dir } from './types';

export type Coord = [number, number]; // Row, Col
export type CoordHash = `${number},${number}`;
export type CoordAndDirHash = `${number},${number}:${Dir}`;

export type CoordWithVal<T> = { coord: Coord; val: T };

export function hashCoord(position: Coord): CoordHash {
  return `${position[0]},${position[1]}`;
}

export function unhashCoord(hash: CoordHash): Coord {
  const [row, col] = hash.split(',');
  return [+row, +col];
}

export function hashCoordAndDir(position: Coord, dir: Dir): CoordAndDirHash {
  return `${position[0]},${position[1]}:${dir}`;
}

export function areCoordsEqual(a: Coord, b: Coord) {
  return a[0] === b[0] && a[1] === b[1];
}

export function getCoordFromIndex(i: number, [dimRows, dimCols]: Coord): Coord {
  return [Math.floor(i / dimRows), i % dimRows];
}
