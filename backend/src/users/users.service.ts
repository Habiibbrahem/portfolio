// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) { }
    // ↑ Made it public so AuthService can use it if needed (but we'll use a method instead)

    async create(createUserDto: { email?: string; username?: string; password: string; role?: string }) {
        const user = new this.userModel({
            ...createUserDto,
            role: createUserDto.role || 'admin',
        });
        return user.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async findOne(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    // NEW: Proper method to update password
    async updatePassword(userId: string, hashedPassword: string): Promise<void> {
        await this.userModel.updateOne({ _id: userId }, { password: hashedPassword });
    }
}