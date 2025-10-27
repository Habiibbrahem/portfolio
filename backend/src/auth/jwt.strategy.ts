// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
        });
    }

    async validate(payload: { sub: string; username: string; role: string }) {
        // Fetch user to ensure it still exists (optional but secure)
        const user = await this.usersService.findByUsername(payload.username);
        if (!user) {
            return null; // This will trigger 401
        }

        // MUST RETURN `role` so RolesGuard can read it
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role, // THIS IS THE KEY
        };
    }
}