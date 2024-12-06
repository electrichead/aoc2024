import { resolve } from 'node:path';
import { getFile } from 'src/shared/extract-data';
import { groupBy, mapValues, sum } from 'lodash-es';

type IndexedNumbers = { [key: number]: number[] };

function parseRules(rules: number[][]) {
  return rules.reduce<IndexedNumbers>((memo, [index, target]) => {
    if (!memo[index]) {
      memo[index] = [];
    }

    memo[index].push(target);

    return memo;
  }, {});
}

function indexUpdates(updates: number[]) {
  return updates.reduce<IndexedNumbers>((memo, update, index) => {
    if (!memo[update]) {
      memo[update] = [];
    }

    memo[update].push(index);

    return memo;
  }, {});
}

async function run() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const demarcation = rows.findIndex((row) => row.length === 0);

  const rules = rows.slice(0, demarcation).map((r) => r.split('|'));
  const updates = rows.slice(demarcation + 1).map((r) => r.split(','));

  const parsedRules = parseRules(rules);

  // console.log({ rules, updates });
  // console.log(parsedRules);

  const correctUpdates = updates.filter((update) => {
    const indexedUpdates = indexUpdates(update);
    return update.every((elem, indexOfUpdateElem) => {
      const rulesForElem = parsedRules[elem] || [];
      return rulesForElem.every((ruleElem) => {
        const indexesOfRuleElem = indexedUpdates[ruleElem];
        if (!indexesOfRuleElem) {
          return true;
        }
        return indexesOfRuleElem.every(
          (indexOfRuleElem) => indexOfRuleElem > indexOfUpdateElem
        );
      });
    });
  });

  const mids = correctUpdates.map((u) => +u[Math.floor(u.length / 2)]);

  console.log({ mids: sum(mids) });
}

function checkUpdate(update: number[], parsedRules: IndexedNumbers) {
  const indexedUpdates = indexUpdates(update);

  return update.every((elem, indexOfUpdateElem) => {
    const rulesForElem = parsedRules[elem] || [];

    return rulesForElem.every((ruleElem) => {
      const indexesOfRuleElem = indexedUpdates[ruleElem];

      if (!indexesOfRuleElem) {
        return true;
      }
      return indexesOfRuleElem.every(
        (indexOfRuleElem) => indexOfRuleElem > indexOfUpdateElem
      );
    });
  });
}

async function run2() {
  const rows = getFile(resolve(__dirname, './sample2.txt'));
  const demarcation = rows.findIndex((row) => row.length === 0);

  const rules = rows
    .slice(0, demarcation)
    .map((r) => r.split('|').map((a) => +a));
  const updates = rows
    .slice(demarcation + 1)
    .map((r) => r.split(',').map((a) => +a));

  const parsedRules = parseRules(rules);

  const incorrectUpdates = updates.filter((update) => {
    return !checkUpdate(update, parsedRules);
  });

  const fixedUpdates = incorrectUpdates.map((update) => {
    // console.log({ beforeUpdate: update });
    while (!checkUpdate(update, parsedRules)) {
      update.sort((l, r) => {
        if (parsedRules[l]?.includes(r)) {
          return -1;
        }
        if (parsedRules[r]?.includes(l)) {
          return 1;
        }
        return 0;
      });
    }
    // console.log({ afterUpdate: update });
    return update;
  });

  const mids = fixedUpdates.map((u) => u[Math.floor(u.length / 2)]);

  console.log({ mids, sum: sum(mids) });
}

run2().catch((err) => console.error(err));
