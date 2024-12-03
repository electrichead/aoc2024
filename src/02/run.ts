import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import chalk from 'chalk';

function checkDir(nums: number[], isDescending: boolean) {
  return isDescending ? nums[0] > nums[1] : nums[0] < nums[1];
}

function checkRow(arr: number[], isDescending?: boolean) {
  if (arr[0] === arr[1]) {
    return false;
  }

  isDescending ??= arr[0] > arr[1];

  for (let i = 1; i < arr.length; i++) {
    const diff = Math.abs(arr[i] - arr[i - 1]);
    if (diff > 3 || !checkDir([arr[i - 1], arr[i]], isDescending)) {
      return false;
    }
  }

  return true;
}

function checkRowWithTolerance(arr: number[]) {
  const isDescending = arr[0] > arr[1];

  for (let i = 1; i < arr.length; i++) {
    const curr = arr[i];
    const prev = arr[i - 1];

    const diff = Math.abs(curr - prev);

    if (diff > 3 || !checkDir([prev, curr], isDescending)) {
      if (i < 2) {
        return checkRow(arr.slice(1)) || checkRow([prev, ...arr.slice(i + 1)]);
      }

      if (i === 2) {
        return (
          checkRow(arr.slice(1)) ||
          checkRow([arr[i - 2], ...arr.slice(i)], arr[0] > curr) ||
          checkRow([prev, ...arr.slice(i + 1)], isDescending)
        );
      }

      return (
        checkRow([arr[i - 2], ...arr.slice(i)], isDescending) ||
        checkRow([prev, ...arr.slice(i + 1)], isDescending)
      );
    }
  }

  return true;
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));

  const checked = rows.reduce((memo, row) => {
    if (checkRow(row.split(' ').map((col) => +col))) {
      return memo + 1;
    }
    return memo;
  }, 0);
  console.log(checked);
}

function printRow(cols: number[]) {
  const str = [chalk.whiteBright(cols[0])];
  for (let i = 1; i < cols.length; i++) {
    const curr = cols[i];
    const prev = cols[i - 1];
    const color =
      curr < prev ? chalk.red : curr > prev ? chalk.green : chalk.blue;
    const diff = Math.abs(curr - prev);

    str.push(diff > 3 ? color['bgBlackBright'](cols[i]) : color(cols[i]));
  }

  console.log(str.join(' '));
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));

  const checked = rows.reduce((memo, row) => {
    const formattedRow = row.split(' ').map((col) => +col);
    if (checkRowWithTolerance(formattedRow)) {
      return memo + 1;
    }

    console.log(printRow(formattedRow));

    return memo;
  }, 0);
  console.log(checked);
}

run2()
  .then((val) => {
    console.log(val);
  })
  .catch((err) => console.error(err));
