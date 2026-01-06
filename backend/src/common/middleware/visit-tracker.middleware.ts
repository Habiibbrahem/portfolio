// backend/src/common/middleware/visit-tracker.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VisitService } from '../../stats/visit.service';

@Injectable()
export class VisitTrackerMiddleware implements NestMiddleware {
    constructor(private visitService: VisitService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // Only track GET requests to public routes (not admin/api/auth)
        if (
            req.method === 'GET' &&
            !req.originalUrl.startsWith('/api/auth') &&
            !req.originalUrl.startsWith('/api/cms') &&
            !req.originalUrl.startsWith('/api/stats') &&
            !req.originalUrl.startsWith('/api/contact') &&
            !req.originalUrl.includes('/admin')
        ) {
            // Fire and forget - don't await to avoid slowing down response
            this.visitService.increment().catch(() => { });
        }
        next();
    }
}