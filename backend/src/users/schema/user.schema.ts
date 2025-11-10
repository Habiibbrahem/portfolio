// src/users/schema/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, required: false, unique: true, sparse: true })
    email?: string;

    @Prop({ type: String, required: false, unique: true, sparse: true })
    username?: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: String, default: 'user' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);