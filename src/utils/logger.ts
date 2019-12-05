import { Signale } from 'signale';

const logger = (
  scope: string,
  disabled: boolean = false,
  interactive: boolean = false,
  types: object = {},
): Signale => {
  // create custom Signale logger
  const options: object = { scope, disabled, interactive, types, stream: process.stdout };
  const signale: Signale = new Signale(options);

  return signale;
};

export default logger;
