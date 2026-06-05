import axios from 'axios';

const clienteAxios = axios.create({
    // Aquí pones la URL de tu API de Node.js
    baseURL: import.meta.env.VITE_BACKEND_URL || 'https://educatio-backend-fna5hxh3avdgcjfy.westus-01.azurewebsites.net/api'
});

// INTERCEPTOR: Antes de que salga cualquier petición hacia el backend...
clienteAxios.interceptors.request.use(
    (config) => {
        // Buscamos el token en el localStorage (donde lo guardaremos al loguearnos)
        const token = localStorage.getItem('token');
        
        if (token) {
            // Si el token existe, lo añadimos a las cabeceras,tal como lo espera tu auth.middleware.js en el backend
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default clienteAxios;