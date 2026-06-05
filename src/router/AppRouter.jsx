import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from 'src/Pages/Login.jsx';
import Dashboard from 'src/Pages/Dashboard.jsx';
import RestablecerContrasenia from 'src/Pages/RestablecerContrasena.jsx';
import ProtectedRoute from 'src/Components/ProtectedRoute.jsx'; // Importamos el guardia
import MainLayout from 'src/Components/MainLayout.jsx'; // Importamos el Layout
import Usuarios from 'src/Pages/Usuarios.jsx';
import GestionClases from 'src/Pages/GestionClases.jsx';
import ConversacionesClase from 'src/Pages/ConversacionesClase.jsx';
import ConversacionesDirectas from 'src/Pages/ConversacionesDirectas.jsx';
import ChatDirecta from 'src/Pages/ChatDirecta.jsx';
import AsistenciasClase from 'src/Pages/AsistenciasClase.jsx';
import AsistenciasTodasClases from 'src/Pages/AsistenciasTodasClases.jsx';
import VisualizarAsistenciasAlumnos from 'src/Pages/VisualizarAsistenciasAlumnos.jsx';
import GestionarAlumnosClase from 'src/Pages/GestionarAlumnosClase.jsx';
import CambiarContrasenia from 'src/Pages/CambiarContrasenia.jsx';
import Registro from 'src/Pages/Registro.jsx';

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