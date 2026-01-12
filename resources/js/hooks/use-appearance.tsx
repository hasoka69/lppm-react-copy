import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (appearance: Appearance) => {
    // FORCE LIGHT MODE: Always remove 'dark' class
    document.documentElement.classList.remove('dark');
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    // FORCE LIGHT MODE
    applyTheme('light');
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = (mode: Appearance) => {
        // Do nothing or forcedly set to light if needed, but for UI consistnecy checking:
        setAppearance('light');
        localStorage.setItem('appearance', 'light');
        applyTheme('light');
    };

    useEffect(() => {
        // Force update on mount
        updateAppearance('light');
    }, []);

    return { appearance: 'light', updateAppearance };
}
