import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';

async function run() {
  const rows = getFile(resolve(__dirname, './sample.txt'));
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample.txt'));
}

run().catch((err) => console.error(err));
