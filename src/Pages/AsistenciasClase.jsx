import { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import asistenciaService from '../services/asistenciaService';
import { normalizarEstadoAsistencia, obtenerClaseBadgeEstado } from '../utils/asistenciaUtils';
import { formatFechaHora } from '../utils/dateUtils';

const AsistenciasClase = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const claseState = location.state?.clase;
    const [asistencias, setAsistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const cargarAsistencias = async () => {
            try {
                setCargando(true);
                const data = await asistenciaService.obtenerMisAsistencias(claseState?.Codigo_PK || codigo);
                setAsistencias(data || []);
            } catch (err) {
                console.error('Error al cargar asistencias:', err);
                setError('No se pudieron cargar las asistencias. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        if (auth?.rol === 2) {
            cargarAsistencias();
        }
    }, [codigo, claseState, auth]);

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold" style={{ color: '#3c4043' }}>Mis asistencias</h2>
                    <p className="text-muted mb-0">
                        {claseState?.NombreC
                            ? `Clase: ${claseState.NombreC} · Código ${claseState.Codigo_PK}`
                            : `Clase: ${codigo}`}
                    </p>
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                <div className="card-body p-4">
                    {cargando ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '220px' }}>
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning mb-0" role="alert">
                            {error}
                        </div>
                    ) : asistencias.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-calendar-check display-4 text-muted"></i>
                            <p className="mt-4 mb-1 fs-5 text-muted">Actualmente no tienes registros de asistencia para esta clase.</p>
                            <p className="text-secondary">Cuando tengas asistencias, las verás listadas aquí.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-borderless align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Detalle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asistencias.map((registro, index) => (
                                        <tr key={registro.id || index} className="border-top">
                                            <td className="py-3" style={{ minWidth: '160px' }}>
                                                <span className="fw-semibold">{formatFechaHora(registro.Fecha || registro.fecha || registro.fechaRegistro, registro.Hora || registro.hora || registro.horaRegistro)}</span>
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
                                                {registro.detalle || registro.comentario || 'No hay detalle adicional'}
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

export default AsistenciasClase;
