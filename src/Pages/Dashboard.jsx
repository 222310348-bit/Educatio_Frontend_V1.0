import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import claseService from '../services/claseService';
import NuevaClase from '../components/NuevaClase';
import ModalUnirseClase from '../components/ModalUnirseClase';

const Dashboard = () => {
    const [clases, setClases] = useState([]);
    const { auth, cargando: authCargando } = useContext(AuthContext);
    const [cargando, setCargando] = useState(true);
    const [verModal, setVerModal] = useState(false);
    const [verModalUnirse, setVerModalUnirse] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const navigate = useNavigate();

    // Función para cargar las clases desde el backend
    const cargarClases = async () => {
        try {
            setCargando(true);
            const data = await claseService.obtenerMisClases();
            setClases(data);
        } catch (error) {
            console.error("Error al cargar clases:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (authCargando) return; // esperar a que se resuelva la autenticación
        if (auth?.rol !== 1) {
            cargarClases();
        }
    }, [auth, authCargando]);

    const colores = ['#1a73e8', '#d93025', '#1e8e3e', '#f29900', '#9c27b0'];


    // Función que se dispara cuando el modal envía los datos
    const handleGuardarClase = async (datos) => {
        try {
            await claseService.crear(datos);
            setVerModal(false); // Cerrar modal tras éxito
            cargarClases(); // Refrescar la lista
        } catch (error) {
            alert("Error al crear la clase");
        }
    };

    const abrirConversaciones = (clase) => {
        navigate(`/dashboard/clase/${clase.Codigo_PK}/conversaciones`, { state: { clase } });
    };

    const abrirAsistencias = (clase) => {
        // Si el usuario es docente (rol 3), ver asistencias de los alumnos
        if (auth?.rol === 3) {
            navigate(`/dashboard/clase/${clase.Codigo_PK}/asistencias-alumnos`, { state: { clase } });
        } else {
            // Si es estudiante, ver sus propias asistencias
            navigate(`/dashboard/clase/${clase.Codigo_PK}/mis-asistencias`, { state: { clase } });
        }
    };

    const abrirGestionarAlumnos = (clase) => {
        navigate(`/dashboard/clase/${clase.Codigo_PK}/gestionar-alumnos`, { state: { clase } });
    };

    const handleUnirseClase = async (codigoClase) => {
        try {
            await claseService.unirseClase(codigoClase);
            setMensajeExito('¡Te has unido a la clase exitosamente!');
            setVerModalUnirse(false);
            cargarClases(); // Recargar las clases
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (error) {
            console.error('Error al unirse a la clase:', error);
            alert(error.response?.data?.message || 'No se pudo unir a la clase. Verifica el código e intenta de nuevo.');
        }
    };

    if (cargando && authCargando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (auth?.rol === 1) {
        return (
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h1 className="fw-bold" style={{ color: '#3c4043' }}>Panel de Administración</h1>
                        <p className="text-muted mx-auto" style={{ maxWidth: '680px' }}>
                            Bienvenido al panel de administración. Aquí puedes gestionar usuarios, administrar las clases y cambiar tu contraseña personal.
                        </p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px' }}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 className="fw-semibold">Gestionar Usuarios</h4>
                                        <p className="text-muted">Crea, edita y administra los usuarios del sistema.</p>
                                    </div>
                                    <button className="btn btn-primary mt-3" onClick={() => navigate('/usuarios')}>
                                        Ir a Usuarios
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px' }}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 className="fw-semibold">Gestionar Clases</h4>
                                        <p className="text-muted">Supervisa y controla las clases disponibles en la plataforma.</p>
                                    </div>
                                    <button className="btn btn-primary mt-3" onClick={() => navigate('/clases')}>
                                        Ir a Clases
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '16px' }}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 className="fw-semibold">Cambiar contraseña</h4>
                                        <p className="text-muted">Actualiza tu contraseña de acceso de forma segura.</p>
                                    </div>
                                    <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard/cambiar-contrasena')}>
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
            
            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                    <i className="bi bi-check-circle me-2"></i>{mensajeExito}
                    <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
                </div>
            )}
            
            {/* Cabecera del Panel */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#3c4043' }}>Panel de Clases</h2>
                
                <div className="d-flex gap-2">
                    {/* Botón para unirse a una clase (Solo Estudiantes) */}
                    {auth?.rol === 2 && (
                        <>
                            <button 
                                className="btn btn-info shadow-sm px-4"
                                onClick={() => navigate('/asistencias')}
                            >
                                <i className="bi bi-calendar-check me-2"></i>Asistencias de todas mis clases
                            </button>
                            <button 
                                className="btn btn-success shadow-sm px-4"
                                onClick={() => setVerModalUnirse(true)}
                            >
                                <i className="bi bi-person-plus me-2"></i>Unirse a Clase
                            </button>
                        </>
                    )}

                    {/* Botón para crear nueva clase (Solo Admin o Docente) */}
                    {(auth?.rol === 1 || auth?.rol === 3) && (
                        <button 
                            className="btn btn-primary shadow-sm px-4"
                            onClick={() => setVerModal(true)}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Nueva Clase
                        </button>
                    )}
                </div>
            </div>

            {/* Modal para unirse a clase */}
            {verModalUnirse && (
                <ModalUnirseClase
                    alCerrar={() => setVerModalUnirse(false)}
                    alGuardar={handleUnirseClase}
                />
            )}

            {/* Renderizado del Modal */}
            {verModal && (
                <NuevaClase 
                    auth={auth} 
                    alCerrar={() => setVerModal(false)} 
                    alGuardar={handleGuardarClase} 
                />
            )}

            {/* Listado de Tarjetas (El MAP) */}
            <div className="row">
                {clases.length > 0 ? (
                    clases.map((clase, index) => (
                        <div className="col-md-4 col-lg-3 mb-4" key={clase.Codigo_PK}>
                            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                
                                {/* Banner de Color */}
                                <div style={{ 
                                    backgroundColor: colores[index % colores.length], 
                                    height: '110px', 
                                    padding: '20px',
                                    color: 'white'
                                }}>
                                    <h4 className="mb-1 text-truncate" style={{ fontWeight: '600' }}>
                                        {clase.NombreC}
                                    </h4>
                                    <p className="small mb-0" style={{ color: '#ffffff', opacity: '0.9', fontWeight: '500' }}>
                                        Código: {clase.Codigo_PK}
                                    </p>
                                </div>
                                
                                {/* Cuerpo de la tarjeta */}
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border me-2" 
                                                 style={{ width: '40px', height: '40px', fontWeight: 'bold', color: '#5f6368' }}>
                                                {clase.NombreCompletoDocente ? clase.NombreCompletoDocente.charAt(0) : '?'}
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="text-dark fw-bold" style={{ fontSize: '0.9rem' }}>
                                                    {clase.NombreCompletoDocente || 'Sin docente asignado'}
                                                </span>
                                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Profesor Titular</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Botones de acción */}
                                    <div className="mt-auto pt-3 border-top">
                                        {/* Botones para docentes */}
                                        {auth?.rol === 3 && (
                                            <div className="d-grid gap-2 mb-2">
                                                <button className="btn btn-warning btn-sm fw-bold" onClick={() => abrirGestionarAlumnos(clase)}>
                                                    <i className="bi bi-people me-1"></i>Gestionar Alumnos
                                                </button>
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between gap-2">
                                            <button className="btn btn-light btn-sm text-primary fw-bold border-0 flex-grow-1" onClick={() => abrirAsistencias(clase)}>
                                                <i className="bi bi-calendar2-check me-1"></i> Asistencias
                                            </button>
                                            <button className="btn btn-primary btn-sm px-3 shadow-sm flex-grow-1" onClick={() => abrirConversaciones(clase)}>
                                                <i className="bi bi-chat-dots me-1"></i>Abrir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center w-100 py-5">
                        <div className="bg-white p-5 rounded shadow-sm border">
                            <i className="bi bi-journal-x display-4 text-muted"></i>
                            <p className="text-muted mt-3 fs-5">No hay clases vinculadas a tu cuenta.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;