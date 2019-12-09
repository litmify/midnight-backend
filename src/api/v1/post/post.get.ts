import * as Koa from 'koa';
import * as joi from 'joi';

import ctxReturn from '@utils/ctx.return';

import Post from '@db/models/Post';

const get = async (ctx: Koa.BaseContext): Promise<void> => {
  const { postId, owner, postIndex, skip } = ctx.request.query;

  // Validate input
  const joiObject = joi.object({
    postIndex: joi.number().integer(),
    owner: joi.string(),
    postId: joi.string(),
  });

  const joiObjectValidateResult = joi.validate({ postId, owner, postIndex }, joiObject);
  if (joiObjectValidateResult.error) {
    // Validation failed
    return ctxReturn(ctx, false, null, 'bad request', 400, {
      scope: 'post/get',
      message: `joi validation error: ${joiObjectValidateResult.error}`,
    });
  }

  // Get only user's post
  if (owner === 'true') {
    return await Post.find({ ownerId: ctx.state.user.id })
      .sort({ createdAt: -1 })
      .skip(parseInt(postIndex) || 0)
      .limit(9)
      .then(posts => {
        if (posts.length === 0) {
          return ctxReturn(ctx, true, { posts: [], end: true }, '', 200, {
            scope: 'post/get',
            message: `Get request but it's empty`,
          });
        }
        return ctxReturn(ctx, true, posts, '', 200, {
          scope: 'post/get',
          message: `Get for mypage from ${ctx.state.user.id}`,
        });
      })
      .catch(() => {
        return ctxReturn(ctx, false, null, '', 404, {
          scope: 'post/get',
          message: `Get request to non-existing post from ${ctx.state.user.id}`,
        });
      });
  }

  // Get all posts
  if (!postId) {
    return await Post.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(postIndex) || 0)
      .limit(9)
      .then(posts => {
        if (posts.length === 0) {
          return ctxReturn(ctx, true, { posts: null, end: true }, '', 200, {
            scope: 'post/get',
            message: `Get request but it's empty`,
          });
        }
        let tmpPosts = [];
        posts.forEach(post => {
          if (!post.isPublic) {
            if (post.ownerId === ctx.state.user.id) {
              tmpPosts.push(post);
            }
          } else {
            tmpPosts.push(post);
          }
        });

        return ctxReturn(ctx, true, { posts: tmpPosts }, '', 200, {
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

  // Get one post
  return await Post.findOne({ id: postId })
    .then(post => {
      if (!post) {
        return ctxReturn(ctx, false, null, '', 404, {
          scope: 'post/get',
          message: `Get request to non-existing post from ${ctx.state.user.id}`,
        });
      }

      if (post.ownerId === ctx.state.user.id) {
        ctxReturn(ctx, true, { post }, '', 200, {
          scope: 'post/get',
          message: `Get request from ${ctx.state.user.id}`,
        });
      } else if (!post.isPublic) {
        return ctxReturn(ctx, false, null, '', 404, {
          scope: 'post/get',
          message: `Get request to private post from ${ctx.state.user.id}`,
        });
      } else {
        return ctxReturn(ctx, true, { post }, '', 200, {
          scope: 'post/get',
          message: `Get public request from ${ctx.state.user.id}`,
        });
      }
    })
    .catch(err => {
      ctxReturn(ctx, false, null, 'unexpected error', 500, {
        scope: 'post/get',
        message: `Unexpected Error: ${err}`,
      });
    });
};

export default get;
