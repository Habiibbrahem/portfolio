// src/api/cms.ts
import api from './client.ts';
import type { CmsSection, NavbarItem } from '../types/cms.ts';

export const getNavbar = async (): Promise<CmsSection> => {
    try {
        const { data } = await api.get('/cms/navbar');
        return data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            const { data } = await api.post('/cms', {
                section: 'navbar',
                data: { items: [] },
                published: true,
            });
            return data;
        }
        throw err;
    }
};

export const getHero = async (): Promise<CmsSection> => {
    try {
        const { data } = await api.get('/cms/hero');
        return data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            const { data } = await api.post('/cms', {
                section: 'hero',
                data: {
                    title: 'Building Dreams',
                    subtitle: 'Excellence Since 2010',
                    content: '<p>We deliver quality construction on time.</p>',
                    backgroundImage: ''
                },
                published: true,
            });
            return data;
        }
        throw err;
    }
};

export const getSections = async (): Promise<CmsSection[]> => {
    try {
        const { data } = await api.get('/cms/sections');
        return data || [];
    } catch (err: any) {
        console.warn('Sections not found yet — returning empty');
        return [];
    }
};

export const updateNavbar = async (items: NavbarItem[]): Promise<CmsSection> => {
    const { data } = await api.patch('/cms/navbar', { data: { items } });
    return data;
};

export const updateHero = async (heroData: Record<string, any>): Promise<CmsSection> => {
    const { data } = await api.patch('/cms/hero', { data: heroData });
    return data;
};

// NEW: Generic update for any section
export const updateSection = async (section: string, sectionData: Record<string, any>): Promise<CmsSection> => {
    const { data } = await api.patch(`/cms/${section}`, { data: sectionData });
    return data;
};