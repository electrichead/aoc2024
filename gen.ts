import { renderFile } from 'ejs';
import { copyFileSync, existsSync, mkdir } from 'node:fs';
import yargsInteractive, { Option } from 'yargs-interactive';

async function copyTs() {
  return renderFile('template/run.ts');
}

async function copyTemplate() {
  const options: Option = {
    interactive: { default: true },
    day: {
      type: 'input',
      default: new Date().getDate(),
      prompt: 'always',
      describe: 'Enter the day with leading zero',
    },
  };

  const result = await yargsInteractive()
    .usage('$0 <command> [args]')
    .interactive(options);

  if (existsSync(result)) {
    console.log('Directory exists');
    process.exit(1);
  }
}

(async function () {
  await copyTemplate();
})();
