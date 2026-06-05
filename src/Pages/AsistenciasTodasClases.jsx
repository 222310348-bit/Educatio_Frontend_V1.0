import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import asistenciaService from '../services/asistenciaService';
import { normalizarEstadoAsistencia, obtenerClaseBadgeEstado } from '../utils/asistenciaUtils';
import { formatFechaHora } from '../utils/dateUtils';

const AsistenciasTodasClases = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [asistencias, setAsistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('Todas');

    useEffect(() => {
        if (auth && auth.rol !== 2) {
            navigate('/dashboard');
            return;
        }

        const cargarAsistencias = async () => {
            try {
                setCargando(true);
                const data = await asistenciaService.obtenerTodasMisAsistencias();
                const lista = Array.isArray(data) ? data : data?.data || [];
                setAsistencias(lista);
            } catch (err) {
                console.error('Error al cargar asistencias:', err);
                setError('No se pudieron cargar las asistencias. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        cargarAsistencias();
    }, [auth, navigate]);

    const asistenciasFiltradas = asistencias.filter((registro) => {
        const estadoVisible = normalizarEstadoAsistencia(registro.Estado || registro.estado || registro.asistio);
        const texto = `${registro.NombreC || registro.Codigo_FK || registro.CodigoClase || ''} ${registro.Fecha || registro.fecha || ''} ${registro.Hora || registro.hora || ''} ${estadoVisible}`.toLowerCase();
        const coincideTexto = texto.includes(filtro.toLowerCase());
        const estadoRegistro = estadoVisible.toLowerCase();
        const estadoFiltroNormalizado = estadoFiltro.trim().toLowerCase();
        const coincideEstado = estadoFiltroNormalizado === 'todas' || estadoRegistro === estadoFiltroNormalizado;
        return coincideTexto && coincideEstado;
    });

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f2f5' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-column flex-md-row gap-3">
                <div>
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Asistencias de todas mis clases</h2>
                    <p className="text-muted mb-0">Visualiza en una sola tabla todos los registros de asistencia de tus clases.</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    {['Todas', 'Presente', 'Ausente', 'Justificado'].map((estado) => (
                        <button
                            key={estado}
                            className={`btn btn-sm ${estadoFiltro === estado ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setEstadoFiltro(estado)}
                            type="button"
                        >
                            {estado}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Buscar por clase, fecha, hora o estado..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ borderRadius: '10px', borderColor: '#e0e0e0' }}
                />
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                <div className="card-body p-4">
                    {cargando ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '260px' }}>
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning mb-0" role="alert">
                            {error}
                        </div>
                    ) : asistencias.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-calendar-check display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">Todavía no tienes registros de asistencia.</p>
                            <p className="text-secondary">Cuando tengas asistencias, las verás listadas aquí.</p>
                        </div>
                    ) : asistenciasFiltradas.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-search display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">No se encontraron resultados.</p>
                            <p className="text-secondary">Prueba con otro término de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Clase</th>
                                        <th>Nombre de clase</th>
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Estado</th>
                                        <th>Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistenciasFiltradas.map((registro, index) => (
                                        <tr key={registro.IdAsistencia_PK || registro.id || index} className="border-top">
                                            <td className="py-3" style={{ minWidth: '140px' }}>
                                                <span className="fw-semibold">{registro.Codigo_FK || registro.CodigoClase || 'N/A'}</span>
                                            </td>
                                            <td className="py-3" style={{ minWidth: '180px' }}>
                                                <span>{registro.NombreC || registro.nombreC || registro.NombreClase || registro.Nombre || 'Sin nombre'}</span>
                                            </td>
                                            <td className="py-3">
                                                {(registro.Fecha || registro.fecha) ? formatFechaHora(registro.Fecha || registro.fecha).split(' ')[0] : 'Sin fecha'}
                                            </td>
                                            <td className="py-3">
                                                {registro.Hora || registro.hora || 'Sin hora'}
                                            </td>
                                            <td className="py-3">
                                                {(() => {
                                                    const estadoVisible = normalizarEstadoAsistencia(registro.Estado || registro.estado || registro.asistio);
                                                    return (
                                                        <span className={`badge ${obtenerClaseBadgeEstado(estadoVisible)} py-2 px-3`}>
                                                            {estadoVisible}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="py-3 text-secondary">
                                                {registro.detalle || registro.comentario || 'No hay detalle'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsistenciasTodasClases;
