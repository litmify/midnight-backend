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

const apiv1Logger = (): Signale => {
  const options = {
    scope: 'apiv1',
    stream: process.stdout,
  };

  const log = new Signale(options);
  return log;
};

const logger = {
  koa: koaLogger(),
  mongo: mongoLogger(),
  apiv1: apiv1Logger(),
};

export { logger };
