import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import {
  CaretDir,
  Coord,
  CoordAndDirHash,
  CoordHash,
  Dir,
  Grid,
  areCoordsEqual,
  convertCaretToDir,
  get90RotationRight,
  get90Rotations,
  getDimensions,
  getNextInDir,
  hashCoord,
  hashCoordAndDir,
  isOutOfBounds,
} from 'src/shared/grid';
import { trampoline } from 'src/shared/trampoline';

function getStartingCoordAndDir(
  rows: string[],
  numCols
): { startingPosition: Coord; dir: Dir } {
  const flattened = rows.join('');
  const matches = flattened.match(/(?<len>.+?)(?<dir>[>^v<])/);

  if (!matches) {
    throw new Error('Cannot find starting position');
  }

  const index = matches.groups.len.length;

  return {
    startingPosition: [Math.floor(index / numCols), index % numCols],
    dir: convertCaretToDir(matches.groups.dir as CaretDir),
  };
}

function traverseGrid(
  traversed: Set<CoordHash>,
  position: Coord,
  dir: Dir,
  dimensions: Coord,
  grid: Grid<string>
) {
  console.log({ position, dir });
  traversed.add(hashCoord(position));

  const nextCoord = getNextInDir(dir, position, grid);

  if (isOutOfBounds(nextCoord.coord, dimensions)) {
    // left the arena
    console.log(`OoB: ${nextCoord.coord} ${dimensions}`);
    return traversed.size;
  }

  if (nextCoord.val === '#') {
    // turn right due to blockage
    const newDir = get90RotationRight(dir);
    const nextCoordInNewDir = getNextInDir(newDir, position, grid);

    return traverseGrid(
      traversed,
      nextCoordInNewDir.coord,
      get90RotationRight(dir),
      dimensions,
      grid
    );
  }

  // proceed
  return traverseGrid(traversed, nextCoord.coord, dir, dimensions, grid);
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((r) => r.split(''));
  const [numRows, numCols] = getDimensions(grid);
  const { startingPosition, dir } = getStartingCoordAndDir(rows, numCols);

  const numDistinctSteps = traverseGrid(
    new Set<CoordHash>(),
    startingPosition,
    dir,
    [numRows, numCols],
    grid
  );
  console.log(numDistinctSteps);
}

function checkAllSquaresLaterally(
  position: Coord,
  dir: Dir,
  traversed: Set<CoordAndDirHash>,
  dimensions: Coord,
  grid: Grid<string>,
  newPillarCoord: Coord
) {
  // console.log('checkAllSquaresLaterally', position, dir);
  const nextPosition = getNextInDir(dir, position, grid);
  const rightDir = get90RotationRight(dir);

  const nextPositionCoord = nextPosition.coord;

  if (isOutOfBounds(nextPositionCoord, dimensions)) {
    // left the arena
    // console.log(`OoB: ${nextPositionCoord} ${dimensions}`);
    return false;
  }

  if (
    traversed.has(hashCoordAndDir(nextPositionCoord, dir)) ||
    ((nextPosition.val === '#' ||
      areCoordsEqual(nextPositionCoord, newPillarCoord)) &&
      traversed.has(hashCoordAndDir(position, rightDir)))
  ) {
    // console.log({ nextCoord, dir, position });
    return true;
  }

  traversed.add(hashCoordAndDir(position, dir));

  if (
    nextPosition.val === '#' ||
    areCoordsEqual(nextPositionCoord, newPillarCoord)
  ) {
    // turn right
    return () =>
      checkAllSquaresLaterally(
        position,
        rightDir,
        traversed,
        dimensions,
        grid,
        newPillarCoord
      );
  }

  // proceed
  return () =>
    checkAllSquaresLaterally(
      nextPositionCoord,
      dir,
      traversed,
      dimensions,
      grid,
      newPillarCoord
    );
}

type GrandResult = {
  traversed: Set<CoordAndDirHash>;
  pillarPlacements: Set<CoordHash>;
};

function traverseGridForNewObstacle(
  traversed: Set<CoordAndDirHash>,
  position: Coord,
  dir: Dir,
  dimensions: Coord,
  grid: Grid<string>,
  pillarPlacements: Set<CoordHash>
) {
  const nextPosition = getNextInDir(dir, position, grid);
  const nextCoord = nextPosition.coord;
  const rightDir = get90RotationRight(dir);
  // console.log('traverseGridForNewObstacle', { position, dir, nextPosition });

  if (isOutOfBounds(nextCoord, dimensions)) {
    // left the arena
    return { traversed, pillarPlacements };
  }

  traversed.add(hashCoordAndDir(position, dir));

  if (nextPosition.val === '#') {
    return () =>
      traverseGridForNewObstacle(
        traversed,
        position,
        rightDir,
        dimensions,
        grid,
        pillarPlacements
      );
  } else if (
    !traversed.has(hashCoordAndDir(nextCoord, 'U')) &&
    !traversed.has(hashCoordAndDir(nextCoord, 'D')) &&
    !traversed.has(hashCoordAndDir(nextCoord, 'L')) &&
    !traversed.has(hashCoordAndDir(nextCoord, 'R')) &&
    trampoline(
      checkAllSquaresLaterally(
        position,
        rightDir,
        new Set([...traversed]),
        dimensions,
        grid,
        nextCoord
      )
    )
  ) {
    // console.log({ position, rightDir, traversed });
    pillarPlacements.add(hashCoord(nextCoord));
  }

  // proceed
  return () =>
    traverseGridForNewObstacle(
      traversed,
      nextCoord,
      dir,
      dimensions,
      grid,
      pillarPlacements
    );
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const grid: Grid<string> = rows.map((r) => r.split(''));
  const [numRows, numCols] = getDimensions(grid);
  const { startingPosition, dir } = getStartingCoordAndDir(rows, numCols);

  const { traversed, pillarPlacements } = trampoline(() =>
    traverseGridForNewObstacle(
      new Set<CoordAndDirHash>(),
      startingPosition,
      dir,
      [numRows, numCols],
      grid,
      new Set<CoordHash>()
    )
  );
  console.log(pillarPlacements);
  console.log(pillarPlacements.difference(traversed).size);
}

run2().catch((err) => console.error(err));
