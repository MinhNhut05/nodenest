// src/shared/shared.module.ts
import { Module, Global } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import {ConfigModule} from '@nestjs/config'
import {envValidate} from './config/env.config'
import {HashingService} from './services/hashing.service'
// ============================================
// TODO: Tạo SharedModule
// Gợi ý:
//   1. Thêm decorator @Global() → toàn app dùng được, không cần import từng module
//   2. Thêm decorator @Module({...})
//   3. Trong @Module:
//      - providers: [PrismaService]   ← đăng ký service
//      - exports:   [PrismaService]   ← cho phép module khác dùng
//
// Lưu ý: PHẢI có cả providers VÀ exports
//   - Chỉ có providers → chỉ dùng nội bộ SharedModule
//   - Có exports → module khác inject PrismaService được
// ============================================
@Global()
@Module({
    imports:[
        ConfigModule.forRoot({
          isGlobal:true,
          validate:envValidate,
          expandVariables:true,  
        })
    ],
    providers:[PrismaService, HashingService],
    exports:[PrismaService, HashingService]
})
export class SharedModule {}