import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CmsDocument = Cms & Document;

@Schema({ timestamps: true })
export class Cms {
    @Prop({ required: true, index: true })
    section: string; // e.g. "hero", "about", "services"

    @Prop({ type: Object, default: {} })
    data: Record<string, any>; // flexible content structure

    @Prop({ default: 0 })
    order: number;

    @Prop({ default: true })
    published: boolean;
}

export const CmsSchema = SchemaFactory.createForClass(Cms);
