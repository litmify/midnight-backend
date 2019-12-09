import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import ctxReturn from '@utils/ctx.return';

import Post from '@db/models/Post';
import Project from '@db/models/Project';

const create = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;

  // Validate input
  const joiObject = joi.object({
    title: joi.string().required(),
    ownerId: joi.string().required(),
    isPublic: joi.boolean().required(),
    body: joi.object().required(),
  });

  const joiObjectValidateResult = joi.validate(data, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'project/create',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Check if the user has project with id
  const projectOwnerId = await Project.findOne({ id: data.ownerId })
    .then(project => project.ownerId)
    .catch(() => null);

  if (!projectOwnerId || projectOwnerId !== ctx.state.user.id) {
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'project/create',
      message: `User ${ctx.state.user.id} not have project: ${data.ownerId}`,
    });
  }

  // Creating new post
  const postDocument = new Post({
    id: nanoid(),
    title: data.title,
    ownerId: data.ownerId,
    isPublic: data.isPublic,
    body: data.body,
  });

  return await Post.create(postDocument)
    .then(post => {
      return ctxReturn(ctx, true, { id: post.id }, null, 200, {
        scope: 'project/create',
        message: `Created new project: ${post.id} for project ${data.ownerId}`,
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
