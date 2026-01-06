// backend/src/activity/activity.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog } from './activity.schema';

@Injectable()
export class ActivityService {
    constructor(@InjectModel(ActivityLog.name) private model: Model<ActivityLog>) { }

    async log(text: string, type: string, details?: string) {
        const log = new this.model({ text, type, details });
        return log.save();
    }

    async getRecent(limit = 7) {
        return this.model.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
    }
}