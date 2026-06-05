import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from 'src/pages/Login';
import Dashboard from 'src/pages/Dashboard';
import RestablecerContrasenia from 'src/pages/RestablecerContrasena';
import ProtectedRoute from 'src/components/ProtectedRoute'; // Importamos el guardia
import MainLayout from 'src/components/MainLayout'; // Importamos el Layout
import Usuarios from 'src/pages/Usuarios';
import GestionClases from 'src/pages/GestionClases';
import ConversacionesClase from 'src/pages/ConversacionesClase';
import ConversacionesDirectas from 'src/pages/ConversacionesDirectas';
import ChatDirecta from 'src/pages/ChatDirecta';
import AsistenciasClase from 'src/pages/AsistenciasClase';
import AsistenciasTodasClases from 'src/pages/AsistenciasTodasClases';
import VisualizarAsistenciasAlumnos from 'src/pages/VisualizarAsistenciasAlumnos';
import GestionarAlumnosClase from 'src/pages/GestionarAlumnosClase';
import CambiarContrasenia from 'src/pages/CambiarContrasenia';
import Registro from 'src/pages/Registro';

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