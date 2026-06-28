import { renderBrandHeader, type BrandHeaderOptions } from "./site-nav";

export type ToolBrandHeaderOptions = BrandHeaderOptions & {
    /** Tool-Name statt „Meine kostenlosen Tools & Projekte“ */
    title: string;
};

/** Hub-Brand für Tool-Seiten: eno.rocks · » Tool · Menü */
export function renderToolBrandHeader(options: ToolBrandHeaderOptions): string {
    return renderBrandHeader({
        title: options.title,
        wordmarkTag: "p",
    });
}
