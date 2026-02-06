/**
 * Route handlers cho User API
 */

import { parseBody, sendJson, sendHtml } from './helpers.js';
import { validateUser } from './validators.js';
import { users } from './data.js';
import { homePageHtml } from './views.js';

// GET / - HTML Form
export function handleHome(req, res) {
  sendHtml(res, homePageHtml);
}

// GET /api/users - Lấy danh sách
export function handleGetUsers(req, res) {
  sendJson(res, 200, {
    success: true,
    count: users.length,
    users: users,
  });
}

// POST /api/users - Tạo user
export async function handleCreateUser(req, res) {
  try {
    const data = await parseBody(req);

    // Validate
    const validation = validateUser(data);
    if (!validation.valid) {
      sendJson(res, 400, { success: false, errors: validation.errors });
      return;
    }

    // Tạo user
    const newUser = {
      id: users.length + 1,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      age: data.age || null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    sendJson(res, 201, {
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    sendJson(res, error.status || 500, { success: false, error: error.message });
  }
}

// 404 handler
export function handleNotFound(req, res) {
  sendJson(res, 404, {
    error: 'Not Found',
    availableEndpoints: [
      'GET /',
      'GET /api/users',
      'POST /api/users',
    ],
  });
}
