// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ← IMPORT ConfigModule
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken, RefreshTokenSchema } from './schema/refresh-token.schema';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigModule, // ← ADD THIS
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'default-secret',
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: RefreshToken.name, schema: RefreshTokenSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenService],
    exports: [AuthService],
})
export class AuthModule { }