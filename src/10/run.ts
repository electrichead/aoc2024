import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import { Coord, Grid, getCoordFromIndex, getDimensions } from 'src/shared/grid';

function getNines(grid: Grid<number>, dimensions: Coord) {
  const flatGrid = grid.flat();
  return flatGrid.reduce<Coord[]>((memo, item, i) => {
    if (item === 9) {
      memo.push(getCoordFromIndex(i, dimensions));
    }
    return memo;
  }, []);
}

function traverseFrom9() {}

async function run() {
  const rows = getFile(resolve(__dirname, './sample.txt'));
  const grid: Grid<number> = rows.map((row) => row.split('').map((a) => +a));
  const dimensions = getDimensions(grid);
  const nines = getNines(grid, dimensions);
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample.txt'));
}

run().catch((err) => console.error(err));
