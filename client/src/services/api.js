import axios from 'axios';


// Creating an axios instances with base configuration
const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_KEY || 'http://localhost:5000/api',
        headers: {
            'Content-Type': 'application/json'
        }
    }
)

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)


// Response interceptor -> handle error globally

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

        return Promise.reject(error);
    }
)



export default api;