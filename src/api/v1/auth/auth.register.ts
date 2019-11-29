import * as Koa from 'koa';
import * as joi from 'joi';

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

  logger('auth/register').success('Validation complete!');
  return;
};

export default register;
