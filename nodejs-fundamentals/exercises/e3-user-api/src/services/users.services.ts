/**
 * Users Service
 * Xử lý business logic, gọi database
 * (Đã hoàn thành - không cần sửa)
 */

// Giả lập database
const users: any[] = []
let userId = 1

class UsersService {
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      const error: any = new Error('Email already exists')
      error.status = 422
      throw error
    }

    // Tạo user mới
    const newUser = {
      _id: String(userId++),
      name,
      email,
      password, // Thực tế sẽ hash password
      created_at: new Date(),
      updated_at: new Date()
    }
    users.push(newUser)

    // Trả về user (không trả password)
    const { password: _, ...userWithoutPassword } = newUser
    return {
      user: userWithoutPassword,
      access_token: 'fake_access_token_' + newUser._id,
      refresh_token: 'fake_refresh_token_' + newUser._id
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      const error: any = new Error('Email or password is incorrect')
      error.status = 401
      throw error
    }

    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      access_token: 'fake_access_token_' + user._id,
      refresh_token: 'fake_refresh_token_' + user._id
    }
  }

  async getProfile(userId: string) {
    const user = users.find((u) => u._id === userId)
    if (!user) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateProfile(userId: string, updateData: any) {
    const userIndex = users.findIndex((u) => u._id === userId)
    if (userIndex === -1) {
      const error: any = new Error('User not found')
      error.status = 404
      throw error
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updated_at: new Date()
    }

    const { password: _, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  }
}

const usersService = new UsersService()
export default usersService
