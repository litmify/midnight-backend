import { Signale } from 'signale';

const koaLogger = (): Signale => {
  const options = {
    scope: 'koajs',
    stream: process.stdout,
  };

  const log = new Signale(options);
  return log;
};

const mongoLogger = (): Signale => {
  const options = {
    scope: 'mongo',
    stream: process.stdout,
  };

  const log = new Signale(options);
  return log;
};

const logger = {
  koa: koaLogger(),
  mongo: mongoLogger(),
};

export { logger };
