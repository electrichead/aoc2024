import { getFile } from 'src/shared/extract-data';
import { resolve } from 'node:path';
import { zip, groupBy } from 'lodash-es';

async function run() {
  const contents = getFile(resolve(__dirname, './sample2.txt'));
  const arr = contents.map((c) => c.split('   '));
  const left = arr.map((a) => +a[0]).sort();
  const right = arr.map((a) => +a[1]).sort();

  const diffs = zip(left, right).map(([a, b]) => Math.abs(a - b));
  const sum = diffs.reduce((memo, item) => memo + item, 0);
  console.log({ left, right, diffs, sum });
}

async function run2() {
  const contents = getFile(resolve(__dirname, './sample2.txt'));
  const arr = contents.map((c) => c.split('   '));

  const left = arr.map((a) => +a[0]);
  const right = arr.map((a) => +a[1]);
  const sortedRight = [...right].sort();

  const appearances = groupBy(sortedRight);

  const res = left.reduce((memo, item) => {
    if (!appearances[item]) {
      return memo;
    }
    return memo + appearances[item].length * item;
  }, 0);

  console.log({ res });
}

run2()
  .then((val) => {
    console.log(val);
  })
  .catch((err) => console.error(err));
