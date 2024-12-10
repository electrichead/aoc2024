import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';

function checkTotal(total: number, accum: number, values: number[]): boolean {
  if (values.length === 0 && accum === total) {
    return true;
  }

  if (accum > total || values.length === 0) {
    return false;
  }

  const [head, ...rest] = values;
  return (
    checkTotal(total, accum + head, rest) ||
    checkTotal(total, accum * head, rest)
  );
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const res = rows.reduce((memo, row) => {
    const [total, values] = row.split(': ');
    const [head, ...rest] = values.split(' ').map((a) => +a);

    if (checkTotal(+total, head, rest)) {
      return memo + +total;
    }

    return memo;
  }, 0);

  console.log(res);
}

function checkTotalPt2(
  total: number,
  accum: number,
  prev: number,
  values: number[]
): boolean {
  if (values.length === 0 && accum === total) {
    return true;
  }

  if (accum > total || values.length === 0) {
    return false;
  }

  const [head, ...rest] = values;
  return (
    checkTotalPt2(total, accum + head, head, rest) ||
    checkTotalPt2(total, accum * head, head, rest) ||
    checkTotalPt2(total, +`${accum}${head}`, head, rest)
  );
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const res = rows.reduce((memo, row) => {
    const [total, values] = row.split(': ');
    const [head, ...rest] = values.split(' ').map((a) => +a);

    if (checkTotalPt2(+total, head, head, rest)) {
      return memo + +total;
    }

    return memo;
  }, 0);

  console.log(res);
}

run2().catch((err) => console.error(err));
