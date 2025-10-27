// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CmsModule } from './cms/cms.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // ✅ Global config module to read .env
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Database connection (MongoDB)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),

    // ✅ Serve uploaded files statically
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // folder path
      serveRoot: '/uploads', // route prefix
    }),

    // ✅ App modules
    AuthModule,
    UsersModule,
    CmsModule,
    UploadModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
