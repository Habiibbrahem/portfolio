// backend/src/stats/stats.controller.ts
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) { }

    // Admin only: full overview with all stats
    @Get('overview')
    @UseGuards(JwtAuthGuard)
    async getOverview() {
        return this.statsService.getOverview();
    }

    // Public: called from frontend to record a visit
    @Post('visit')
    async recordVisit() {
        await this.statsService.recordVisit();
        return { success: true };
    }
}