/**
 * 01-bad-structure/server.ts
 *
 * VÍ DỤ VỀ STRUCTURE TỆ - TẤT CẢ CODE TRONG 1 FILE
 *
 * File này minh họa vấn đề khi không chia thư mục:
 * - Khó navigate (cuộn lên xuống liên tục)
 * - Khó maintain (bug ở đâu?)
 * - Khó test (test từng phần như thế nào?)
 * - Khó làm teamwork (merge conflict liên tục)
 */

import http from 'http';
import { parse } from 'url';

// ============================================
// TYPES (Lẽ ra nên ở types/user.types.ts)
// ============================================
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// ============================================
// "DATABASE" (Lẽ ra nên ở models/user.model.ts)
// ============================================
let users: User[] = [
  { id: 1, name: 'John', email: 'john@example.com', password: 'hash123', createdAt: new Date() },
  { id: 2, name: 'Jane', email: 'jane@example.com', password: 'hash456', createdAt: new Date() },
];
let nextId = 3;

// ============================================
// UTILS (Lẽ ra nên ở utils/response.ts)
// ============================================
function sendJson(res: http.ServerResponse, statusCode: number, data: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

// ============================================
// VALIDATION (Lẽ ra nên ở utils/validation.ts)
// ============================================
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUser(data: unknown): data is CreateUserDto {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string'
  );
}

// ============================================
// BUSINESS LOGIC (Lẽ ra nên ở services/user.service.ts)
// ============================================
function getAllUsers(): Omit<User, 'password'>[] {
  return users.map(({ password, ...user }) => user);
}

function getUserById(id: number): Omit<User, 'password'> | null {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

function createUser(data: CreateUserDto): Omit<User, 'password'> {
  const newUser: User = {
    id: nextId++,
    name: data.name,
    email: data.email,
    password: data.password, // Lẽ ra phải hash
    createdAt: new Date(),
  };
  users.push(newUser);
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

function deleteUser(id: number): boolean {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

// ============================================
// REQUEST HANDLERS (Lẽ ra nên ở controllers/user.controller.ts)
// ============================================
async function handleGetUsers(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const allUsers = getAllUsers();
  sendJson(res, 200, { success: true, data: allUsers });
}

async function handleGetUserById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number
): Promise<void> {
  const user = getUserById(id);
  if (!user) {
    sendJson(res, 404, { success: false, message: 'User not found' });
    return;
  }
  sendJson(res, 200, { success: true, data: user });
}

async function handleCreateUser(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  try {
    const body = await parseBody(req);

    if (!validateUser(body)) {
      sendJson(res, 400, { success: false, message: 'Invalid user data' });
      return;
    }

    if (!validateEmail(body.email)) {
      sendJson(res, 400, { success: false, message: 'Invalid email format' });
      return;
    }

    const newUser = createUser(body);
    sendJson(res, 201, { success: true, data: newUser });
  } catch {
    sendJson(res, 400, { success: false, message: 'Invalid JSON' });
  }
}

async function handleDeleteUser(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number
): Promise<void> {
  const deleted = deleteUser(id);
  if (!deleted) {
    sendJson(res, 404, { success: false, message: 'User not found' });
    return;
  }
  sendJson(res, 200, { success: true, message: 'User deleted' });
}

// ============================================
// ROUTER (Lẽ ra nên ở routes/user.routes.ts)
// ============================================
async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const { pathname } = parse(req.url || '', true);
  const method = req.method || 'GET';

  console.log(`${method} ${pathname}`);

  // GET /users
  if (method === 'GET' && pathname === '/users') {
    return handleGetUsers(req, res);
  }

  // GET /users/:id
  const getUserMatch = pathname?.match(/^\/users\/(\d+)$/);
  if (method === 'GET' && getUserMatch) {
    const id = parseInt(getUserMatch[1], 10);
    return handleGetUserById(req, res, id);
  }

  // POST /users
  if (method === 'POST' && pathname === '/users') {
    return handleCreateUser(req, res);
  }

  // DELETE /users/:id
  const deleteUserMatch = pathname?.match(/^\/users\/(\d+)$/);
  if (method === 'DELETE' && deleteUserMatch) {
    const id = parseInt(deleteUserMatch[1], 10);
    return handleDeleteUser(req, res, id);
  }

  // 404 Not Found
  sendJson(res, 404, { success: false, message: 'Route not found' });
}

// ============================================
// SERVER SETUP (Lẽ ra nên ở index.ts hoặc app.ts)
// ============================================
const PORT = 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch(err => {
    console.error('Error:', err);
    sendJson(res, 500, { success: false, message: 'Internal Server Error' });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET    /users      - Get all users');
  console.log('  GET    /users/:id  - Get user by ID');
  console.log('  POST   /users      - Create new user');
  console.log('  DELETE /users/:id  - Delete user');
});

/**
 * 💀 VẤN ĐỀ CỦA FILE NÀY:
 *
 * 1. 180+ dòng code trong 1 file - khó navigate
 * 2. Muốn sửa validation? Cuộn lên dòng 60
 * 3. Muốn thêm Product feature? Thêm vào file này → 400 dòng
 * 4. 2 developers cùng sửa file này → merge conflict
 * 5. Muốn test riêng service? Không thể import riêng
 * 6. Code coupling cao - khó tái sử dụng
 *
 * ✅ GIẢI PHÁP: Chia thành nhiều files theo chức năng
 * → Xem folder 02-layer-based hoặc 03-feature-based
 */
