// backend/src/stats/stats.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Visit, VisitSchema } from './visit.schema';
import { CmsModule } from '../cms/cms.module';
import { ContactMessagesModule } from '../contact-messages/contact-messages.module'; // ← CORRECT PATH
import { VisitService } from './visit.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
        CmsModule,
        ContactMessagesModule, // ← MUST BE HERE
    ],
    controllers: [StatsController],
    providers: [StatsService, VisitService],
    exports: [VisitService],
})
export class StatsModule { }