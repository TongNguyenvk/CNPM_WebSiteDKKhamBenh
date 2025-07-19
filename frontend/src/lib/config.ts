// API Configuration
export const getApiUrl = () => {
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const nodeEnv = process.env.NODE_ENV;

    // Debug logging
    if (typeof window !== 'undefined') {
        console.log('API Config Debug:', {
            NEXT_PUBLIC_API_URL: envApiUrl,
            NODE_ENV: nodeEnv,
            isClient: true
        });
    }

    // Always prioritize NEXT_PUBLIC_API_URL if set
    if (envApiUrl) {
        return envApiUrl;
    }

    // For client-side (browser)
    if (typeof window !== 'undefined') {
        // In production, use relative URL for same-origin requests
        if (nodeEnv === 'production') {
            return '/api/';
        }
        // Development fallback
        return 'http://localhost:8080/api/';
    }

    // For server-side (SSR/API routes)
    return process.env.API_URL || 'http://backend:8080/api/';
};

export const API_BASE_URL = getApiUrl();

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Other config
export const APP_CONFIG = {
    apiUrl: getApiUrl(),
    isDev: isDevelopment,
    isProd: isProduction,
    appName: 'Hệ thống Đặt khám Bệnh',
    version: '1.0.0'
};

console.log('API Config:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL: process.env.API_URL,
    finalApiUrl: getApiUrl()
});
