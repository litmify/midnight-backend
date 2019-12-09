import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import ctxReturn from '@utils/ctx.return';

import Project from '@db/models/Project';

const create = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;

  // Validate input
  const joiObject = joi.object({
    title: joi.string().required(),
    isPublic: joi.boolean().required(),
    description: joi.string().required(),
  });

  const joiObjectValidateResult = joi.validate(data, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'project/create',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Creating new project
  const projectDocument = new Project({
    id: nanoid(),
    ownerId: ctx.state.user.id,
    isPublic: data.isPublic,
    title: data.title,
    url: data.url,
    description: data.description,
  });

  return await Project.create(projectDocument)
    .then(project => {
      ctxReturn(ctx, true, { id: project.id }, null, 200, {
        scope: 'project/create',
        message: `Created new project: ${project.id} for user ${ctx.state.user.id}`,
      });
    })
    .catch(err => {
      return ctxReturn(ctx, false, null, '', 500, {
        scope: 'project/create',
        message: `Unexpected error: ${err}`,
      });
    });
};

export default create;
