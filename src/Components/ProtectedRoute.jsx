import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Revisamos si existe el token en el almacenamiento local
    const token = localStorage.getItem('token');

    // Si no hay token, redirigimos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, permitimos el acceso a las rutas hijas (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;