import { CaretDir, Coord, Dir, Grid } from './types';

const caretDirConversionMap: Record<CaretDir, Dir> = {
  '^': 'U',
  '>': 'R',
  v: 'D',
  '<': 'L',
};

export function convertCaretToDir(caretDir: CaretDir): Dir {
  return caretDirConversionMap[caretDir];
}

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

export function get90RotationRight(dir: Dir): Dir {
  switch (dir) {
    case 'U':
      return 'R';
    case 'R':
      return 'D';
    case 'D':
      return 'L';
    case 'L':
      return 'U';
  }
}

export function get90Rotations(dir: Dir): Dir[] {
  switch (dir) {
    case 'U':
      return ['R', 'L'];
    case 'R':
      return ['U', 'D'];
    case 'D':
      return ['L', 'R'];
    case 'L':
      return ['U', 'D'];
  }
}
