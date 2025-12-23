import { Controller, Post, Body, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { ContactMessagesService } from './contact-messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contact-messages')
export class ContactMessagesController {
    constructor(private readonly service: ContactMessagesService) { }

    @Post()
    async create(@Body() body: { name: string; email: string; phone: string; message: string }) {
        return this.service.create(body);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.service.findAll();
    }
    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    async markAsRead(@Param('id') id: string) {
        return this.service.markAsRead(id);
    }

    @Get('unread-count')
    @UseGuards(JwtAuthGuard)
    async getUnreadCount() {
        return { count: await this.service.getUnreadCount() };
    }
}