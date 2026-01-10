'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlState<T extends string>(key: string, defaultValue: T): [T, (value: T) => void] {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const value = (searchParams.get(key) as T) || defaultValue;

    const setValue = useCallback((newValue: T) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newValue && newValue !== defaultValue) {
            params.set(key, newValue);
        } else {
            params.delete(key);
        }
        const queryString = params.toString();
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }, [searchParams, router, pathname, key, defaultValue]);

    return [value, setValue];
}

export function useUrlStates(defaults: Record<string, string>): [
    Record<string, string>,
    (key: string, value: string) => void,
    () => void
] {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const values: Record<string, string> = {};
    Object.keys(defaults).forEach(key => {
        values[key] = searchParams.get(key) || defaults[key];
    });

    const setValue = useCallback((key: string, newValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newValue && newValue !== defaults[key]) {
            params.set(key, newValue);
        } else {
            params.delete(key);
        }
        const queryString = params.toString();
        router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    }, [searchParams, router, pathname, defaults]);

    const clearAll = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    return [values, setValue, clearAll];
}
