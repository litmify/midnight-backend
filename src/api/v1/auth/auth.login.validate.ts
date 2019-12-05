import * as Koa from 'koa';
import * as joi from 'joi';

import ctxReturn from '@utils/ctx.return';
import logger from '@utils/logger';
import { generateJWT } from '@lib/jwt';

import User from '@db/models/User';
import UserLoginCode from '@db/models/UserLoginCode';

const loginValidate = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;
  logger('auth/login.validate').await(`Starting login validate process for user: ${data.email}`);

  // Validating input with Joi
  const joiObject = joi.object({
    email: joi
      .string()
      .email()
      .required(),
    code: joi.string().required(),
  });
  const joiObjectValidateResult = joi.validate(data, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/login',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Getting user information
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/login.validate',
      message: `User not found: ${data.email} | ${data.code}`,
    });
  }

  // Getting login code information
  const code = await UserLoginCode.findOne({ code: data.code });
  if (!code) {
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/login.validate',
      message: `LoginCode not found: ${data.email} | ${data.code}`,
    });
  }

  // Comparing code
  if (code.uid !== user.id || data.email !== user.email) {
    return ctxReturn(ctx, false, null, 'verification failed', 401, {
      scope: 'auth/login.validate',
      message: `LoginCode is not valid: ${data.email} | ${data.code}`,
    });
  }

  logger('auth/login.validate').info(`Login success: ${data.email} | ${data.code}`);

  // Deleting LoginCode
  await UserLoginCode.deleteMany({ uid: user.id });

  // Generating JWT
  try {
    const jwtToken = await generateJWT({ email: data.email }, 'user');
    return ctxReturn(ctx, true, { token: jwtToken }, null, 200, {
      scope: 'auth/login.validate',
      message: `JWT Generated for user: ${data.email} | ${jwtToken}`,
    });
  } catch (e) {
    return ctxReturn(ctx, false, null, 'unexpected error', 500, {
      scope: 'auth/login.validate',
      message: `Unexpected error: ${e}`,
    });
  }
};

export default loginValidate;
