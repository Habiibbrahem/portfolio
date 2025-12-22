export type SectionType =
    | 'hero'
    | 'about'
    | 'services'
    | 'projects'
    | 'gallery'
    | 'team'
    | 'testimonials'
    | 'contact'
    | 'cta'
    | 'expertise'
    | 'process'
    | 'safety'
    | 'clients';

export interface CmsSection {
    _id: string;
    section: string;
    data: {
        title?: string;
        subtitle?: string;
        content?: string;
        backgroundImage?: string;           // kept for backward compatibility
        backgroundImages?: string[];        // NEW: array for carousel
        carouselInterval?: number;          // NEW: autoplay speed in ms
        showOverlayText?: boolean;          // NEW: optional hide text
        background?: 'default' | 'secondary';
        items?: Array<{
            title: string;
            description: string;
            icon?: string;
            image?: string;
        }>;
        [key: string]: any;
    };
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
    external?: boolean;
}