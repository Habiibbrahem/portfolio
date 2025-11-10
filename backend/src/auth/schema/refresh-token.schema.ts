// src/auth/schema/refresh-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
    // ADD type: String
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    token: string;

    @Prop({ type: Date, required: true })
    expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);