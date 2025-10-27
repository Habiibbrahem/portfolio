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
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cms')
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

    // Public: fetch all sections
    @Get()
    findAll() {
        return this.cmsService.findAll();
    }

    // Public: fetch one section by name
    @Get(':section')
    findOne(@Param('section') section: string) {
        return this.cmsService.findBySection(section);
    }

    // Admin: create new content section
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createDto: CreateCmsDto) {
        return this.cmsService.create(createDto);
    }

    // Admin: update existing section
    @Patch(':section')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    update(@Param('section') section: string, @Body() updateDto: UpdateCmsDto) {
        return this.cmsService.updateBySection(section, updateDto);
    }

    // Admin: delete section
    @Delete(':section')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    remove(@Param('section') section: string) {
        return this.cmsService.removeBySection(section);
    }
}
