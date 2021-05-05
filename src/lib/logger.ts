import chalk from 'chalk';

export const info = (message: string, subtitle?: string) => {
  console.log(chalk.blueBright('ℹ info ') + message);
  if (subtitle) {
    note(subtitle);
  }
};

export const warn = (message: string, subtitle?: string) => {
  console.log(chalk.yellowBright('⚠ warn ') + message);
  if (subtitle) {
    note(subtitle);
  }
};

export const pending = (message: string, subtitle?: string) => {
  console.log(chalk.blueBright('● pending ') + message);
  if (subtitle) {
    note(subtitle);
  }
};

export const success = (message: string, subtitle?: string) => {
  console.log(chalk.greenBright('✔ success ') + message);
  if (subtitle) {
    note(subtitle);
  }
};

export const error = (message: string, subtitle?: string) => {
  console.error(chalk.redBright('✖ error ') + message);
  if (subtitle) {
    note(subtitle);
  }
};

export const note = (message: string) => {
  console.log(chalk.gray('  → ' + message));
};

export default {info, warn, pending, success, error, note};
