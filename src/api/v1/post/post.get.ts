import * as Koa from 'koa';
import * as joi from 'joi';

import ctxReturn from '@utils/ctx.return';

import Post from '@db/models/Post';
import Project from '@db/models/Project';

const create = async (ctx: Koa.BaseContext): Promise<void> => {
  const { projectId, postId } = ctx.params;

  // Validate input
  const joiObject = joi.object({
    projectId: joi.string().alphanum(),
    postId: joi.string().alphanum(),
  });

  const joiObjectValidateResult = joi.validate({ projectId, postId }, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'post/get',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Get all posts which are public
  if (!projectId) {
    return await Post.find({ isPublic: true })
      .then(posts => {
        return ctxReturn(ctx, true, { posts }, '', 200, {
          scope: 'post/get',
          message: `Get request`,
        });
      })
      .catch(err => {
        return ctxReturn(ctx, false, null, 'unexpected error', 500, {
          scope: 'post/get',
          message: `Unexpected Error: ${err}`,
        });
      });
  }

  const pid = await Project.findOne({ id: projectId }).then(project => project.ownerId);
  const uid = ctx.state.user.id;
  const isOwner = uid === pid;

  // Get all posts from project
  if (!postId) {
    if (isOwner) {
      return await Post.find({ ownerId: uid })
        .then(posts => {
          return ctxReturn(ctx, true, { posts }, '', 200, {
            scope: 'post/get',
            message: `Get request`,
          });
        })
        .catch(err => {
          return ctxReturn(ctx, false, null, 'unexpected error', 500, {
            scope: 'post/get',
            message: `Unexpected Error: ${err}`,
          });
        });
    } else {
      return await Post.find({ isPublic: true, ownerId: uid })
        .then(posts => {
          return ctxReturn(ctx, true, { posts }, '', 200, {
            scope: 'post/get',
            message: `Get request`,
          });
        })
        .catch(err => {
          return ctxReturn(ctx, false, null, 'unexpected error', 500, {
            scope: 'post/get',
            message: `Unexpected Error: ${err}`,
          });
        });
    }
  }

  // Get one post
  return await Post.find({ id: postId, ownerId: projectId })
    .then(posts => {
      let res = [];
      posts.forEach(post => {
        if (!post.isPublic) {
          if (isOwner) res.push(post);
        } else res.push(post);
      });

      ctxReturn(ctx, true, { projects: res }, '', 200, {
        scope: 'post/get',
        message: `Get request from ${ctx.state.user.id} | isOwner: ${isOwner}`,
      });
    })
    .catch(err => {
      ctxReturn(ctx, false, null, 'unexpected error', 500, {
        scope: 'post/get',
        message: `Unexpected Error: ${err}`,
      });
    });
};

export default create;
