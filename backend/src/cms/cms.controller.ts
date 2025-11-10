// src/cms/cms.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateCmsDto } from './dto/create-cms.dto';
import { UpdateCmsDto } from './dto/update-cms.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cms')
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

    @Get()
    findAll() {
        return this.cmsService.findAll();
    }

    @Get(':section')
    findOne(@Param('section') section: string) {
        return this.cmsService.findBySection(section);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createDto: CreateCmsDto) {
        return this.cmsService.create(createDto);
    }

    @Patch(':section')
    @UseGuards(JwtAuthGuard)
    update(@Param('section') section: string, @Body() updateDto: UpdateCmsDto) {
        return this.cmsService.updateBySection(section, updateDto);
    }

    @Delete(':section')
    @UseGuards(JwtAuthGuard)
    remove(@Param('section') section: string) {
        return this.cmsService.removeBySection(section);
    }

    // REORDER — FIXED & INSIDE CLASS
    @Post('reorder')
    @UseGuards(JwtAuthGuard)
    async reorder(@Body() body: { sections: { id: string; order: number }[] }) {
        await this.cmsService.reorder(body.sections);
        return { success: true };
    }
}