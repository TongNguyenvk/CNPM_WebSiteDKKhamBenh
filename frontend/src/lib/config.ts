// API Configuration
export const getApiUrl = () => {
    // For client-side (browser)
    if (typeof window !== 'undefined') {
        // Always prioritize NEXT_PUBLIC_API_URL if set
        if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL;
        }

        // Fallback: auto-detect based on current host
        if (process.env.NODE_ENV === 'production') {
            const currentHost = window.location.hostname;
            const protocol = window.location.protocol;
            return `${protocol}//${currentHost}:8080/api/`;
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
