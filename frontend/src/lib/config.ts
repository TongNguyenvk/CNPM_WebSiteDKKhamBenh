// API Configuration
const normalize = (url: string) => {
    if (!url) return url;
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const getApiUrl = () => {
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const nodeEnv = process.env.NODE_ENV;
    const apiUrlSrv = process.env.API_URL;

    // If explicitly provided, use it (normalize to no trailing slash)
    if (envApiUrl) return normalize(envApiUrl);

    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
        // Detect "local docker" scenario: hostname = localhost or 127.* and production build used
        const host = window.location.hostname;
        const isLocalHostName = /^(localhost|127\.|0\.0\.0\.0)/.test(host);

        if (nodeEnv === 'production' && !isLocalHostName) {
            // Real production behind reverse proxy (nginx) -> relative path keeps same origin HTTPS
            return '/api';
        }
        // Local development (docker or standalone) fallback
        // Use explicit http to avoid accidental https on non‑TLS backend
        return 'http://localhost:8080/api';
    }

    // Server side (SSR) inside container: prefer API_URL then fallback to service name
    return normalize(apiUrlSrv || 'http://backend:8080/api');
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
