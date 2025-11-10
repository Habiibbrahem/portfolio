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
        backgroundImage?: string;
        background?: 'default' | 'secondary';
        items?: Array<{
            title: string;
            description: string;
            icon?: string;
            image?: string;
        }>;
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