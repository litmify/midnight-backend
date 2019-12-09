import * as Koa from 'koa';
import * as joi from 'joi';

import ctxReturn from '@utils/ctx.return';

import User from '@db/models/User';
import Project from '@db/models/Project';

const create = async (ctx: Koa.Context): Promise<void> => {
  const { username } = ctx.params;

  // Validate input
  const joiObject = joi.object({
    username: joi.string().alphanum(),
  });

  const joiObjectValidateResult = joi.validate({ username }, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'project/get',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  if (!username) {
    return await Project.find({ isPublic: true })
      .then(projects => {
        return ctxReturn(ctx, true, { projects }, '', 200, {
          scope: 'project/get',
          message: `Get request`,
        });
      })
      .catch(err => {
        return ctxReturn(ctx, false, null, 'unexpected error', 500, {
          scope: 'project/get',
          message: `Unexpected Error: ${err}`,
        });
      });
  }

  const id = await User.findOne({ username })
    .then(user => user.id)
    .catch(() => null);

  if (!id) {
    return ctxReturn(ctx, false, null, 'not found', 404, {
      scope: 'project/get',
      message: `Username not found: ${username}`,
    });
  }

  const isOwner = ctx.state.user.id === id;
  await Project.find({ ownerId: id })
    .then(projects => {
      let res = [];
      projects.forEach(project => {
        if (!project.isPublic) {
          if (isOwner) res.push(project);
        } else res.push(project);
      });

      ctxReturn(ctx, true, { projects: res }, '', 200, {
        scope: 'project/get',
        message: `Get request from ${username} | isOwner: ${isOwner}`,
      });
    })
    .catch(err => {
      ctxReturn(ctx, false, null, 'unexpected error', 500, {
        scope: 'project/get',
        message: `Unexpected Error: ${err}`,
      });
    });
};

export default create;
