// src/context/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // Importas la constante
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCargando(false);
                return;
            }
            try {
                const data = await authService.perfil();
                setAuth(data);
            } catch { 
                localStorage.removeItem('token');
                setAuth({});
            } finally {
                setCargando(false);
            }
        };
        autenticarUsuario();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, cargando, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};