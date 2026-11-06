
import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'appearance';

function getSystemAppearance(): 'light' | 'dark' {
    if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        return 'dark';
    }

    return 'light';
}

function applyAppearance(appearance: Appearance) {
    if (typeof document === 'undefined') return;

    const resolved =
        appearance === 'system'
            ? getSystemAppearance()
            : appearance;

    document.documentElement.classList.toggle(
        'dark',
        resolved === 'dark',
    );

    document.documentElement.style.colorScheme = resolved;
}

function getSavedAppearance(): Appearance {
    if (typeof window === 'undefined') return 'system';

    const saved = localStorage.getItem(STORAGE_KEY);

    if (
        saved === 'light' ||
        saved === 'dark' ||
        saved === 'system'
    ) {
        return saved;
    }

    return 'system';
}

export function initializeAppearance() {
    applyAppearance(getSavedAppearance());
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(
        getSavedAppearance,
    );

    useEffect(() => {
        applyAppearance(appearance);

        const mediaQuery = window.matchMedia(
            '(prefers-color-scheme: dark)',
        );

        const handleSystemChange = () => {
            if (getSavedAppearance() === 'system') {
                applyAppearance('system');
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);

        return () => {
            mediaQuery.removeEventListener(
                'change',
                handleSystemChange,
            );
        };
    }, [appearance]);

    const updateAppearance = (value: Appearance) => {
        localStorage.setItem(STORAGE_KEY, value);
        setAppearance(value);
        applyAppearance(value);
    };

    return {
        appearance,
        updateAppearance,
    };
}
