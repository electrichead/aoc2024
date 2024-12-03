import * as fs from 'fs';
import * as readline from 'readline';
import { Subject } from 'rxjs';

export type ExerciseType = 'ex' | 'ex2' | 'normal' | 'real';

export function getFile(file: string) {
  return fs.readFileSync(file, 'utf-8').split('\n');
}

export function getFile$(file: string) {
  const subj$ = new Subject<string>();

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
  });

  rl.on('line', (line) => {
    subj$.next(line);
  });

  rl.once('close', () => subj$.complete());

  return subj$.asObservable();
}

export function mapFile(
  file: string,
  separatorPredicate: (str: string) => boolean
) {
  const fileContents = fs.readFileSync(file, 'utf-8').split('\n');

  const indexOfSeparator = fileContents.findIndex(separatorPredicate);

  return {
    initializationValues: fileContents.slice(0, indexOfSeparator),
    otherValues: fileContents.slice(indexOfSeparator + 1),
  };
}
