/**
 * POST ROUTES
 * Định nghĩa routes cho /api/posts
 */

import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
} from "../handlers/posts.js";

/**
 * Đăng ký tất cả post routes vào router
 */
export function registerPostRoutes(router) {
  router.get("/api/posts", getPosts);
  router.get("/api/posts/:id", getPostById);
  router.post("/api/posts", createPost);
  router.delete("/api/posts/:id", deletePost);
}
