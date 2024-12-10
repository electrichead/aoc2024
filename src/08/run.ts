import { sum } from 'lodash-es';
import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import {
  Coord,
  Grid,
  getDimensions,
  hashCoord,
  isOutOfBounds,
} from 'src/shared/grid';

function getSignalMap(grid: Grid<string>) {
  const signalMap = new Map<string, Coord[]>();

  grid.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col !== '.') {
        const val = grid[rowIndex][colIndex];
        if (!signalMap.has(val)) {
          signalMap.set(val, []);
        }

        signalMap.get(val).push([rowIndex, colIndex]);
      }
    });
  });

  return signalMap;
}

function getAntenna(l: Coord, r: Coord) {
  const rowDiff = l[0] - r[0];
  const colDiff = l[1] - r[1];

  const antenna: Coord = [r[0] - rowDiff, r[1] - colDiff];
  return antenna;
}

function getAntennas(l: Coord, r: Coord, dimensions: Coord) {
  const antenna1 = getAntenna(l, r);
  const antenna2 = getAntenna(r, l);

  return [antenna1, antenna2].filter((a) => !isOutOfBounds(a, dimensions));
}

function continuallyGetAntennasInDir(l: Coord, r: Coord, dimensions: Coord) {
  let prev = l;
  let curr = r;

  const newAntennas = [l];

  while (!isOutOfBounds(curr, dimensions)) {
    newAntennas.push(curr);
    const newAntenna = getAntenna(prev, curr);
    prev = curr;
    curr = newAntenna;
  }

  return newAntennas;
}

function getAntennasContinuously(l: Coord, r: Coord, dimensions: Coord) {
  const antenna1 = continuallyGetAntennasInDir(l, r, dimensions);
  const antenna2 = continuallyGetAntennasInDir(r, l, dimensions);

  return [l, r].concat(antenna1, antenna2);
}

function permute(
  coords: Coord[],
  dimensions: Coord,
  iterator: (l: Coord, r: Coord, dimensions: Coord) => Coord[]
) {
  const antennas: Coord[] = [];

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const left = coords[i];
      const right = coords[j];
      const antennasForCoord = iterator(left, right, dimensions);

      Array.prototype.push.apply(antennas, antennasForCoord);
    }
  }

  return antennas;
}

function renderGrid(grid: Grid<string>, antennas: Coord[]) {
  const gridCopy = structuredClone(grid);
  antennas.forEach((a) => {
    const val = gridCopy[a[0]][a[1]];

    if (val === '.' || val === '#') {
      gridCopy[a[0]][a[1]] = '#';
    }
  });
  console.log(gridCopy.map((row) => row.join('')).join('\n'));
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((row) => row.split(''));
  const dimensions = getDimensions(grid);

  const signalMap = getSignalMap(grid);

  const antennas = [...signalMap.values()].map((coords) =>
    permute(coords, dimensions, getAntennas)
  );

  renderGrid(grid, antennas.flat());

  const hashedCoords = new Set(antennas.flat().map((a) => hashCoord(a)));

  console.log(hashedCoords.size);

  // 265
  /*
.....8............1r..#.#a....................O...
.a.........#....4..q.....#...................0...9
....a.........8.#....#............................
.......#.........D.....#...............V0....#....
....#d#..#.........#...#...#......................
.r..........q.......#..............##............O
..................q.#......#.....#........#...9#..
......#.......D......#..#...#X...........#......V.
...#....D#.........#.....X......#.........#0....#.
..#..#...8#.......#..#X.............##..#..#.#....
...................#J...............#....9##0....#
..a..B....##...#.#r#.W........J..#.........#..R..Q
..#...WD...q..#..1..#.......Q..........##..R.#V...
.1W....#...#..##......u.................#.....##..
................#.............u.....#.......R..#..
....B...........#..d..c...............##.R........
....#.#......J..............X.#.......#..V...#....
#.....1...........................3#......#.#..##.
....#.B......#....d............#......3#.......#..
...#......#.8..J.#.....u.....3...##.#.....##......
#....#.....4........#....6..........#........#...#
...#.4v.#..#.....#..d...#...#...............O.....
......#..........#........v.2....#............#...
...#............#......#.....#....#..........s#...
................#.4...M.#W.....#............s.....
.....#.#..............m.#..#.....##.....#..#......
...#.......M..#..................#................
#.b..#..............#c.#.......#........#.....#...
#.........#.........Co.#.#.....#KQ.......O.s......
#..............##C.....#...#.#.....#...#...#..s...
.......x#.....#.#...c....#........##.........#...3
........o......A.#..U#....Q.........5.#.........#.
...............U............#..#..j...5...#...#...
.....K....#..U.....#..........j.......#.#2........
.......A.v.#...w...#......#..........c.#.5......#.
..K...#..#.......................#....#j.......##.
...#......#....K.yk....B.............2#.....#.....
......C....b.#............x###........Y#......#.#.
.....mA.#C......U..#.........#.....#........#.....
......#.M...#.A....##....#.......#..2..6...5......
......................#......7.......Y............
.m.M......w.#v....................................
.....#....#.m...........x.....Y....#..#...#.......
...........#....#..#k..#.w..........#.............
......b.#...w..S.#..7#.#..............#......#....
..#.........#.S..##....#.....x.#........#Y........
.............#.....#S...6.......................#.
.y.......#..###..S..#.#...#.7.6.................9.
o....#.....k..#..#.......#.b......#.#.............
yo...........k......#.............................
*/
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((row) => row.split(''));
  const dimensions = getDimensions(grid);

  const signalMap = getSignalMap(grid);

  const antennas = [...signalMap.values()].map((coords) =>
    permute(coords, dimensions, getAntennasContinuously)
  );

  renderGrid(grid, antennas.flat());

  const hashedCoords = new Set(antennas.flat().map((a) => hashCoord(a)));

  console.log(hashedCoords.size);
}

run2().catch((err) => console.error(err));
