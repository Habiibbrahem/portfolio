// backend/src/activity/activity.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ActivityLog extends Document {
    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    type: string; // e.g., 'service_add', 'news_delete', 'message'

    @Prop()
    details?: string; // optional extra info
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);