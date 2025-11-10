// src/cms/schema/cms.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CmsDocument = Cms & Document;

@Schema({ timestamps: true })
export class Cms {
    @Prop({ type: String, required: true })
    section: string;

    @Prop({ type: Object, required: true })
    data: Record<string, any>;

    @Prop({ type: Number, default: 0 })
    order: number;

    @Prop({ type: Boolean, default: false })
    published: boolean;
}

export const CmsSchema = SchemaFactory.createForClass(Cms);