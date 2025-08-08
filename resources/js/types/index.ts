import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    username: string;
    osu_id: number;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Queue {
    id: number;
    name: string;
    short_description: string;
    description: string;
    image: string;
    request_information: string;
    status: string;
    type: string;
    user: User;
    user_id: number;
    members: User[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginationLink {
    active: boolean;
    label: string;
    url: string | undefined;
}
export interface PaginatedData<T = unknown> {
    current_page: number | null;
    data: T[] | null;
    first_page_url: string | null;
    last_page_url: string | null;
    last_page: number | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string | null;
    per_page: number | null;
    prev_page_url: string | null;
    from: string | null;
    to: string | null;
    total: number | null;
    [key: string]: unknown;
}

export interface NominatorResponse {
    id: number;
    nominator_id: number;
    nominator: User;
    request_id: number;
    status: string;
    comment: string;
}

export interface Beatmap {
    id: number;
    queue: Queue;
    author: User;
    comment: string;
    beatmapset_id: number;
    title: string;
    artist: string;
    creator: string;
    cover: string | null;
    genre: string | null;
    language: string | null;
    bpm: number | null;
    status: string;
    is_ranked: boolean;
    ranked_at: string | null;
    responses: NominatorResponse[];
}

export interface BeatmapsFiltersInterface {
    query: string;
    status: string;
    genre: string;
    language: string;
}