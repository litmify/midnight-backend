import * as Koa from 'koa';
import * as joi from 'joi';

import ctxReturn from '@utils/ctx.return';

import Post from '@db/models/Post';

const checkOwner = async (ctx: Koa.BaseContext): Promise<void> => {
  const { postId } = ctx.request.body;

  // Validate input
  const joiObject = joi.object({
    postId: joi.string(),
  });

  const joiObjectValidateResult = joi.validate({ postId }, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'post/delete',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  const post = await Post.findOne({ id: postId })
    .then(res => {
      return res;
    })
    .catch(() => {
      return null;
    });

  if (!post) {
    return ctxReturn(ctx, false, null, 'not found', 404, {
      scope: 'post/delete',
      message: `Post not found: ${postId}`,
    });
  }

  if (post.ownerId !== ctx.state.user.id) {
    return ctxReturn(ctx, false, null, '', 400, {
      scope: 'post/delete',
      message: `User ${ctx.state.user.id} is not the owner of the post ${post.ownerId}`,
    });
  }

  return await Post.deleteOne({ id: postId })
    .then(() => {
      return ctxReturn(ctx, true, { id: post.id }, null, 200, {
        scope: 'post/delete',
        message: `Deleted post: ${postId}`,
      });
    })
    .catch(err => {
      return ctxReturn(ctx, false, null, 'unexpected error', 500, {
        scope: 'post/delete',
        message: `Unexpected error: ${err}`,
      });
    });
};

export default checkOwner;
