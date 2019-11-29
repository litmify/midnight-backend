import * as Koa from 'koa';
import * as joi from 'joi';
import * as redis from 'redis';
import nanoid = require('nanoid');

import ctxReturn from '@utils/ctx.return';
import logger from '@utils/logger';

import User from '@db/models/User';
import UserLoginCode from '@db/models/UserLoginCode';

const login = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;
  logger('auth/login').await(`Starting login process for user: ${data.email}`);

  // Validating input with Joi
  const joiObject = joi.object({
    email: joi
      .string()
      .email()
      .required(),
  });
  const joiObjectValidateResult = joi.validate(data, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/login',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Get user with email
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/login',
      message: `User not found: ${data.email}`,
    });
  }

  // Delete all duplicated codes
  await UserLoginCode.deleteMany({ uid: user.id });

  // Generate non-duplicated code
  let code = nanoid(16);
  while (await UserLoginCode.findOne({ code })) {
    logger('auth/login').warn(`Generated code collides: ${code}`);
    code = nanoid(16);
  }

  // Store user validation key with TTL 30 minutes
  return await UserLoginCode.create({
    uid: user.id,
    code,
  })
    .then(loginCode => {
      ctxReturn(ctx, true, null, '', 200, {
        scope: 'auth/login',
        message: `Created new login code for user: ${user.id} | ${loginCode.code}`,
      });
    })
    .catch(err => {
      ctxReturn(ctx, false, null, '', 500, {
        scope: `auth/login`,
        message: `Unexpected error: ${err}`,
      });
    });
};

export default login;
