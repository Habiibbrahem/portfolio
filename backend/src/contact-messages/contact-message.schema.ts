// backend/src/contact-messages/contact-message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContactMessage extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ required: true })
    message: string;

    @Prop({ type: Boolean, default: false })
    read: boolean;
}

// ← CHANGE THIS TO NAMED EXPORT
export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);