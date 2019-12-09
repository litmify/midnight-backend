import * as Koa from 'koa';
import * as joi from 'joi';
import nanoid = require('nanoid');

import ctxReturn from '@utils/ctx.return';

import Post from '@db/models/Post';
import User from '@db/models/User';

const create = async (ctx: Koa.BaseContext): Promise<void> => {
  const data = ctx.request.body;

  // Validate input
  const joiObject = joi.object({
    title: joi.string().required(),
    isPublic: joi.boolean().required(),
    body: joi.required(),
  });

  const joiObjectValidateResult = joi.validate(data, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'post/create',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Check if user is exists
  const user = await User.findOne({ id: ctx.state.user.id })
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });
  if (!user) {
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'post/create',
      message: `User not exists: ${data.ownerId}`,
    });
  }

  // Creating new post
  const postDocument = new Post({
    id: nanoid(),
    title: data.title,
    ownerId: ctx.state.user.id,
    isPublic: data.isPublic,
    body: data.body,
  });

  return await Post.create(postDocument)
    .then(post => {
      return ctxReturn(ctx, true, { id: post.id }, null, 200, {
        scope: 'post/create',
        message: `Created new post: ${post.id} for user ${data.ownerId}`,
      });
    })
    .catch(err => {
      return ctxReturn(ctx, false, null, 'unexpected error', 500, {
        scope: 'post/create',
        message: `Unexpected error: ${err}`,
      });
    });
};

export default create;
