// src/seed-admin.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@construct.com';
    const existingAdmin = await usersService.findByEmail(adminEmail); // ← Use findByEmail

    if (existingAdmin) {
        console.log('Admin already exists');
        await app.close();
        return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersService.create({
        email: adminEmail,        // ← Use email
        password: hashedPassword,
        role: 'admin',
    });

    console.log('Admin created:');
    console.log('   email: admin@construct.com');
    console.log('   password: admin123');
    await app.close();
}

bootstrap().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});