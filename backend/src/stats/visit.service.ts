// backend/src/stats/visit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit } from './visit.schema';

@Injectable()
export class VisitService {
    constructor(@InjectModel(Visit.name) private visitModel: Model<Visit>) { }

    async increment(): Promise<number> {
        const counter = await this.visitModel.findOneAndUpdate(
            {}, // find the single document
            { $inc: { total: 1 } },
            { upsert: true, new: true }, // create if not exists
        );
        return counter.total;
    }

    async getTotal(): Promise<number> {
        const doc = await this.visitModel.findOne();
        return doc ? doc.total : 0;
    }
}