import { groupBy, mapValues, sum, uniq, values } from 'lodash-es';
import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import {
  Coord,
  Dir,
  Grid,
  getCoordFromIndex,
  getDimensions,
  getNextCoordValInDir,
  hashCoord,
} from 'src/shared/grid';
import { trampoline } from 'src/shared/trampoline';

function findAllInGrid(
  predicate: (item: number) => boolean,
  grid: Grid<number>,
  dimensions: Coord
) {
  const flatGrid = grid.flat();
  return flatGrid.reduce<Coord[]>((memo, item, i) => {
    if (predicate(item)) {
      memo.push(getCoordFromIndex(i, dimensions));
    }
    return memo;
  }, []);
}
const dirs: Dir[] = ['U', 'R', 'D', 'L'];

function traverseDescending(
  toExplore: { coord: Coord; val: number }[],
  accum: Coord[],
  grid: Grid<number>
) {
  // console.log(toExplore, accum);
  if (toExplore.length === 0) {
    return accum;
  }

  const [curr, ...rest] = toExplore;

  if (curr.val === 0) {
    return () => traverseDescending(rest, [...accum, curr.coord], grid);
  }

  const possibilities = dirs
    .map((dir) => getNextCoordValInDir(dir, curr.coord, grid))
    .filter((nextSquare) => nextSquare.val === curr.val - 1);

  if (possibilities.length === 0) {
    return () => traverseDescending(rest, accum, grid);
  }

  return () => traverseDescending([...rest, ...possibilities], accum, grid);
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<number> = rows.map((row) => row.split('').map((a) => +a));
  const dimensions = getDimensions(grid);
  const nines = findAllInGrid((item) => item === 9, grid, dimensions);
  const ninesToZeroes = nines
    .map((coord) => ({ coord, val: 9 }))
    .map((nine) => {
      const allZeroes = trampoline(() =>
        traverseDescending([nine], [], grid)
      ).map((coord) => hashCoord(coord));

      return {
        nine: hashCoord(nine.coord),
        zeroes: uniq(allZeroes),
      };
    });

  const res = ninesToZeroes.reduce((memo, { nine, zeroes }) => {
    zeroes.forEach((zeroCoord) => {
      if (!memo[zeroCoord]) {
        memo[zeroCoord] = 0;
      }
      memo[zeroCoord]++;
    });
    return memo;
  }, {});

  console.log(sum(values(res)));
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<number> = rows.map((row) => row.split('').map((a) => +a));

  const dimensions = getDimensions(grid);
  const nines = findAllInGrid((item) => item === 9, grid, dimensions);
  const ninesToZeroes = nines
    .map((coord) => ({ coord, val: 9 }))
    .map((nine) => {
      const allZeroes = trampoline(() =>
        traverseDescending([nine], [], grid)
      ).map((coord) => hashCoord(coord));

      return {
        nine: hashCoord(nine.coord),
        zeroes: allZeroes,
      };
    });

  // console.log(ninesToZeroes);
  console.log(ninesToZeroes.map((a) => a.zeroes).flat().length);
}

run2().catch((err) => console.error(err));
