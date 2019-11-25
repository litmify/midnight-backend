import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import { logger } from '@utils/logger';
import { User } from '@src/db/models';

const login = async (ctx: Koa.Context): Promise<void> => {
  const loginData = ctx.request.body;
  logger('auth').await(`Starting login process for email: ${loginData.email}`);

  // Validating input
  const joiObject = joi.object({
    email: joi
      .string()
      .email()
      .required(),
  });

  const joiResult = joi.validate(loginData, joiObject);
  if (joiResult.error) {
    logger('auth').fatal(`Failed validating input: ${joiResult.error}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'bad request',
    };
    ctx.status = 400;
    return;
  }

  // Find user with email
  const user = await User.findUser(loginData.email, 'email');
  if (!user) {
    logger('auth').fatal(`No user find with email: ${loginData.email}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'not found',
    };
    ctx.status = 404;
    return;
  }

  // TODO: Send verification code with email
  const loginCode = nanoid();

  try {
    logger('auth').success(`Login code generated: ${loginCode}`);
    await user.setLoginCode(loginCode);
  } catch (e) {
    if (e) {
      logger('auth').error(`Unexpected error while generating login code: ${e}`);
      ctx.body = {
        result: false,
        payload: null,
        message: 'unexpected error',
      };
      ctx.status = 500;
      return;
    }
  }

  ctx.body = {
    result: true,
  };
};

export default login;
