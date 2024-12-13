import { intersection, sum } from 'lodash-es';
import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import {
  Coord,
  CoordHash,
  CoordWithVal,
  Dir,
  Grid,
  flipDir,
  fourDirections,
  get90RotationRight,
  get90Rotations,
  getDimensions,
  getNextCoordValInDir,
  getNextInDir,
  hashCoord,
  hashCoordAndDir,
  isOutOfBounds,
} from 'src/shared/grid';
import { trampoline } from 'src/shared/trampoline';

type RegionDetails = {
  regionMembers: Map<CoordHash, Dir[]>;
  visited: Set<CoordHash>;
};

function expandRegion(
  val: string,
  toExplore: CoordWithVal<string>[],
  regionMembers: Map<CoordHash, Dir[]>,
  seenRegions: Set<string>,
  visited: Set<CoordHash>,
  grid: Grid<string>,
  dimensions: Coord
) {
  if (toExplore.length === 0) {
    // console.log(`Done ${val}`, regionMembers, '\n\n');
    seenRegions.add(val);

    return {
      regionMembers,
      visited,
    };
  }

  const [curr, ...rest] = toExplore;

  if (visited.has(hashCoord(curr.coord))) {
    // console.log({ coord: curr.coord, visited });
    return null;
  }

  const neighbors = fourDirections.map((dir) => getNextInDir(dir, curr.coord, grid));

  const unvisitedNeighbors = neighbors.filter(
    (next) =>
      !isOutOfBounds(next.coord, dimensions) &&
      !visited.has(hashCoord(next.coord)) &&
      next.val === curr.val
  );

  const differentNeighbors = neighbors.filter(
    (next) => isOutOfBounds(next.coord, dimensions) || next.val !== curr.val
  );
  // console.log(JSON.stringify({ curr, regionMembers, unvisitedNeighbors, differentNeighbors }));
  const currCoordHash = hashCoord(curr.coord);

  regionMembers.set(
    currCoordHash,
    differentNeighbors.map((n) => n.dir)
  );
  visited.add(currCoordHash);

  return () =>
    expandRegion(
      val,
      rest.concat(unvisitedNeighbors).filter((a) => !visited.has(hashCoord(a.coord))),
      regionMembers,
      seenRegions,
      visited,
      grid,
      dimensions
    );
}

function rowByRow(grid: Grid<string>, dimensions: Coord) {
  let total: Map<CoordHash, Dir[]>[] = [];
  const visited = new Set<CoordHash>();
  const seenRegions = new Set<string>();

  for (let row = 0; row < dimensions[0]; row++) {
    for (let col = 0; col < dimensions[0]; col++) {
      const curr = { coord: [row, col] as Coord, val: grid[row][col] };
      const res = trampoline<RegionDetails | null>(() =>
        expandRegion(
          curr.val,
          [curr],
          new Map<CoordHash, Dir[]>(),
          seenRegions,
          visited,
          grid,
          dimensions
        )
      );
      // console.log({ cost });
      if (res !== null) {
        total.push(res.regionMembers);
      }
    }
  }

  return total;
}

function getCorners(squares: { coord: Coord; dir: Dir }[], grid: Grid<string>) {
  const squaresHash = squares.map((sq) => hashCoordAndDir(sq.coord, sq.dir));

  return (
    sum(
      squares.map((square) => {
        const myVal = grid[square.coord[0]][square.coord[1]];
        const [myL, myR] = get90Rotations(square.dir);

        const myLSq = getNextInDir(myL, square.coord, grid);
        const myRSq = getNextInDir(myR, square.coord, grid);

        const myLSqRightDir = get90RotationRight(myL);
        const myLRightSq = getNextInDir(myLSqRightDir, myLSq.coord, grid);

        const [myRSqLeftDir] = get90Rotations(myR);
        const myRLeftSq = getNextInDir(myRSqLeftDir, myRSq.coord, grid);

        const myLRightSqWall = get90RotationRight(myLSqRightDir);
        const [myRLeftSqWall] = get90Rotations(myRSqLeftDir);

        const possibilities = [
          hashCoordAndDir(square.coord, myL),
          hashCoordAndDir(square.coord, myR),
        ];
        if (myLRightSq.val === myVal && myLSq.val === myVal) {
          possibilities.push(hashCoordAndDir(myLRightSq.coord, myLRightSqWall));
        }

        if (myRSq.val === myVal && myRLeftSq.val === myVal) {
          possibilities.push(hashCoordAndDir(myRLeftSq.coord, myRLeftSqWall));
        }

        return intersection(squaresHash, possibilities).length;
      })
    ) / 2
  );
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((row) => row.split(''));
  const dimensions = getDimensions(grid);
  const total = rowByRow(grid, dimensions);
  console.log(total);
  const totalCost = sum(total.map((t) => t.size * [...t.values()].flat().length));

  console.log(totalCost);
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((row) => row.split(''));
  const dimensions = getDimensions(grid);
  const total = rowByRow(grid, dimensions);

  const coordDirs = total.map((region) => {
    const coordDirsOfRegion = [...region.entries()]
      .map(([coordHash, dirs]) => {
        return dirs.map((dir) => ({
          coord: coordHash.split(',').map((a) => +a) as Coord,
          dir,
        }));
      })
      .flat();

    return region.size * getCorners(coordDirsOfRegion, grid);
  });

  console.log(sum(coordDirs));

  // const totalCost = sum(total.map((t) => t.size * [...t.values()].flat().length));

  // console.log(totalCost);
}

run2().catch((err) => console.error(err));
