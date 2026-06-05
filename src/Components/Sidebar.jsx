import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de tener el contexto para el rol

const Sidebar = ({ collapsed, toggleSidebar }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext); // Obtenemos el rol del usuario logueado

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const sidebarStyle = {
        width: collapsed ? '80px' : '250px',
        transition: 'width 0.3s',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        backgroundColor: '#212529',
        overflowX: 'hidden',
        zIndex: 1000
    };

    return (
        <div style={sidebarStyle} className="text-white p-3 d-flex flex-column">
            {/* Botón de Hamburguesa (Tres rayas) */}
            <button 
                onClick={toggleSidebar} 
                className="btn btn-dark mb-4 ml-auto"
                style={{ fontSize: '1.5rem' }}
            >
                <i className="bi bi-list"></i>
            </button>

            <h4 className={`text-center mb-4 ${collapsed ? 'd-none' : ''}`}>EducatIO</h4>
            <hr />

            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item mb-2">
                    <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
                        <i className="bi bi-speedometer2 fs-4 me-3"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>

                {/* FILTRO DE ROL: Solo se ve si es Admin (Rol 1) */}
                {auth?.rol === 1 && (
                    <li className="nav-item mb-2">
                        <Link to="/usuarios" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-people fs-4 me-3"></i>
                            {!collapsed && <span>Usuarios</span>}
                        </Link>
                    </li>
                )}

                {/* Sección de Clases en Sidebar.jsx */}
                {(auth?.rol === 1 || auth?.rol === 3) && (
                    <li className="nav-item mb-2">
                        <Link to="/clases" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-book fs-4 me-3"></i>
                            {!collapsed && <span>Gestión Clases</span>}
                        </Link>
                    </li>
                )}

                {auth?.rol === 2 && (
                    <li className="nav-item mb-2">
                        <Link to="/asistencias" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-calendar-check fs-4 me-3"></i>
                            {!collapsed && <span>Asistencias de todas mis clases</span>}
                        </Link>
                    </li>
                )}
                {(auth?.rol === 2 || auth?.rol === 3) && (
                    <li className="nav-item mb-2">
                        <Link to="/conversaciones-directas" className="nav-link text-white d-flex align-items-center">
                            <i className="bi bi-chat-dots fs-4 me-3"></i>
                            {!collapsed && <span>Conversaciones</span>}
                        </Link>
                    </li>
                )}

                <li className="nav-item mb-2">
                    <Link to="/dashboard/cambiar-contrasena" className="nav-link text-white d-flex align-items-center">
                        <i className="bi bi-shield-lock fs-4 me-3"></i>
                        {!collapsed && <span>Cambiar contraseña</span>}
                    </Link>
                </li>
            </ul>

            <hr />
            <button onClick={handleLogout} className="btn btn-outline-danger border-0 d-flex align-items-center justify-content-center">
                <i className="bi bi-box-arrow-right fs-4 me-3"></i>
                {!collapsed && <span>Cerrar Sesión</span>}
            </button>
        </div>
    );
};

export default Sidebar;