// backend/src/stats/stats.service.ts
import { Injectable } from '@nestjs/common';
import { CmsService } from '../cms/cms.service';
import { ContactMessagesService } from '../contact-messages/contact-messages.service';
import { VisitService } from './visit.service';

@Injectable()
export class StatsService {
    constructor(
        private cmsService: CmsService,
        private contactMessagesService: ContactMessagesService,
        private visitService: VisitService,
    ) { }

    private formatTimeAgo(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
        return date.toLocaleDateString();
    }

    private parseTimeAgoToSeconds(timeAgo: string): number {
        if (timeAgo === 'just now') return 0;
        const match = timeAgo.match(/(\d+) (\w+) ago/);
        if (!match) return Infinity;
        const num = parseInt(match[1], 10);
        const unit = match[2].replace(/s$/, '');
        switch (unit) {
            case 'minute': return num * 60;
            case 'hour': return num * 3600;
            case 'day': return num * 86400;
            default: return Infinity;
        }
    }

    async getOverview() {
        const siteVisits = await this.visitService.getTotal();

        // Active Services
        let activeServices = 0;
        let servicesSection: any = null;
        try {
            servicesSection = await this.cmsService.findBySection('services');
            if (servicesSection?.data?.services && Array.isArray(servicesSection.data.services)) {
                activeServices = servicesSection.data.services.length;
            }
        } catch (e) {
            activeServices = 0;
        }

        // Messages
        const allMessages = await this.contactMessagesService.findAll();
        const newMessages = allMessages.filter((m: any) => !m.read).length;

        // Recent Activity - simple and clean
        const recentActivities: { text: string; time: string; color: string }[] = [];

        // Contact messages
        allMessages.forEach((m: any) => {
            recentActivities.push({
                text: `Message received from ${m.name}`,
                time: this.formatTimeAgo(new Date(m.createdAt)),
                color: 'info',
            });
        });

        // CMS updates
        const recentCms = await this.cmsService.findAll();
        recentCms.forEach((c: any) => {
            const date = c.updatedAt ? new Date(c.updatedAt) : new Date(c.createdAt);
            let text = `Updated "${c.section}" section`;

            if (c.section === 'services') {
                text = `Updated services (${activeServices} items)`;
            } else if (c.section === 'news') {
                text = 'Updated news section';
            } else if (c.section === 'social') {
                text = 'Updated social section';
            } else if (c.section === 'contact') {
                text = 'Updated contact section';
            } else if (c.section === 'navbar') {
                text = 'Updated navbar section';
            } else if (c.section === 'hero') {
                text = 'Updated hero section';
            }

            recentActivities.push({
                text,
                time: this.formatTimeAgo(date),
                color: 'warning',
            });
        });

        // Sort newest first
        recentActivities.sort((a, b) =>
            this.parseTimeAgoToSeconds(a.time) - this.parseTimeAgoToSeconds(b.time)
        );

        const finalActivities = recentActivities.slice(0, 20);

        return {
            siteVisits,
            activeServices,
            messages: { new: newMessages },
            recentActivities: finalActivities,
        };
    }

    async recordVisit() {
        await this.visitService.increment();
    }
}