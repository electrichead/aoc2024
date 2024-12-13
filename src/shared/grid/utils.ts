import { Coord } from './coord';

export function rawToCoord(raw: number[]): Coord {
  return [raw[0], raw[1]];
}
