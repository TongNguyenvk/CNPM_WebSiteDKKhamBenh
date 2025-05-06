'use client';
import { useState, useEffect } from 'react';
import { getCurrentUser, LoginResponse } from '../lib/api';

export function useAuth() {
    const [user, setUser] = useState<LoginResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getCurrentUser();
        setUser(user);
        setLoading(false);
    }, []);

    return { user, loading };
}