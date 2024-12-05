import { Coord, Grid } from './types';

export function getDimensions<T>(grid: Grid<T>): Coord {
  return [grid.length, grid[0].length];
}
