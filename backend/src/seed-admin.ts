// src/seed-admin.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';           // correct
import { UsersService } from './users/users.service'; // correct
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const existingAdmin = await usersService.findByUsername('admin');
    if (existingAdmin) {
        console.log('Admin already exists');
        await app.close();
        return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersService.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
    });

    console.log('Admin created:');
    console.log('   username: admin');
    console.log('   password: admin123');
    await app.close();
}

bootstrap().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});