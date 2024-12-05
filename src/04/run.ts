import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import {
  Coord,
  Grid,
  allDirections,
  getDimensions,
  getNextInDir,
  rawToCoord,
} from 'src/shared/grid';

function travelOut<T>(coord: Coord, grid: Grid<T>): number {
  let curr = coord;

  return allDirections
    .map((dir) => getNextInDir(dir, curr, grid))
    .filter((next) => next.val === 'M')
    .filter((positiveDir) => {
      let nextA = getNextInDir(positiveDir.dir, positiveDir.coord, grid);

      if (!nextA) {
        return false;
      }

      return (
        nextA.val === 'A' &&
        getNextInDir(nextA.dir, nextA.coord, grid)?.val === 'S'
      );
    }).length;
}

function findAllIndexes(str: string, search: string) {
  const indexes = [];
  let curr = 0;
  let found = str.indexOf(search, curr);

  while (found !== -1) {
    indexes.push(found);
    found = str.indexOf(search, found + 1);
  }

  return indexes;
}

function isXmas<T>(coord: Coord, grid: Grid<T>) {
  const ul = getNextInDir('UL', coord, grid)?.val;
  const ur = getNextInDir('UR', coord, grid)?.val;
  const dl = getNextInDir('DL', coord, grid)?.val;
  const dr = getNextInDir('DR', coord, grid)?.val;

  return (
    (ul === 'M' && dr === 'S' && dl === 'M' && ur === 'S') ||
    (ul === 'M' && dr === 'S' && ur === 'M' && dl === 'S') ||
    (ul === 'S' && dr === 'M' && dl === 'S' && ur === 'M') ||
    (ul === 'S' && dr === 'M' && ur === 'S' && dl === 'M')
  );
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((row) => row.split(''));
  const [dimRows] = getDimensions(grid);

  const Xs = findAllIndexes(rows.join(''), 'X').map((x) =>
    rawToCoord([Math.floor(x / dimRows), x % dimRows])
  );

  const results = Xs.reduce((memo, xCoord) => {
    return memo + travelOut(xCoord, grid);
  }, 0);

  console.log(`${results} results for XMAS`);
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((row) => row.split(''));
  const [dimRows] = getDimensions(grid);

  const As = findAllIndexes(rows.join(''), 'A').map((x) =>
    rawToCoord([Math.floor(x / dimRows), x % dimRows])
  );

  const results = As.reduce((memo, aCoord) => {
    return memo + (isXmas(aCoord, grid) ? 1 : 0);
  }, 0);

  console.log(`${results} results for X-MAS`);
}

run2().catch((err) => console.error(err));
