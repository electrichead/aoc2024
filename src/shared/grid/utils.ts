import { Coord } from './types';

export function rawToCoord(raw: number[]): Coord {
  return [raw[0], raw[1]];
}
