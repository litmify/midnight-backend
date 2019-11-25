import * as Koa from 'koa';
import * as joi from 'joi';

import * as jwt from '@lib/jwt';

import { User, Project } from '@db/models';
import { logger } from '@utils/logger';

const create = async (ctx: Koa.Context): Promise<void> => {
  const createData = ctx.request.body;

  // Validate input
  const joiObject = joi.object({
    title: joi.string().required(),
    description: joi.string(),
  });

  const joiResult = joi.validate(createData, joiObject);
  if (joiResult.error) {
    logger('project').fatal(`Failed validating input: ${joiResult.error}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'bad request',
    };
    ctx.status = 400;
    return;
  }

  let owner = null;
  // TODO : Seperate JWT Verification with middleware
  try {
    const token = ctx.header.cilic;
    const validateResult = jwt.validateJWT(token);
    owner = await User.findUser(validateResult.email, 'email');

    // If there is no user
    if (!owner) {
      logger('auth').fatal(`JWT User not exists: ${validateResult.email} | ${token}`);
      ctx.body = {
        result: false,
        payload: null,
        message: 'invalid token',
      };
      ctx.status = 400;
      return;
    }
  } catch (e) {
    logger('project').error(`Error while validating jwt: ${e}`);
    ctx.body = {
      result: false,
      payload: null,
      message: 'validate error',
    };
    ctx.status = 400;
    return;
  }

  // Creating new project
  logger('project').await(`Start creating new project for ${owner.email}`);

  const projectDocument = new Project({
    meta: {
      owner: owner.uid,
    },
    title: createData.title,
    description: createData.description,
  });
  ctx.body = await Project.create(projectDocument)
    .then(project => {
      logger('project').success(`Project created: ${project.uid} for user ${owner.uid}`);
      return {
        result: true,
        payload: project.uid,
      };
    })
    .catch(err => {
      logger('project').error(`Unexpected Error: ${err}`);
      ctx.status = 500;
      return {
        result: false,
        payload: null,
        message: 'unexpected error',
      };
    });

  await owner.addProject(ctx.body.payload);
  logger('project').success(`Project saved: ${ctx.body.payload} for use ${owner.uid}`);
};

export default create;
