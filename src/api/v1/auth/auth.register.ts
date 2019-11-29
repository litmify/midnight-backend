import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import ctxReturn from '@utils/ctx.return';
import logger from '@utils/logger';

import User from '@db/models/User';

const register = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;
  logger('auth/register').await(`Starting register process for user ${data.email}`);

  // Validating input with Joi
  const joiObject = joi.object({
    email: joi
      .string()
      .email()
      .required(),
    username: joi
      .string()
      .max(32)
      .min(2)
      .required(),
  });
  const joiObjectValidateResult = joi.validate(data, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'auth/register',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Checking if user already exists
  const userWithEmail = await User.findOne({ email: data.email });
  const userWithUsername = await User.findOne({ username: data.username });
  if (userWithEmail || userWithUsername) {
    return ctxReturn(ctx, false, userWithEmail ? 'email' : 'username', 'conflict', 409, {
      scope: 'auth/register',
      message: `There's already user with ${userWithEmail ? 'email' : 'username'}: ${
        userWithEmail ? data.email : data.username
      }`,
    });
  }

  // Process register
  const uid = nanoid(32);
  return await User.create({
    uid,
    email: data.email,
    username: data.username,
  })
    .then(user => {
      ctxReturn(ctx, true, null, '', 200, {
        scope: 'auth/register',
        message: `Created new user: ${user.uid} | ${user.email} | ${user.username}`,
      });
    })
    .catch(err => {
      ctxReturn(ctx, false, null, '', 500, {
        scope: `auth/register`,
        message: `Unexpected error: ${err}`,
      });
    });
};

export default register;
