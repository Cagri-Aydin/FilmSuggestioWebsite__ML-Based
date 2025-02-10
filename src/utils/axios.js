import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5050',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Debug için
instance.interceptors.request.use(request => {
    console.log('Gönderilen istek:', {
        method: request.method,
        url: request.url,
        data: request.data
    });
    return request;
});

instance.interceptors.response.use(
    response => response,
    error => {
        console.error('API Hatası:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

export default instance; 