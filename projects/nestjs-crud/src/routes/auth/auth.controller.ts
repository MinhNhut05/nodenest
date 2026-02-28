import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post("register")
    async register(@Body() body: RegisterDto){
        return this.authService.register(body)
    }
}