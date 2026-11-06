
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AppearanceToggleTab from '@/components/appearance-tabs';

import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/50 px-4 transition-[width,height] ease-linear">
            {/* BAGIAN KIRI: SIDEBAR TRIGGER DAN BREADCRUMBS */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />

                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* BAGIAN KANAN: APPEARANCE MODE */}
            <div className="ml-auto flex shrink-0 items-center">
                <AppearanceToggleTab />
            </div>
        </header>
    );
}
