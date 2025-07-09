// API Configuration
export const getApiUrl = () => {
    // For client-side (browser)
    if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/';
    }
    
    // For server-side (SSR/API routes)
    return process.env.API_URL || 'http://localhost:8080/api/';
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
