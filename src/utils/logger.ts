import { Signale } from 'signale';

const logger = (
  scope: string,
  disabled: boolean = false,
  interactive: boolean = false,
  types: object = {},
): Signale => {
  const options = {
    disabled,
    scope,
    interactive,
    types,
    stream: process.stdout,
  };

  const log = new Signale(options);
  return log;
};

export { logger };
