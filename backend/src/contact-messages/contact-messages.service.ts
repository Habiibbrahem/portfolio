import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage } from './contact-message.schema';

@Injectable()
export class ContactMessagesService {
    constructor(@InjectModel(ContactMessage.name) private model: Model<ContactMessage>) { }

    async create(data: { name: string; email: string; phone: string; message: string }) {
        const message = new this.model(data);
        return message.save();
    }

    async findAll() {
        return this.model.find().sort({ createdAt: -1 }).exec();
    }
    async markAsRead(id: string) {
        return this.model.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    }

    async getUnreadCount() {
        return this.model.countDocuments({ read: false }).exec();
    }
}