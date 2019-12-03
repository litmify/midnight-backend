import * as Koa from 'koa';
import * as jwt from '@lib/jwt';

import User from '@db/models/User';
import logger from '@utils/logger';
import ctxReturn from '@utils/ctx.return';

const checkAuthenticated = async (ctx: Koa.BaseContext, next: () => Promise<any>): Promise<any> => {
  try {
    const token = ctx.header.cilic;

    // If there is no token
    if (!token) {
      return ctxReturn(ctx, false, null, 'invalid token', 400);
    }

    // Get user information by token
    const jwtValidateResult = jwt.validateJWT(token);
    const tokenUser = await User.findOne({ email: jwtValidateResult.email });

    // If there is no user
    if (!tokenUser) {
      return ctxReturn(ctx, false, null, 'invalid token', 400, {
        scope: 'middleware/jwt',
        message: `User not exists: ${jwtValidateResult.email}`,
      });
    }

    // Pass
    // logger('auth').success(`JWT Validated: ${tokenUser.email} | ${token}`);
    ctx.state.user = {
      id: tokenUser.id,
      email: tokenUser.email,
      username: tokenUser.username,
    };
    ctx.state.token = token;
    return next();
  } catch (e) {
    logger('auth').error(`Error while validating jwt: ${e}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'validate error',
    };
    ctx.state.user = null;
    ctx.status = 400;
    return;
  }
};

export default checkAuthenticated;
