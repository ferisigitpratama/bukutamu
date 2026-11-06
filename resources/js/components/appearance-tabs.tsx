import { Monitor, Moon, Sun } from 'lucide-react';

import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';

import { cn } from '@/lib/utils';

const tabs: {
    value: Appearance;
    icon: typeof Sun;
    label: string;
}[] = [
    {
        value: 'light',
        icon: Sun,
        label: 'Light',
    },
    {
        value: 'dark',
        icon: Moon,
        label: 'Dark',
    },
    {
        value: 'system',
        icon: Monitor,
        label: 'System',
    },
];

interface Props {
    className?: string;
}

export default function AppearanceToggleTab({
    className,
}: Props) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm',
                className,
            )}
        >
            {tabs.map(({ value, icon: Icon, label }) => {
                const active = appearance === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        aria-label={`Gunakan tema ${label}`}
                        aria-pressed={active}
                        title={label}
                        className={cn(
                            'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-all',
                            active
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />

                        <span className="hidden sm:inline">
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}