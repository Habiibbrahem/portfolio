// backend/src/contact-messages/contact-messages.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactMessage, ContactMessageSchema } from './contact-message.schema';
import { ContactMessagesService } from './contact-messages.service';
import { ContactMessagesController } from './contact-messages.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ContactMessage.name, schema: ContactMessageSchema }])
    ],
    controllers: [ContactMessagesController],
    providers: [ContactMessagesService],
    exports: [ContactMessagesService], // ← ADD THIS LINE
})
export class ContactMessagesModule { }