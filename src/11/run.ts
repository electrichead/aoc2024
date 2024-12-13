import { memoize, sum } from 'lodash-es';
import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';

function getItems(item: string) {
  const ret: string[] = [];

  if (item === '0') {
    ret.push('1');
  } else if (item.length % 2 === 0) {
    ret.push(item.substring(0, item.length / 2));
    const rhs = item.substring(item.length / 2);
    ret.push('' + +rhs);
  } else {
    ret.push(`${2024 * +item}`);
  }

  return ret;
}

function performIteration(numIterations: number, accum: string[]) {
  let itemMap = accum.reduce((memo, key) => {
    if (!memo.has(key)) {
      memo.set(key, BigInt(1));
    } else {
      memo.set(key, memo.get(key) + BigInt(1));
    }

    return memo;
  }, new Map<string, bigint>());

  // Oh God, this is so bad
  for (let i = 0; i < numIterations; i++) {
    // console.log(itemMap);
    itemMap = [...itemMap.entries()].reduce((memo, [key, count]) => {
      const nextValues = getItems(key);

      nextValues.forEach((nextVal) => {
        if (!memo.has(nextVal)) {
          memo.set(nextVal, count);
        } else {
          memo.set(nextVal, memo.get(nextVal) + count);
        }
      });

      return memo;
    }, new Map<string, bigint>());
  }

  return itemMap;
}

async function run() {
  const [input] = getFile(resolve(__dirname, './sample.txt'));
  const arr = input.split(' ');
  const res = performIteration(25, arr);

  console.log(res);
}

async function run2() {
  const [input] = getFile(resolve(__dirname, './sample.txt'));
  // const input = '125 17';
  const arr = input.split(' ');
  const res = performIteration(75, arr);
  // console.log(res);
  console.log(sum([...res.values()]));
}

run2().catch((err) => console.error(err));
