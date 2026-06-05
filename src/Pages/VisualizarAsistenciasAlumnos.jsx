import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import asistenciaService from '../services/asistenciaService';
import {
    normalizarEstadoAsistencia,
    obtenerCodigoEstadoAsistencia,
    obtenerClaseBadgeEstado
} from '../utils/asistenciaUtils';
import { formatFechaHora } from '../utils/dateUtils';

const opcionesEstados = [
    { value: 'P', label: 'Presente' },
    { value: 'F', label: 'Ausente' },
    { value: 'J', label: 'Justificado' }
];

const VisualizarAsistenciasAlumnos = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const claseState = location.state?.clase;

    const [asistencias, setAsistencias] = useState([]);
    const [alumnosClase, setAlumnosClase] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
    const [error, setError] = useState(null);
    const [filtroAlumno, setFiltroAlumno] = useState('');
    const [paseAbierto, setPaseAbierto] = useState(false);
    const [estadosModal, setEstadosModal] = useState({});
    const [modalError, setModalError] = useState(null);
    const [modalExito, setModalExito] = useState(null);
    const [guardandoPase, setGuardandoPase] = useState(false);
    const [estadoEdicion, setEstadoEdicion] = useState({});
    const [registroEditando, setRegistroEditando] = useState(null);
    const [guardandoEdicion, setGuardandoEdicion] = useState(false);

    useEffect(() => {
        if (auth && auth.rol !== 3) {
            navigate('/dashboard');
        }
    }, [auth, navigate]);

    const cargarAsistenciasAlumnos = async () => {
        try {
            setCargando(true);
            const data = await asistenciaService.obtenerAsistenciasAlumnos(claseState?.Codigo_PK || codigo);
            setAsistencias(Array.isArray(data) ? data : data?.data || []);
        } catch (err) {
            console.error('Error al cargar asistencias de alumnos:', err);
            setError('No se pudieron cargar las asistencias. Intenta de nuevo más tarde.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (auth?.rol === 3) {
            cargarAsistenciasAlumnos();
        }
    }, [codigo, claseState, auth]);

    const cargarAlumnosClase = async () => {
        try {
            setCargandoAlumnos(true);
            const rawAlumnos = await asistenciaService.obtenerAlumnosClase(claseState?.Codigo_PK || codigo);
            const alumnos = Array.isArray(rawAlumnos) ? rawAlumnos : rawAlumnos?.data || [];

            // Normalizar forma de los alumnos para que tengamos siempre
            // IdUsuario_FK, ApellidosU, NombresU, NombreCompleto y Correo
            const alumnosNorm = alumnos.map(a => {
                const id = a.IdUsuario_FK || a.IdAlumno || a.IdUsuario || a.Id || null;
                const apellidos = a.ApellidosU || '';
                const nombres = a.NombresU || '';
                const nombreCompleto = a.NombreCompleto || `${apellidos} ${nombres}`.trim();
                return {
                    IdUsuario_FK: id,
                    ApellidosU: apellidos,
                    NombresU: nombres,
                    NombreCompleto: nombreCompleto,
                    Correo: a.Correo || a.correo || a.Email || a.email || '-'
                };
            });

            setAlumnosClase(alumnosNorm);
            return alumnos;
        } catch (err) {
            console.error('Error al cargar alumnos de la clase:', err);
            setModalError('No se pudo cargar la lista de alumnos. Intenta de nuevo.');
            return [];
        } finally {
            setCargandoAlumnos(false);
        }
    };

    const asistenciasPorAlumno = asistencias.reduce((acc, asistencia) => {
        const nombreInvertido = asistencia.ApellidosU && asistencia.NombresU
            ? `${asistencia.ApellidosU} ${asistencia.NombresU}`.trim()
            : null;
        const nombreAlumno = nombreInvertido || asistencia.NombreAlumno || asistencia.nombreAlumno || `${asistencia.NombresU || ''} ${asistencia.ApellidosU || ''}`.trim() || 'Alumno desconocido';
        const correoAlumno = asistencia.Correo || asistencia.correo || asistencia.Email || asistencia.email || 'Sin correo';
        const idAlumno = asistencia.IdUsuario_FK || asistencia.idUsuario || asistencia.id_alumno;
        if (!acc[nombreAlumno]) {
            acc[nombreAlumno] = {
                nombreAlumno,
                correoAlumno,
                idAlumno,
                registros: []
            };
        }
        acc[nombreAlumno].registros.push(asistencia);
        return acc;
    }, {});

    const alumnosFiltrados = Object.values(asistenciasPorAlumno).filter(alumno =>
        alumno.nombreAlumno.toLowerCase().includes(filtroAlumno.toLowerCase())
    );

    const calcularEstadisticas = (registros) => {
        const total = registros.length;
        const presentes = registros.filter(r => normalizarEstadoAsistencia(r.Estado || r.estado || r.asistio) === 'Presente').length;
        const ausentes = registros.filter(r => normalizarEstadoAsistencia(r.Estado || r.estado || r.asistio) === 'Ausente').length;
        const justificados = registros.filter(r => normalizarEstadoAsistencia(r.Estado || r.estado || r.asistio) === 'Justificado').length;
        return {
            total,
            presentes,
            ausentes,
            justificados,
            porcentajeAsistencia: total > 0 ? Math.round((presentes / total) * 100) : 0
        };
    };

    const iniciarPaseDeLista = async () => {
        let alumnos = alumnosClase;
        if (alumnos.length === 0) {
            alumnos = await cargarAlumnosClase();
            if (!alumnos.length) {
                return;
            }
        }

        const estadoInicial = {};
        const registrosPorId = Object.values(asistenciasPorAlumno).reduce((acc, alumno) => {
            if (alumno.registros.length > 0 && alumno.idAlumno) {
                acc[alumno.idAlumno] = alumno.registros[0];
            }
            return acc;
        }, {});

        alumnos.forEach((alumno) => {
            estadoInicial[alumno.IdUsuario_FK] = obtenerCodigoEstadoAsistencia(registrosPorId[alumno.IdUsuario_FK]?.Estado || registrosPorId[alumno.IdUsuario_FK]?.estado || registrosPorId[alumno.IdUsuario_FK]?.asistio || 'P');
        });

        setEstadosModal(estadoInicial);
        setModalError(null);
        setModalExito(null);
        setPaseAbierto(true);
    };

    const cerrarModal = () => {
        setPaseAbierto(false);
        setModalError(null);
        setModalExito(null);
    };

    const guardarPaseDeLista = async () => {
        setModalError(null);
        setModalExito(null);
        setGuardandoPase(true);

        try {
            // Usar un único timestamp para todas las asistencias del pase
            const ahora = new Date();
            const fecha = ahora.toISOString().split('T')[0];
            const hora = ahora.toTimeString().split(' ')[0];

            const data = alumnosClase.map((alumno) => ({
                Fecha: fecha,
                Hora: hora,
                Estado: estadosModal[alumno.IdUsuario_FK] || 'P',
                Codigo_FK: claseState?.Codigo_PK || codigo,
                IdUsuario_FK: alumno.IdUsuario_FK
            }));

            // Enviar las peticiones en paralelo pero usando el mismo timestamp
            await Promise.all(data.map((registro) => asistenciaService.crearAsistencia(registro)));
            setModalExito('Pase de lista guardado correctamente.');
            await cargarAsistenciasAlumnos();
            setPaseAbierto(false);
        } catch (err) {
            console.error('Error al guardar pase de lista:', err);
            setModalError('No se pudo guardar el pase de lista. Intenta nuevamente.');
        } finally {
            setGuardandoPase(false);
        }
    };

    const habilitarEdicionRegistro = (registro) => {
        const registroId = registro.IdAsistencia_PK || registro.id;
        setRegistroEditando(registroId);
        setEstadoEdicion((prev) => ({
            ...prev,
            [registroId]: obtenerCodigoEstadoAsistencia(registro.Estado || registro.estado || registro.asistio || 'P')
        }));
    };

    const cancelarEdicion = () => {
        setRegistroEditando(null);
    };

    const guardarEdicionRegistro = async (registro) => {
        const registroId = registro.IdAsistencia_PK || registro.id;
        const nuevoEstado = estadoEdicion[registroId];
        if (!nuevoEstado) return;

        try {
            setGuardandoEdicion(true);
            await asistenciaService.actualizarEstadoAsistencia(registroId, nuevoEstado);
            await cargarAsistenciasAlumnos();
            setRegistroEditando(null);
        } catch (err) {
            console.error('Error al guardar estado de asistencia:', err);
            setError('No se pudo actualizar la asistencia. Intenta nuevamente.');
        } finally {
            setGuardandoEdicion(false);
        }
    };

    const manejarEstadoModal = (alumnoId, value) => {
        setEstadosModal((prev) => ({
            ...prev,
            [alumnoId]: value
        }));
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f2f5' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Asistencias de Alumnos</h2>
                    <p className="text-muted mb-0">
                        {claseState?.NombreC
                            ? `Clase: ${claseState.NombreC} · Código ${claseState.Codigo_PK}`
                            : `Clase: ${codigo}`}
                    </p>
                </div>
                <button className="btn btn-primary btn-lg" onClick={iniciarPaseDeLista} disabled={cargandoAlumnos || cargando}>
                    <i className="bi bi-journal-plus me-2"></i>Nuevo pase de lista
                </button>
            </div>

            {!cargando && asistencias.length > 0 && (
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="🔍 Buscar alumno por nombre..."
                        value={filtroAlumno}
                        onChange={(e) => setFiltroAlumno(e.target.value)}
                        style={{ borderRadius: '10px', borderColor: '#e0e0e0' }}
                    />
                </div>
            )}

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
                    ) : asistencias.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-calendar-check display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No hay registros de asistencia aún.</p>
                            <p className="text-secondary">Realiza un pase de lista para comenzar a registrar asistencia.</p>
                        </div>
                    ) : alumnosFiltrados.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-search display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No se encontraron resultados.</p>
                            <p className="text-secondary">Intenta con otro nombre de alumno.</p>
                        </div>
                    ) : (
                        <div className="row">
                            {alumnosFiltrados.map((alumno) => {
                                const stats = calcularEstadisticas(alumno.registros);
                                return (
                                    <div key={alumno.idAlumno} className="col-lg-6 mb-4">
                                        <div className="card border-0 h-100" style={{ borderRadius: '12px', backgroundColor: '#f8f9fa' }}>
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                                         style={{ width: '50px', height: '50px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                        {alumno.nombreAlumno.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-0 fw-bold text-dark">{alumno.nombreAlumno}</h5>
                                                        <small className="text-muted">{alumno.correoAlumno || 'Sin correo'}</small>
                                                    </div>
                                                </div>

                                                <div className="row text-center mb-3">
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-success fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.presentes}
                                                            </div>
                                                            <small className="text-muted">Presentes</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-danger fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.ausentes}
                                                            </div>
                                                            <small className="text-muted">Ausentes</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-warning fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.justificados}
                                                            </div>
                                                            <small className="text-muted">Justificados</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <div className="p-2">
                                                            <div className="text-primary fw-bold" style={{ fontSize: '1.3rem' }}>
                                                                {stats.porcentajeAsistencia}%
                                                            </div>
                                                            <small className="text-muted">Asistencia</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="progress" style={{ height: '25px', borderRadius: '8px' }}>
                                                        <div className="progress-bar bg-success" role="progressbar"
                                                             style={{ width: `${(stats.presentes / Math.max(stats.total, 1)) * 100}%` }}
                                                             aria-valuenow={stats.presentes} aria-valuemin="0" aria-valuemax={stats.total}>
                                                            <small className="fw-bold">Presentes</small>
                                                        </div>
                                                        <div className="progress-bar bg-danger" role="progressbar"
                                                             style={{ width: `${(stats.ausentes / Math.max(stats.total, 1)) * 100}%` }}
                                                             aria-valuenow={stats.ausentes} aria-valuemin="0" aria-valuemax={stats.total}>
                                                            <small className="fw-bold">Ausentes</small>
                                                        </div>
                                                        <div className="progress-bar bg-warning" role="progressbar"
                                                             style={{ width: `${(stats.justificados / Math.max(stats.total, 1)) * 100}%` }}
                                                             aria-valuenow={stats.justificados} aria-valuemin="0" aria-valuemax={stats.total}>
                                                            <small className="fw-bold">Justif.</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table table-sm table-borderless mb-0">
                                                        <thead>
                                                            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                                                                <th style={{ fontSize: '0.85rem' }}>Fecha</th>
                                                                <th style={{ fontSize: '0.85rem' }}>Estado</th>
                                                                <th style={{ fontSize: '0.85rem' }}>Acción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {alumno.registros.map((registro) => {
                                                                const registroId = registro.IdAsistencia_PK || registro.id;
                                                                const estadoActual = normalizarEstadoAsistencia(registro.Estado || registro.estado || registro.asistio || 'P');
                                                                return (
                                                                    <tr key={registroId} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                                        <td style={{ fontSize: '0.85rem' }}>
                                                                                            {formatFechaHora(registro.Fecha || registro.fecha || registro.fechaRegistro, registro.Hora || registro.hora || registro.horaRegistro)}
                                                                        </td>
                                                                        <td style={{ fontSize: '0.85rem', minWidth: '180px' }}>
                                                                            {registroEditando === registroId ? (
                                                                                <select
                                                                                    className="form-select form-select-sm"
                                                                                    value={estadoEdicion[registroId] || obtenerCodigoEstadoAsistencia(registro.Estado || registro.estado || registro.asistio || 'P')}
                                                                                    onChange={(e) => setEstadoEdicion((prev) => ({ ...prev, [registroId]: e.target.value }))}
                                                                                >
                                                                                    {opcionesEstados.map((estado) => (
                                                                                        <option key={estado.value} value={estado.value}>{estado.label}</option>
                                                                                    ))}
                                                                                </select>
                                                                            ) : (
                                                                                <span className={`badge ${obtenerClaseBadgeEstado(estadoActual)}`}>
                                                                                    {estadoActual}
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td style={{ fontSize: '0.85rem' }}>
                                                                            {registroEditando === registroId ? (
                                                                                <div className="d-flex gap-2">
                                                                                    <button
                                                                                        className="btn btn-sm btn-primary"
                                                                                        type="button"
                                                                                        disabled={guardandoEdicion}
                                                                                        onClick={() => guardarEdicionRegistro(registro)}
                                                                                    >
                                                                                        Guardar
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn btn-sm btn-outline-secondary"
                                                                                        type="button"
                                                                                        disabled={guardandoEdicion}
                                                                                        onClick={cancelarEdicion}
                                                                                    >
                                                                                        Cancelar
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-secondary"
                                                                                    type="button"
                                                                                    onClick={() => habilitarEdicionRegistro(registro)}
                                                                                >
                                                                                    Editar
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {paseAbierto && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ backgroundColor: 'rgba(255, 255, 255, 0.39)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content" style={{ backgroundColor: '#ffffff' }}>
                            <div className="modal-header" style={{ backgroundColor: '#038af8' }}>
                                <h5 className="modal-title">Nuevo pase de lista</h5>
                                <button type="button" className="btn-close" aria-label="Cerrar" onClick={cerrarModal}></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                <p>Selecciona el estado de asistencia para cada alumno y guarda el pase de lista.</p>
                                {modalError && <div className="alert alert-danger">{modalError}</div>}
                                {modalExito && <div className="alert alert-success">{modalExito}</div>}

                                <div className="table-responsive">
                                    <table className="table table-bordered align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>Alumno</th>
                                                <th>Correo</th>
                                                <th className="text-center">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alumnosClase.map((alumno) => (
                                                <tr key={alumno.IdUsuario_FK}>
                                                    <td>{alumno.NombreCompleto || `${alumno.ApellidosU || ''} ${alumno.NombresU || ''}`.trim() || 'Sin nombre'}</td>
                                                    <td>{alumno.Correo || '-'}</td>
                                                    <td className="text-center" style={{ minWidth: '185px' }}>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={estadosModal[alumno.IdUsuario_FK] || 'P'}
                                                            onChange={(e) => manejarEstadoModal(alumno.IdUsuario_FK, e.target.value)}
                                                        >
                                                            {opcionesEstados.map((estado) => (
                                                                <option key={estado.value} value={estado.value}>{estado.label}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal} disabled={guardandoPase}>Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={guardarPaseDeLista} disabled={guardandoPase || !alumnosClase.length}>
                                    {guardandoPase ? 'Guardando...' : 'Guardar asistencias'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisualizarAsistenciasAlumnos;
