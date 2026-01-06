// backend/src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CmsModule } from './cms/cms.module';
import { UploadModule } from './upload/upload.module';
import { ContactMessagesModule } from './contact-messages/contact-messages.module';
import { StatsModule } from './stats/stats.module'; // ← NEW: Import StatsModule
import { VisitTrackerMiddleware } from './common/middleware/visit-tracker.middleware'; // ← NEW: Middleware for tracking visits
import { ActivityModule } from './activity/activity.module';
@Module({
  imports: [
    // Global config module to read .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Database connection (MongoDB)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),

    // App modules
    AuthModule,
    UsersModule,
    CmsModule,
    UploadModule,
    ContactMessagesModule,
    StatsModule,
    ActivityModule, // ← ADD THIS
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // ← ADD NestModule interface
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VisitTrackerMiddleware)
      .forRoutes('*'); // Apply to all routes (it will filter inside the middleware)
  }
}