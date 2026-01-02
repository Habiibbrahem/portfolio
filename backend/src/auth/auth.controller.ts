// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @Post('refresh')
    @HttpCode(200)
    async refresh(@Body() body: { refresh_token: string }) {
        return this.authService.refreshToken(body.refresh_token);
    }

    // NEW: Change Password Endpoint
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async changePassword(
        @Request() req,
        @Body() body: { currentPassword: string; newPassword: string },
    ) {
        await this.authService.changePassword(
            req.user.userId,
            body.currentPassword,
            body.newPassword,
        );
        return { message: 'Password changed successfully' };
    }
}