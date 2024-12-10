import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import { trampoline } from 'src/shared/trampoline';
import { sum, takeRightWhile } from 'lodash-es';

type Expanded = (number | null)[];

function expand(str: number[], accum: Expanded, index: number) {
  if (str.length === 0) {
    return accum;
  }

  const [spacesTaken, spacesAfter, ...rest] = str;
  return () =>
    expand(
      rest,
      accum.concat(
        new Array(spacesTaken)
          .fill(index)
          .concat(spacesAfter ? new Array(spacesAfter).fill(null) : [])
      ),
      index + 1
    );
}

function findNext<T>(
  predicate: (e: T) => boolean,
  array: T[],
  startFrom: number
): number {
  for (let i = startFrom; i < array.length; i++) {
    if (predicate(array[i])) {
      return i;
    }
  }

  return -1;
}

function rearrange(items: (number | null)[]) {
  // console.log(JSON.stringify(items));
  let indexOfDot = items.findIndex((item) => item === null);
  let terminate = items.length - 1;

  for (
    ;
    terminate > 0 && indexOfDot < terminate && indexOfDot !== -1;
    terminate--
  ) {
    const lastChar = items[terminate];

    if (lastChar === null) {
      continue;
    }

    items[indexOfDot] = lastChar;

    indexOfDot = findNext((item) => item === null, items, indexOfDot + 1);
  }
  console.log(JSON.stringify(items.slice(0, terminate + 1)));
  return items.slice(0, terminate + 1).reduce((memo, item, i) => {
    return memo + i * item;
  }, 0);
}

async function run() {
  const [input] = getFile(resolve(__dirname, './sample2.txt'));

  const parsed = input.split('').map((a) => +a);
  const expandedArr = trampoline(() => expand(parsed, [], 0));
  console.log(rearrange(expandedArr));
}

function findNextGroup<T>(
  predicate: (e: T) => boolean,
  array: T[],
  numChars: number,
  start: number,
  end: number
): number {
  let consecutive = 0;
  for (let i = start; i < end; i++) {
    if (predicate(array[i])) {
      consecutive++;
      if (consecutive === numChars) {
        return i + 1 - consecutive;
      }
    } else {
      consecutive = 0;
    }
  }

  return -1;
}

function findLength(toParse: (number | null)[], upto: number) {
  let i = upto;
  const lastChar = toParse[i];
  let length = 0;

  while (i > 0 && toParse[i] === lastChar) {
    length++;
    i--;
  }

  return { lastChar, length };
}

function rearrange2(upto: number, toParse: (number | null)[]) {
  if (upto <= 0) {
    return toParse;
  }

  // console.log({ upto, toParse });

  const { lastChar, length } = findLength(toParse, upto);

  if (lastChar === null) {
    // skip length
    return () => rearrange2(upto - length, toParse);
  }

  const foundIndex = findNextGroup((a) => a === null, toParse, length, 0, upto);

  if (foundIndex === -1) {
    return () => rearrange2(upto - length, toParse);
  }

  return () =>
    rearrange2(
      upto - length,
      toParse
        .toSpliced(foundIndex, length, ...new Array(length).fill(lastChar))
        .toSpliced(upto + 1 - length, length, ...new Array(length).fill(null))
    );
}

async function run2() {
  const [input] = getFile(resolve(__dirname, './sample2.txt'));

  const parsed = input.split('').map((a) => +a);
  const expandedArr = trampoline(() => expand(parsed, [], 0));
  const res = trampoline(() => rearrange2(expandedArr.length - 1, expandedArr));
  const total = res.reduce((memo, item, i) => {
    if (item === null) {
      return memo;
    }
    return memo + i * item;
  });

  console.log({ total });
}

run2().catch((err) => console.error(err));
