import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import chalk from 'chalk';
import { sum } from 'lodash-es';

function getTotal(str: string) {
  const muls = str.match(/mul\([0-9]+,[0-9]+\)/g);
  if (!muls) {
    return 0;
  }
  console.log('in', muls, muls.length);

  const products = muls.map((r) => {
    const [left, right] = r.match(/[0-9]+/g) || [];
    if (!left || !right) {
      return 0;
    }
    return +left * +right;
  });

  return sum(products);
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample.txt'));
  const res = sum(rows.map((row) => getTotal(row)));
  console.log(res);
}

async function run2() {
  const str =
    'do()' + getFile(resolve(__dirname, './sample.txt')).join('') + "don't()";

  const dos = str.match(/do\(\)(.+?)don't\(\)/g);
  console.log(dos, dos.length);

  const res = sum(dos.map((capture) => getTotal(capture)));
  console.log(res);
}

run2()
  .then((val) => {
    console.log(val);
  })
  .catch((err) => console.error(err));
