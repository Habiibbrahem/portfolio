// src/cms/cms.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cms, CmsSchema } from './schema/cms.schema';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Cms.name, schema: CmsSchema }])],
    controllers: [CmsController],
    providers: [CmsService],
    exports: [CmsService],
})
export class CmsModule { }