import { Coord } from './coord';
import { Grid } from './types';

export function getDimensions<T>(grid: Grid<T>): Coord {
  return [grid.length, grid[0].length];
}

export function isOutOfBounds(position: Coord, dimensions: Coord) {
  return (
    position[0] < 0 ||
    position[0] >= dimensions[0] ||
    position[1] < 0 ||
    position[1] >= dimensions[1]
  );
}
