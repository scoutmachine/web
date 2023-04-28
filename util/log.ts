import chalk from "chalk";

export const log = (type: string, text: string) => {
    switch (type) {
      case "warning":
        return `${chalk.yellow("INFO:")} ${text}`;
  
      case "error":
        return `${chalk.red("ERROR")} ${text}`;
    }
  };