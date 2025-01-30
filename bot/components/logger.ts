// eslint-disable-next-line @typescript-eslint/no-require-imports
const c = require("colors/safe");
export enum loggingLevels {
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4,
}
export const logLevel = loggingLevels.Info;
export function debug(...msg: unknown[]) {
  const m = msg.join(" ");
  if (logLevel >= 4) {
    console.log(c.bgGray(" ")+c.brightGray("  debug") + ": " + m);
  }
}
export function info(...msg: unknown[]) {
  const m = msg.join(" ");
  if (logLevel >= 3) {
    console.log(c.bgBlue(" ")+c.brightBlue("  info") + ": " + m);
  }
}
export function warn(...msg: unknown[]) {
  const m = msg.join(" ");
  if (logLevel >= 2) {
    console.warn(c.bgYellow(" ")+c.brightYellow.bold("  warn") + ": " + c.bold(m));
  }
}
export function error(...msg: unknown[]) {
  const m = msg.join(" ");
  if (logLevel >= 1) {
    console.error(c.bgRed(" ")+c.brightRed.bold("  error") + ": " + c.bold(m));
  }
}


export default { error, warn, info, debug };
