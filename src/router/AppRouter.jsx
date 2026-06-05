import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import RestablecerContrasenia from '../pages/RestablecerContrasena';
import ProtectedRoute from '../components/ProtectedRoute'; // Importamos el guardia
import MainLayout from '../components/MainLayout'; // Importamos el Layout
import Usuarios from '../pages/Usuarios';
import GestionClases from '../pages/GestionClases';
import ConversacionesClase from '../pages/ConversacionesClase';
import ConversacionesDirectas from '../pages/ConversacionesDirectas';
import ChatDirecta from '../pages/ChatDirecta';
import AsistenciasClase from '../pages/AsistenciasClase';
import AsistenciasTodasClases from '../pages/AsistenciasTodasClases';
import VisualizarAsistenciasAlumnos from '../pages/VisualizarAsistenciasAlumnos';
import GestionarAlumnosClase from '../pages/GestionarAlumnosClase';
import CambiarContrasenia from '../pages/CambiarContrasenia';
import Registro from '../pages/Registro';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas: Cualquiera sin la necesidad de hacer login puede verlas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registro />} />
                <Route path="/forgot-password" element={<RestablecerContrasenia/>} />
                
                {/*Rutas privadas: Solo se ven cuando se a iniciado sesion(token necesario)*/}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/clase/:codigo/conversaciones" element={<ConversacionesClase />} />
                        <Route path="/conversaciones-directas" element={<ConversacionesDirectas />} />
                        <Route path="/conversacion/:id" element={<ChatDirecta />} />
                        <Route path="/dashboard/clase/:codigo/mis-asistencias" element={<AsistenciasClase />} />
                        <Route path="/asistencias" element={<AsistenciasTodasClases />} />
                        <Route path="/dashboard/clase/:codigo/asistencias-alumnos" element={<VisualizarAsistenciasAlumnos />} />
                        <Route path="/dashboard/clase/:codigo/gestionar-alumnos" element={<GestionarAlumnosClase />} />
                        <Route path="/dashboard/cambiar-contrasena" element={<CambiarContrasenia />} />
                        {/* Agregaremos más aquí: */}
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/clases" element={<GestionClases />} />
                    </Route>
                </Route>

                {/* Redirecciones automáticas:En caso de error a cual pagina se retornara */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;