import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'src/context/AuthContext.<i class="fas fa-node-js    "></i>';
import claseService from 'src/services/claseService.js';
import ModalAgregarAlumno from 'src/Components/ModalAgregarAlumno.jsx';

const GestionarAlumnosClase = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const claseState = location.state?.clase;

    const [alumnos, setAlumnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [verModalAgregar, setVerModalAgregar] = useState(false);
    const [filtroAlumno, setFiltroAlumno] = useState('');
    const [eliminando, setEliminando] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');

    // Verificar que el usuario sea docente
    useEffect(() => {
        if (auth && auth.rol !== 3) {
            navigate('/dashboard');
        }
    }, [auth, navigate]);

    // Cargar alumnos de la clase
    const cargarAlumnos = async () => {
        try {
            setCargando(true);
            const data = await claseService.obtenerAlumnosClase(claseState?.Codigo_PK || codigo);
            setAlumnos(data || []);
            setError(null);
        } catch (err) {
            console.error('Error al cargar alumnos:', err);
            setError('No se pudieron cargar los alumnos. Intenta de nuevo más tarde.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (auth?.rol === 3) {
            cargarAlumnos();
        }
    }, [codigo, claseState, auth]);

    // Manejar agregar alumno
    const handleAgregarAlumnos = async (emails) => {
        try {
            await claseService.agregarAlumnoClase(claseState?.Codigo_PK || codigo, emails);
            setMensajeExito('Alumno(s) agregado(s) correctamente');
            setVerModalAgregar(false);
            cargarAlumnos(); // Recargar lista
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            console.error('Error al agregar alumno:', err);
            alert(err.response?.data?.mensaje || err.response?.data?.message || 'Error al agregar el alumno');
        }
    };

    // Manejar desasignar alumno
    const handleDesasignar = async (idAlumno) => {
        if (!window.confirm('¿Está seguro de que desea desasignar este alumno?')) {
            return;
        }

        try {
            setEliminando(idAlumno);
            await claseService.desasignarAlumno(claseState?.Codigo_PK || codigo, idAlumno);
            setMensajeExito('Alumno desasignado correctamente');
            cargarAlumnos(); // Recargar lista
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            console.error('Error al desasignar alumno:', err);
            alert(err.response?.data?.mensaje || err.response?.data?.message || 'Error al desasignar el alumno');
        } finally {
            setEliminando(null);
        }
    };

    // Filtrar alumnos
    const alumnosFiltrados = Array.isArray(alumnos) ? alumnos.filter(alumno =>
        (alumno.NombreCompleto || alumno.nombreCompleto || `${alumno.ApellidosU || ''} ${alumno.NombresU || ''}`)
            .toLowerCase().includes(filtroAlumno.toLowerCase()) ||
        (alumno.Correo || alumno.correo || '').toLowerCase().includes(filtroAlumno.toLowerCase())
    ) : [];

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f2f5' }}>
            {/* Cabecera */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Gestionar Alumnos</h2>
                    <p className="text-muted mb-0">
                        {claseState?.NombreC
                            ? `Clase: ${claseState.NombreC} · Código ${claseState.Codigo_PK}`
                            : `Clase: ${codigo}`}
                    </p>
                </div>
                <button
                    className="btn btn-primary shadow-sm px-4"
                    onClick={() => setVerModalAgregar(true)}
                >
                    <i className="bi bi-plus-lg me-2"></i>Agregar Alumno
                </button>
            </div>

            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle me-2"></i>{mensajeExito}
                    <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
                </div>
            )}

            {/* Modal para agregar alumno */}
            {verModalAgregar && (
                <ModalAgregarAlumno
                    alCerrar={() => setVerModalAgregar(false)}
                    alGuardar={handleAgregarAlumnos}
                    alumnosActuales={alumnos}
                />
            )}

            {/* Buscador */}
            {!cargando && alumnos.length > 0 && (
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="🔍 Buscar alumno por nombre o correo..."
                        value={filtroAlumno}
                        onChange={(e) => setFiltroAlumno(e.target.value)}
                        style={{ borderRadius: '10px', borderColor: '#e0e0e0' }}
                    />
                </div>
            )}

            {/* Contenedor principal */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                <div className="card-body p-4">
                    {cargando ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning mb-0" role="alert">
                            {error}
                        </div>
                    ) : alumnos.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-people display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No hay alumnos asignados a esta clase aún.</p>
                            <p className="text-secondary">Haz clic en "Agregar Alumno" para comenzar.</p>
                        </div>
                    ) : alumnosFiltrados.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-search display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No se encontraron resultados.</p>
                            <p className="text-secondary">Intenta con otro nombre o correo.</p>
                        </div>
                    ) : (
                        <div>
                            {/* Resumen */}
                            <div className="mb-4 p-3" style={{ backgroundColor: '#e3f2fd', borderRadius: '10px' }}>
                                <p className="mb-0 text-primary">
                                    <strong>Total de alumnos:</strong> {alumnos.length}
                                </p>
                            </div>

                            {/* Tabla de alumnos */}
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                        <tr>
                                            <th style={{ color: '#495057' }}>Alumno</th>
                                            <th style={{ color: '#495057' }}>Correo</th>
                                            <th style={{ color: '#495057' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alumnosFiltrados.map((alumno) => {
                                            const alumnoId = alumno.IdAlumno || alumno.IdUsuario_FK || alumno.id || 'unknown';
                                            const alumnoNombre = alumno.NombreCompleto || alumno.nombreCompleto || `${alumno.ApellidosU || ''} ${alumno.NombresU || ''}`.trim() || 'Desconocido';

                                            return (
                                                <tr key={alumnoId}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                                                 style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                                                                {alumnoNombre.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 fw-semibold text-dark">
                                                                    {alumnoNombre}
                                                                </p>
                                                                <small className="text-muted">
                                                                    ID: {alumnoId}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: '#5f6368' }}>
                                                            {alumno.Correo || alumno.correo || 'No disponible'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDesasignar(alumnoId)}
                                                            disabled={eliminando === alumnoId}
                                                        >
                                                            {eliminando === alumnoId ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                    Eliminando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="bi bi-trash me-2"></i>Desasignar
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestionarAlumnosClase;
