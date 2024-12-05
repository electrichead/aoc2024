import { Coord, Dir, Grid } from './types';

export function getNextInDir<T>(
  dir: Dir,
  curr: Coord,
  grid: Grid<T>
): { coord: Coord; dir: Dir; val: T } {
  const [currRow, currCol] = curr;
  switch (dir) {
    case 'U':
      return {
        dir,
        coord: [currRow - 1, currCol],
        val: grid[currRow - 1]?.[currCol],
      };
    case 'D':
      return {
        dir,
        coord: [currRow + 1, currCol],
        val: grid[currRow + 1]?.[currCol],
      };
    case 'L':
      return {
        dir,
        coord: [currRow, currCol - 1],
        val: grid[currRow]?.[currCol - 1],
      };
    case 'R':
      return {
        dir,
        coord: [currRow, currCol + 1],
        val: grid[currRow]?.[currCol + 1],
      };
    case 'UL':
      return {
        dir,
        coord: [currRow - 1, currCol - 1],
        val: grid[currRow - 1]?.[currCol - 1],
      };
    case 'UR':
      return {
        dir,
        coord: [currRow - 1, currCol + 1],
        val: grid[currRow - 1]?.[currCol + 1],
      };
    case 'DL':
      return {
        dir,
        coord: [currRow + 1, currCol - 1],
        val: grid[currRow + 1]?.[currCol - 1],
      };
    case 'DR':
      return {
        dir,
        coord: [currRow + 1, currCol + 1],
        val: grid[currRow + 1]?.[currCol + 1],
      };
  }
}
