import chalk from "chalk";

export const log = (type: string, text: string): void => {
  switch (type) {
    case "warning":
      return console.log(`${chalk.yellow("INFO:")} ${text}`);

    case "error":
      return console.log(`${chalk.red("ERROR")} ${text}`);
  }
};
