import * as Koa from 'koa';
import * as joi from 'joi';
import * as AWS from 'aws-sdk';
import nanoid = require('nanoid');

import ctxReturn from '@utils/ctx.return';
import logger from '@utils/logger';

import User from '@db/models/User';
import UserRegisterCode from '@db/models/UserRegisterCode';

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
      .alphanum()
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

  // Generate non-duplicated code
  let code = nanoid(16);
  while (await UserRegisterCode.findOne({ code })) {
    logger('auth/register').warn(`Generated code collides: ${code}`);
    code = nanoid(16);
  }

  // Store user validation key with TTL 30 minutes
  const dbCode = await UserRegisterCode.create({
    code,
    email: data.email,
    username: data.username,
  })
    .then(loginCode => {
      return loginCode.code;
    })
    .catch(err => {
      return ctxReturn(ctx, false, null, '', 500, {
        scope: `auth/login`,
        message: `Unexpected error: ${err}`,
      });
    });

  // Send email with dbCode
  logger('auth/login').info('Connecting to AWS SES...');
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
  });
  const emailParams = {
    Destination: {
      ToAddresses: [data.email],
    },
    Source: process.env.AWS_SES_SOURCE,
    Template: 'Midnight-LoginCode', // Have to change template later
    TemplateData: `{ "username": "${data.username}", "code": "${dbCode}" }`,
  };

  const sendEmail = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendTemplatedEmail(emailParams)
    .promise();

  return await sendEmail
    .then(() => {
      logger('auth/register').info(`Register code mail sent to ${data.email}`);
      return ctxReturn(ctx, true, null, '', 200, {
        scope: 'auth/register',
        message: `Created new register code for user: ${data.email} | ${dbCode}`,
      });
    })
    .catch(err => {
      return ctxReturn(ctx, false, null, '', 500, {
        scope: `auth/register`,
        message: `Unexpected error: ${err}`,
      });
    });
};

export default register;
