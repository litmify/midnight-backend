import * as Koa from 'koa';

import logger from '@utils/logger';

export interface Ilogger {
  scope: string;
  message: string;
}

const ctxReturn = (
  ctx: Koa.BaseContext,
  result: boolean,
  payload: object,
  message: string = '',
  status: number,
  log?: Ilogger,
): void => {
  // Logging
  if (result) logger(log.scope).success(log.message);
  else logger(log.scope).error(log.message);

  // Set Koa body
  ctx.body = {
    result,
    payload,
    message,
  };
  ctx.status = status;

  return;
};

export default ctxReturn;
