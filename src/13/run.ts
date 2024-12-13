import { sum } from 'lodash-es';
import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import { Coord } from 'src/shared/grid';

type Machine = {
  b1: Coord;
  b2: Coord;
  win: Coord;
};

function parseRows(rows: string[]) {
  const res: Machine[] = [];

  for (let i = 0; i < rows.length; i += 4) {
    const str = [rows[i], rows[i + 1], rows[i + 2]].join('');
    const parsed =
      /X\+(?<x1>[0-9]+), Y\+(?<y1>[0-9]+).+?X\+(?<x2>[0-9]+), Y\+(?<y2>[0-9]+).+?X=(?<winX>[0-9]+), Y=(?<winY>[0-9]+)/.exec(
        str
      );

    if (
      !parsed?.groups ||
      !parsed.groups.x1 ||
      !parsed.groups.y1 ||
      !parsed.groups.x2 ||
      !parsed.groups.y2 ||
      !parsed.groups.winX ||
      !parsed.groups.winY
    ) {
      throw new Error('Parsing issue');
    }

    const b1: Coord = [+parsed.groups.x1, +parsed.groups.y1];
    const b2: Coord = [+parsed.groups.x2, +parsed.groups.y2];
    const win: Coord = [+parsed.groups.winX, +parsed.groups.winY];

    res.push({ b1, b2, win });
  }

  return res;
}

function simEq(machine: Machine) {
  const y =
    (machine.b1[0] * machine.win[1] - machine.b1[1] * machine.win[0]) /
    (machine.b1[0] * machine.b2[1] - machine.b1[1] * machine.b2[0]);

  const x = (machine.win[0] - machine.b2[0] * y) / machine.b1[0];
  return [x, y];
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const games = parseRows(rows);

  const res = games
    .map((game) => {
      const [b1, b2] = simEq(game);

      return [b1, b2];
    })
    .filter(([b1, b2]) => b1 % 1 === 0 && b2 % 1 === 0 && b1 < 101 && b2 < 100);

  const tokens = res.map(([b1, b2]) => b1 * 3 + b2);
  console.log(tokens);
  console.log(sum(tokens));
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));

  const games = parseRows(rows).map((game) => ({
    ...game,
    win: [game.win[0] + 10_000_000_000_000, game.win[1] + 10_000_000_000_000] as Coord,
  }));

  // console.log(games);

  const res = games
    .map((game) => {
      const [b1, b2] = simEq(game);

      return [b1, b2];
    })
    .filter(([b1, b2]) => b1 % 1 === 0 && b2 % 1 === 0);

  const tokens = res.map(([b1, b2]) => b1 * 3 + b2);

  // console.log(tokens);
  console.log(sum(tokens));
}

run2().catch((err) => console.error(err));
