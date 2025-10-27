// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: { username: string; password: string; role?: string }) {
        const user = new this.userModel({
            ...createUserDto,
            role: createUserDto.role || 'admin', // default to admin
        });
        return user.save();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async findOne(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }
}