// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private refreshTokenService: RefreshTokenService,
    ) { }

    async register(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create({ email, password: hashedPassword });
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userId = String(user._id);

        const payload = {
            sub: userId,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        // FIX: Use any to bypass strict typing
        const refreshTokenExpiresIn: any = this.configService.get('REFRESH_TOKEN_EXPIRES_IN') ?? '7d';

        const refreshTokenOptions: JwtSignOptions = {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'default-refresh-secret',
            expiresIn: refreshTokenExpiresIn,
        };

        const refreshToken = this.jwtService.sign(payload, refreshTokenOptions);

        await this.refreshTokenService.create(userId, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') || 'default-refresh-secret',
            }) as { email: string; sub: string; role: string };

            const storedToken = await this.refreshTokenService.findByToken(refreshToken);
            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            const user = await this.usersService.findByEmail(payload.email);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const userId = String(user._id);
            const newPayload = { sub: userId, email: user.email, role: user.role };
            const newAccessToken = this.jwtService.sign(newPayload);

            return { access_token: newAccessToken };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}