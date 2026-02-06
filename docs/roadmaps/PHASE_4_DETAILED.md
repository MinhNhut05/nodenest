# Giai đoạn 2: Fullstack & Deploy (N5)

**Duration:** 2-3 tuần
**Goal:** Kết nối NestJS backend với React frontend, deploy ứng dụng hoàn chỉnh
**Khóa:** NestJS (📗) + Express (📘 cho VPS)
**Prerequisites:** Module N1-N4 đã hoàn thành

> ⚠️ **Đây là GIAI ĐOẠN 2** - Học sau khi hoàn thành Giai đoạn 1 (Express)
> 📌 **Xem thứ tự học chi tiết:** [LEARNING_ORDER.md](./LEARNING_ORDER.md)

---

## Chú thích

| Icon | Ý nghĩa |
|------|---------|
| 🔴 | **MUST** - Bắt buộc, cần cho job |
| 🟡 | **SHOULD** - Nên học |
| 🟢 | **COULD** - Học sau được |
| 🤖 | Có thể học với AI |

---

## Thứ tự học

```
1. Integration      ← Connect API + Frontend
2. Auth Flow E2E    ← Login hoàn chỉnh
3. Docker           ← Containerize trước
4. VPS + Nginx      ← Deploy lên server
5. SSL + PM2        ← Production ready
```

---

## Module N5 - Fullstack & Deploy 🟡

| Session | Topic | Video | AI | Nội dung chính |
|---------|-------|-------|-----|----------------|
| N5.1 | Connect API + Frontend | | 🤖 | CORS, API calls, environment |
| N5.2 | State Management | | 🤖 | React Query + Zustand |
| N5.3 | Auth Flow E2E | | 🤖 | Login/logout, token storage |
| N5.4 | Docker | | 🤖 | Containerization |
| N5.5 | VPS Setup | 📘 Bài 219 | | Cloud server setup |
| N5.6 | Nginx & SSL | 📘 Bài 219 | 🤖 | Reverse proxy, HTTPS |
| N5.7 | PM2 | | 🤖 | Process manager |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Fullstack App                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐         ┌─────────────────┐          │
│   │   React Frontend│◄───────►│  NestJS Backend │          │
│   │                 │  REST   │                 │          │
│   │  - Components   │   API   │  - Controllers  │          │
│   │  - React Query  │         │  - Services     │          │
│   │  - Zustand      │         │  - Prisma ORM   │          │
│   │  - React Router │         │  - JWT Auth     │          │
│   └────────┬────────┘         └────────┬────────┘          │
│            │                           │                    │
│            ▼                           ▼                    │
│   ┌─────────────────┐         ┌─────────────────┐          │
│   │     Vercel      │         │  VPS / Railway  │          │
│   │   (Frontend)    │         │   (Backend)     │          │
│   └─────────────────┘         └────────┬────────┘          │
│                                        │                    │
│                                        ▼                    │
│                               ┌─────────────────┐          │
│                               │   PostgreSQL    │          │
│                               │   (Database)    │          │
│                               └─────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Topics Covered

### N5.1 - Connect API + Frontend 🔴 🤖

- CORS configuration trong NestJS
- API client setup (axios/fetch)
- Environment variables (.env.local, .env.production)
- API error handling on frontend
- API response types với TypeScript

### N5.2 - State Management 🔴 🤖

- **React Query** for server state:
  - useQuery, useMutation
  - Caching strategies
  - Optimistic updates
  - Prefetching

- **Zustand** for client state:
  - Store creation
  - Persist middleware
  - Devtools

### N5.3 - Auth Flow E2E 🔴 🤖

- Login/Register forms
- Token storage (localStorage vs httpOnly cookies)
- Protected routes (React Router)
- Auto-refresh tokens
- Logout flow
- Handle expired tokens

### N5.4 - Docker 🟡 🤖

- Dockerfile cho NestJS
- Docker Compose (app + database)
- Multi-stage builds
- Docker networks
- Environment variables trong Docker

**Dockerfile example:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

### N5.5 - VPS Setup 🟡

> Video 📘 Bài 219

- Chọn VPS provider (DigitalOcean, Linode, Vultr)
- SSH key setup
- Basic Linux commands
- Install Node.js, npm
- Clone repository từ GitHub
- Setup environment variables

### N5.6 - Nginx & SSL 🟡 🤖

- Install Nginx
- Reverse proxy configuration
- SSL với Let's Encrypt (certbot)
- Domain pointing

**Nginx config example:**
```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### N5.7 - PM2 🟡 🤖

- Install PM2 globally
- Start/stop/restart app
- PM2 ecosystem config
- Log management
- Auto-restart on crash
- Startup script (auto-start on reboot)

**PM2 commands:**
```bash
pm2 start dist/main.js --name "api"
pm2 logs api
pm2 restart api
pm2 save
pm2 startup
```

---

## Advanced Topics (Optional) 🟢

| Topic | Video | Ghi chú |
|-------|-------|---------|
| AWS SES | 📗 Bài 55-62 | Email service |
| Video Streaming | 📗 Bài 117-138 | HLS, media server |
| Elasticsearch | 📗 Bài 139-145 | Full-text search |
| i18n | 📗 Bài 118 | Đa ngôn ngữ |
| Cronjob | 📗 Bài 168 | Scheduled tasks |
| RBAC | 📗 Bài 85-97 | Role-based access |

---

## Learning Outcomes

Sau Module N5, bạn sẽ:

- [ ] Kết nối React frontend với NestJS API
- [ ] Quản lý state với React Query + Zustand
- [ ] Implement authentication flow hoàn chỉnh
- [ ] Containerize app với Docker
- [ ] Deploy lên VPS
- [ ] Setup Nginx reverse proxy
- [ ] SSL certificate với Let's Encrypt
- [ ] Process management với PM2

---

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
