import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import { generateJWT } from '@lib/jwt';

import ctxReturn from '@utils/ctx.return';
import logger from '@utils/logger';

import User from '@db/models/User';
import UserRegisterCode from '@db/models/UserRegisterCode';

const registerValidate = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;
  logger('auth/register.validate').await(
    `Starting register validate process for user: ${data.email}`,
  );

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
      scope: 'auth/register',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Getting login code information
  const code = await UserRegisterCode.findOne({ code: data.code });
  if (!code) {
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/register.validate',
      message: `LoginCode not found: ${data.email} | ${data.code}`,
    });
  }

  // Comparing code
  if (data.email !== code.email) {
    return ctxReturn(ctx, false, null, 'verification failed', 401, {
      scope: 'auth/register.validate',
      message: `RegisterCode is not valid: ${data.email} | ${data.code}`,
    });
  }

  logger('auth/register.validate').info(
    `Register validation success: ${data.email} | ${data.code}`,
  );

  // Make user information
  const userInformation = { email: code.email, username: code.username };

  // Delete codes
  await UserRegisterCode.deleteMany({ email: code.email });

  // Generating JWT
  let jwtToken = null;
  try {
    jwtToken = await generateJWT({ email: data.email }, 'user');
    logger('auth/register.validate').success(`JWT Generated for user: ${data.email} | ${jwtToken}`);
  } catch (e) {
    return ctxReturn(ctx, false, null, 'unexpected error', 500, {
      scope: 'auth/register.validate',
      message: `Unexpected error: ${e}`,
    });
  }

  // Process register
  const id = nanoid(32);
  return await User.create({
    id,
    email: userInformation.email,
    username: userInformation.username,
  })
    .then(user => {
      return ctxReturn(ctx, true, { token: jwtToken }, '', 200, {
        scope: 'auth/register.validate',
        message: `Created new user: ${user.id} | ${user.email} | ${user.username}`,
      });
    })
    .catch(err => {
      return ctxReturn(ctx, false, null, '', 500, {
        scope: `auth/register.validate`,
        message: `Unexpected error: ${err}`,
      });
    });
};

export default registerValidate;
