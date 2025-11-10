// src/types/cms.ts
export type SectionType =
    | 'hero'
    | 'about'
    | 'services'
    | 'projects'
    | 'gallery'
    | 'team'
    | 'testimonials'
    | 'contact'
    | 'cta';

export interface CmsSection {
    _id: string;
    section: string;
    data: Record<string, any>;
    order: number;
    published: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface NavbarItem {
    id: string;
    label: string;
    link: string;
    order: number;
    published?: boolean;
}