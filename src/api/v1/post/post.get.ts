import * as Koa from 'koa';
import * as joi from 'joi';

import ctxReturn from '@utils/ctx.return';

import Post from '@db/models/Post';

const get = async (ctx: Koa.BaseContext): Promise<void> => {
  const { postId, owner, postIndex } = ctx.request.query;

  // Validate input
  const joiObject = joi.object({
    postIndex: joi.number().integer(),
    owner: joi.string().alphanum(),
    postId: joi.string().alphanum(),
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
  if (owner) {
    if (ctx.state.user.id !== owner) {
      return ctxReturn(ctx, false, null, '', 404, {
        scope: 'post/get',
        message: `Get request to non-existing post from ${ctx.state.user.id}`,
      });
    }

    return await Post.find({ ownerId: owner })
      .then(posts => {
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
      .skip(parseInt(postIndex) || 0)
      .limit(9)
      .then(posts => {
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
      } else {
        return ctxReturn(ctx, false, null, '', 404, {
          scope: 'post/get',
          message: `Get request to private post from ${ctx.state.user.id}`,
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
