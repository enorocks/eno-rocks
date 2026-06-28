const SPRITE_URL = '/shared/vendor/lucide/sprite.svg';

export type LucideIconOptions = {
    name: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

/** Lucide-Sprite (lokal). Icon-Namen: lucide.dev/icons oder shared/vendor/lucide/icon-names.json */
export function renderLucideIcon(options: LucideIconOptions): string {
    const { name, className = '', size = 'md' } = options;
    const sizeClass = size === 'md' ? 'eno-icon' : `eno-icon eno-icon--${size}`;
    const classes = [sizeClass, className].filter(Boolean).join(' ');

    return `<svg class="${classes}" aria-hidden="true"><use href="${SPRITE_URL}#${name}"></use></svg>`;
}
