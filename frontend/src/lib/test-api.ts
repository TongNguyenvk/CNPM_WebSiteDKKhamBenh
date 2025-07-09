// Test API connectivity
export const testApiConnection = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/';
    
    console.log('Testing API connection...');
    console.log('API URL:', apiUrl);
    console.log('Environment:', process.env.NODE_ENV);
    
    try {
        const response = await fetch(`${apiUrl}test`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('API Response Status:', response.status);
        console.log('API Response OK:', response.ok);
        
        if (response.ok) {
            const data = await response.text();
            console.log('API Response Data:', data);
            return { success: true, data };
        } else {
            console.error('API Error:', response.statusText);
            return { success: false, error: response.statusText };
        }
    } catch (error) {
        console.error('API Connection Error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Test function to call from browser console
if (typeof window !== 'undefined') {
    (window as any).testApi = testApiConnection;
}
