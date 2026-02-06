/**
 * FAKE DATABASE
 * Giả lập database bằng mảng trong memory
 */

export const users = [
  { id: 1, name: "Leminho", email: "leminho@example.com" },
  { id: 2, name: "Alice", email: "alice@example.com" },
  { id: 3, name: "Bob", email: "bob@example.com" },
];

export const posts = [
  { id: 1, title: "Hello World", content: "Bài viết đầu tiên", authorId: 1 },
  { id: 2, title: "Learn Node.js", content: "Học Node.js cơ bản", authorId: 1 },
  { id: 3, title: "Routing Patterns", content: "Các pattern routing", authorId: 2 },
];

// ID tiếp theo cho user/post mới
export let nextUserId = 4;
export let nextPostId = 4;

// Functions để tăng ID
export function getNextUserId() {
  return nextUserId++;
}

export function getNextPostId() {
  return nextPostId++;
}
