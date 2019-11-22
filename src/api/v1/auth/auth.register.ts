import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import { logger } from '@utils/logger';
import { User } from '@db/models';

const register = async (ctx: Koa.Context): Promise<void> => {
  logger.apiv1.await('Start registering new user...');
  const userData = ctx.request.body;

  // Validating input
  const joiObject = joi.object({
    email: joi
      .string()
      .email()
      .required(),
    username: joi
      .string()
      .alphanum()
      .min(2)
      .max(32)
      .required(),
  });

  const joiResult = joi.validate(userData, joiObject);
  if (joiResult.error) {
    logger.apiv1.fatal(`Failed validating input: ${joiResult.error}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'bad request',
    };
    ctx.status = 400;
    return;
  }

  // Checking existing user with email
  if (await User.findUser(userData.email, 'email')) {
    logger.apiv1.fatal(`User already exists: ${userData.email}`);
    ctx.body = {
      result: false,
      payload: 'email',
      message: 'already exists',
    };
    ctx.status = 409;
    return;
  }

  // Checking existing user with username
  if (await User.findUser(userData.username, 'username')) {
    logger.apiv1.fatal(`User already exists: ${userData.username}`);
    ctx.body = {
      result: false,
      payload: 'username',
      message: 'already exists',
    };
    ctx.status = 409;
    return;
  }

  // Creating new user
  const userDocument = {
    uid: nanoid(24),
    email: userData.email,
    username: userData.username,
  };
  ctx.body = await User.create(userDocument)
    .then(user => {
      logger.apiv1.success(`User created: ${user.uid}`);
      return {
        result: true,
        payload: user.uid,
      };
    })
    .catch(err => {
      logger.apiv1.error(`Unexpected Error: ${err}`);
      ctx.status = 500;
      return {
        result: false,
        payload: null,
        message: 'unexpected error',
      };
    });
};

export default register;
