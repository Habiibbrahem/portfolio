// backend/src/stats/visit.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Visit extends Document {
    @Prop({ required: true, default: 0 })
    total: number;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);