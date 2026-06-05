import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from 'src/pages/Login.jsx';
import Dashboard from 'src/pages/Dashboard.jsx';
import RestablecerContrasenia from 'src/pages/RestablecerContrasena.jsx';
import ProtectedRoute from 'src/components/ProtectedRoute.jsx'; // Importamos el guardia
import MainLayout from 'src/components/MainLayout.jsx'; // Importamos el Layout
import Usuarios from 'src/pages/Usuarios.jsx';
import GestionClases from 'src/pages/GestionClases.jsx';
import ConversacionesClase from 'src/pages/ConversacionesClase.jsx';
import ConversacionesDirectas from 'src/pages/ConversacionesDirectas.jsx';
import ChatDirecta from 'src/pages/ChatDirecta.jsx';
import AsistenciasClase from 'src/pages/AsistenciasClase.jsx';
import AsistenciasTodasClases from 'src/pages/AsistenciasTodasClases.jsx';
import VisualizarAsistenciasAlumnos from 'src/pages/VisualizarAsistenciasAlumnos.jsx';
import GestionarAlumnosClase from 'src/pages/GestionarAlumnosClase.jsx';
import CambiarContrasenia from 'src/pages/CambiarContrasenia.jsx';
import Registro from 'src/pages/Registro.jsx';

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