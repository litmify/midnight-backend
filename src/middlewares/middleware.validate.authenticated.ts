import * as Koa from 'koa';
import * as jwt from '@lib/jwt';

import { User } from '@db/models';
import { logger } from '@utils/logger';

const middleware_validate = async (
  ctx: Koa.BaseContext,
  next: () => Promise<any>,
): Promise<any> => {
  try {
    const token = ctx.header.cilic;

    // If there is no token
    if (!token) {
      ctx.body = {
        result: false,
        payload: null,
        message: 'invalid token',
      };
      ctx.status = 400;
      return;
    }

    // Get user information by token
    const validateResult = jwt.validateJWT(token);
    const tokenUser = await User.findUser(validateResult.email, 'email');

    // If there is no user
    if (!tokenUser) {
      logger('auth').fatal(`JWT User not exists: ${validateResult.email} | ${token}`);
      ctx.body = {
        result: false,
        payload: null,
        message: 'invalid token',
      };
      ctx.status = 400;
      return;
    }

    // Pass
    logger('auth').success(`JWT Validated: ${tokenUser.email} | ${token}`);
    next();
  } catch (e) {
    logger('auth').error(`Error while validating jwt: ${e}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'validate error',
    };
    ctx.status = 400;
    return;
  }
};

export default middleware_validate;
