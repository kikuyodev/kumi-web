export interface ApiNewsArticle {
    id: number;
    slug: string;
    title: string;
    posted_at: string;
    author: string;
    content?: string;
    headline: string;
    banner: string;
}