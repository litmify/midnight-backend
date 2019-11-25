import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

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

  // Getting user from state
  const owner = await User.findUser(ctx.state.user.uid, 'uid');

  /*
  THE BELOW CODE IS REMOVED: Already validating jwt token in middleware, and checks if there's user too.

  try {
    // If there is no user
    if (!owner) {
      logger('auth').fatal(`User not exists with this session: ${ctx.state.token}`);
      ctx.body = {
        result: false,
        payload: null,
        message: 'unauthorized',
      };
      ctx.status = 401;
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
  */

  // Creating new project
  const projectDocument = new Project({
    meta: {
      owner: owner.uid,
    },
    uid: nanoid(),
    title: createData.title,
    description: createData.description,
  });

  const uid = await Project.create(projectDocument)
    .then(project => {
      return project.uid;
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

  await owner.addProject(uid);
  logger('project').success(`Project created: ${uid} for user ${owner.uid}`);

  ctx.body = {
    result: true,
    payload: uid,
  };
};

export default create;
