import * as Koa from 'koa';
import * as joi from 'joi';

import { logger } from '@utils/logger';
import { User } from '@db/models';

const loginValidate = async (ctx: Koa.Context): Promise<void> => {
  const loginValidateData = ctx.request.body;
  logger.apiv1.await(
    `Validating login process for email: ${loginValidateData.email} with code: ${loginValidateData.code}`,
  );

  const joiObject = joi.object({
    email: joi
      .string()
      .email()
      .required(),
    code: joi.string().required(),
  });

  const joiResult = joi.validate(loginValidateData, joiObject);
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

  // Find user with email
  const user = await User.findUser(loginValidateData.email, 'email');
  if (!user) {
    logger.apiv1.fatal(`No user find with email: ${loginValidateData.email}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'not found',
    };
    ctx.status = 404;
    return;
  }

  const loginCode = user.meta.loginCode;
  await user.logLoginTry('validate', loginCode, loginValidateData.code);

  // Check loginCode is generated
  if (loginCode === '' || loginCode === null || loginCode === undefined) {
    logger.apiv1.fatal(`LoginCode not exists for user: ${loginValidateData.email}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'unexpected error',
    };
    ctx.status = 400;

    return;
  }

  // Check loginCode is valid
  if (loginValidateData.code !== loginCode) {
    logger.apiv1.fatal(
      `Verification code mismatch: ${loginValidateData.code} | ${loginValidateData.email}`,
    );
    ctx.body = {
      result: false,
      payload: null,
      message: 'verification failed',
    };
    ctx.status = 401;
  } else {
    logger.apiv1.success(`Login success: ${loginValidateData.code} | ${loginValidateData.email}`);

    // Log login
    await user.logLogin(loginCode);
    await user.resetLoginCode();

    // TODO: Process login
    ctx.body = {
      result: true,
      payload: user.email,
      message: '',
    };
  }
};

export default loginValidate;
