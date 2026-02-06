/**
 * POST HANDLERS
 * Xử lý logic cho /api/posts
 */

import { posts, users, getNextPostId } from "../data/db.js";
import { sendJson, parseBody } from "../utils/helpers.js";

/**
 * GET /api/posts
 * Lấy tất cả posts
 */
export function getPosts(req, res) {
  // Thêm thông tin author vào mỗi post
  const postsWithAuthor = posts.map((post) => {
    const author = users.find((u) => u.id === post.authorId);
    return {
      ...post,
      author: author ? author.name : "Unknown",
    };
  });

  sendJson(res, 200, {
    success: true,
    count: posts.length,
    data: postsWithAuthor,
  });
}

/**
 * GET /api/posts/:id
 * Lấy 1 post theo ID
 */
export function getPostById(req, res) {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return sendJson(res, 404, {
      success: false,
      error: `Post id=${id} không tồn tại`,
    });
  }

  // Thêm thông tin author
  const author = users.find((u) => u.id === post.authorId);

  sendJson(res, 200, {
    success: true,
    data: {
      ...post,
      author: author ? author.name : "Unknown",
    },
  });
}

/**
 * POST /api/posts
 * Tạo post mới
 */
export async function createPost(req, res) {
  try {
    const body = await parseBody(req);

    // Validate
    if (!body.title || !body.content) {
      return sendJson(res, 400, {
        success: false,
        error: "Thiếu title hoặc content",
      });
    }

    // Tạo post mới
    const newPost = {
      id: getNextPostId(),
      title: body.title,
      content: body.content,
      authorId: body.authorId || 1, // Default author
    };

    posts.push(newPost);

    sendJson(res, 201, {
      success: true,
      message: "Tạo post thành công",
      data: newPost,
    });
  } catch (error) {
    sendJson(res, 400, { success: false, error: error.message });
  }
}

/**
 * DELETE /api/posts/:id
 * Xóa post
 */
export function deletePost(req, res) {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return sendJson(res, 404, {
      success: false,
      error: `Post id=${id} không tồn tại`,
    });
  }

  const deletedPost = posts.splice(postIndex, 1)[0];

  sendJson(res, 200, {
    success: true,
    message: "Xóa thành công",
    data: deletedPost,
  });
}
