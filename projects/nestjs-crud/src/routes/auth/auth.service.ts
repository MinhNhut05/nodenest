import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../shared/services/prisma.service";
import { HashingService } from "../../shared/services/hashing.service";
import { RegisterDto, RegisterResponseSchema } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashing: HashingService
    ) {}
    async register(body: RegisterDto){
        const {email, name, password} = body
        const hassedPassword = this.hashing.hash(password)    
        const user = await this.prisma.user.create({
            data:{
                email,
                name,
                password: hassedPassword
            }
        })
        return RegisterResponseSchema.parse(user)
    }

}