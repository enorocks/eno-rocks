import type { GuideFormat, GuidePost } from './types';
import { RECIPE_POSTS } from './posts/recipes';
import { THOUGHTS_POSTS } from './posts/thoughts';
import { TIP_POSTS } from './posts/tips';
import { TOPLIST_POSTS } from './posts/toplists';

export const GUIDE_POSTS: GuidePost[] = [
    ...TOPLIST_POSTS,
    ...RECIPE_POSTS,
    ...THOUGHTS_POSTS,
    ...TIP_POSTS,
];

export function findPostById(id: string): GuidePost | undefined {
    return GUIDE_POSTS.find((post) => post.id === id);
}

export function postsForFormat(format: GuideFormat): GuidePost[] {
    return GUIDE_POSTS.filter((post) => post.format === format);
}

export function countByFormat(): Record<GuideFormat, number> {
    return {
        toplist: postsForFormat('toplist').length,
        recipe: postsForFormat('recipe').length,
        thoughts: postsForFormat('thoughts').length,
        tip: postsForFormat('tip').length,
    };
}
