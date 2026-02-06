# MongoDB - Module bổ sung (Optional)

**Mục đích:** Biết thêm MongoDB để linh hoạt hơn khi xin việc (nhiều công ty VN dùng MongoDB)
**Khi nào học:** Sau khi đã vững PostgreSQL, hoặc khi job yêu cầu

---

## Tại sao nên biết MongoDB?

| Lý do | Chi tiết |
|-------|----------|
| **Job market VN** | Nhiều startup/công ty dùng MERN/MEAN stack |
| **Flexibility** | Phù hợp với data không có schema cố định |
| **Phổ biến** | Top 5 database được dùng nhiều nhất |

---

## Module M.1 - MongoDB Fundamentals

### Session M.1.1: MongoDB là gì

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Hiểu NoSQL và khi nào dùng MongoDB |

**Kiến thức cần học:**
- [ ] SQL vs NoSQL - khác biệt chính
- [ ] Document-based database là gì
- [ ] Khi nào chọn MongoDB vs PostgreSQL
- [ ] BSON format
- [ ] Collections vs Tables

**So sánh nhanh:**
```
PostgreSQL          MongoDB
─────────────       ─────────────
Database      →     Database
Table         →     Collection
Row           →     Document
Column        →     Field
JOIN          →     Embed / $lookup
```

---

### Session M.1.2: Setup MongoDB

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Cài đặt và kết nối MongoDB |

**Options:**
- [ ] MongoDB Atlas (cloud - recommended cho học)
- [ ] MongoDB local với Docker
- [ ] MongoDB Compass (GUI tool)

**Kết nối từ Node.js:**
```typescript
// Native driver
import { MongoClient } from 'mongodb';
const client = new MongoClient('mongodb+srv://...');

// Hoặc Mongoose (ODM)
import mongoose from 'mongoose';
mongoose.connect('mongodb+srv://...');
```

---

### Session M.1.3: CRUD Operations

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Thao tác cơ bản với MongoDB |

**Kiến thức cần học:**
- [ ] insertOne, insertMany
- [ ] find, findOne với query operators
- [ ] updateOne, updateMany
- [ ] deleteOne, deleteMany
- [ ] Query operators: $eq, $gt, $lt, $in, $regex

**Code example:**
```typescript
// Insert
await db.collection('users').insertOne({ name: 'John', age: 25 });

// Find với filter
await db.collection('users').find({ age: { $gte: 18 } }).toArray();

// Update
await db.collection('users').updateOne(
  { name: 'John' },
  { $set: { age: 26 } }
);
```

---

## Module M.2 - MongoDB với NestJS

### Session M.2.1: Mongoose trong NestJS

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Dùng Mongoose ODM trong NestJS |
| **Thư viện** | `@nestjs/mongoose`, `mongoose` |

**Kiến thức cần học:**
- [ ] Schema definition với decorators
- [ ] @Schema, @Prop decorators
- [ ] InjectModel trong Service
- [ ] Virtual fields
- [ ] Middleware (pre/post hooks)

**Code example:**
```typescript
// user.schema.ts
@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// user.service.ts
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }
}
```

---

### Session M.2.2: Relations trong MongoDB

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Xử lý quan hệ giữa các documents |

**2 cách tiếp cận:**

**1. Embedding (Nhúng trực tiếp):**
```typescript
// User có nhiều addresses
{
  name: "John",
  addresses: [
    { city: "HCM", street: "123 ABC" },
    { city: "HN", street: "456 DEF" }
  ]
}
```

**2. Referencing (Tham chiếu):**
```typescript
// User reference đến Posts
@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
posts: Post[];

// Populate khi query
await this.userModel.findById(id).populate('posts');
```

**Khi nào dùng gì:**
| Embedding | Referencing |
|-----------|-------------|
| Data nhỏ, ít thay đổi | Data lớn, thay đổi thường xuyên |
| Đọc nhiều | Ghi nhiều |
| 1-to-few | 1-to-many, many-to-many |

---

## Module M.3 - MongoDB Advanced 🔶 HỌC SAU

### Session M.3.1: Aggregation Pipeline

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Query phức tạp với aggregation |
| **Priority** | 🔶 Học sau khi đã vững CRUD |

**Các stages phổ biến:**
- [ ] $match - filter documents
- [ ] $group - group by field
- [ ] $project - chọn fields
- [ ] $lookup - join collections
- [ ] $sort, $limit, $skip
- [ ] $unwind - flatten arrays

**Code example:**
```typescript
// Đếm số tweets theo user
await db.collection('tweets').aggregate([
  { $match: { createdAt: { $gte: lastMonth } } },
  { $group: { _id: '$userId', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
]).toArray();
```

---

### Session M.3.2: Indexing 🔶 HỌC SAU

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Tối ưu query performance |
| **Priority** | 🔶 Học khi app chậm hoặc data lớn |

**Kiến thức cần học:**
- [ ] Single field index
- [ ] Compound index
- [ ] Text index (full-text search)
- [ ] Unique index
- [ ] explain() để debug query

**Code example:**
```typescript
// Tạo index
await db.collection('users').createIndex({ email: 1 }, { unique: true });
await db.collection('posts').createIndex({ title: 'text', content: 'text' });

// Compound index
await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
```

---

### Session M.3.3: Schema Validation 🔶 HỌC SAU

| Nội dung | Chi tiết |
|----------|----------|
| **Mục tiêu** | Validate data ở database level |
| **Priority** | 🔶 Optional, Mongoose đã validate rồi |

---

## Learning Outcomes

Sau khi hoàn thành MongoDB module:

**Cần biết (Core):**
- [ ] Hiểu SQL vs NoSQL, khi nào dùng MongoDB
- [ ] CRUD operations cơ bản
- [ ] Dùng Mongoose trong NestJS
- [ ] Embedding vs Referencing

**Học sau (Advanced):**
- [ ] Aggregation Pipeline
- [ ] Indexing và optimization
- [ ] Schema Validation
- [ ] Transactions

---

## Resources

- [MongoDB University](https://university.mongodb.com/) - Khóa học miễn phí
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [NestJS Mongoose](https://docs.nestjs.com/techniques/mongodb)
