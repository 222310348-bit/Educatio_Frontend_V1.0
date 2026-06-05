import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import conversacionService from '../services/conversacionService';

const ConversacionesDirectas = () => {
    const [conversaciones, setConversaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [correoNuevo, setCorreoNuevo] = useState('');
    const [creacionError, setCreacionError] = useState(null);
    const [creacionExitosa, setCreacionExitosa] = useState(null);
    const navigate = useNavigate();

    const cargarConversaciones = async () => {
        try {
            setLoading(true);
            const lista = await conversacionService.obtenerDirectas();
            setConversaciones(lista || []);
        } catch (err) {
            console.error('Error cargando conversaciones directas', err);
            setError('No se pudieron cargar las conversaciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarConversaciones();
    }, []);

    const abrirChat = (conv) => {
        // Mantenemos tu ruta original para que no rompa el AppRouter
        navigate(`/conversacion/${conv._id}`, { state: { conversacion: conv } });
    };

    const crearConversacionPorCorreo = async (e) => {
        if (e) e.preventDefault(); // Evita recargas si se usa dentro de formularios
        setCreacionError(null);
        setCreacionExitosa(null);

        if (!correoNuevo.trim()) {
            setCreacionError('Ingresa el correo electrónico de la otra persona.');
            return;
        }

        try {
            const respuesta = await conversacionService.crearDirectaPorCorreo(correoNuevo.trim());
            setCreacionExitosa('Conversación creada correctamente.');
            setCorreoNuevo('');
            await cargarConversaciones();
            if (respuesta?.conversacion?._id) {
                abrirChat(respuesta.conversacion);
            }
        } catch (err) {
            const mensaje = err?.response?.data?.mensaje || 'No se pudo crear la conversación.';
            setCreacionError(mensaje);
            if (mensaje.includes('Ya existe')) {
                setCreacionError('Ya existe una conversación privada con ese correo. Revisa la lista.');
            }
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: '800px', minHeight: '85vh' }}>
            
            {/* Título e Input Superior Estilizado */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.5px' }}>Mensajes Directos</h2>
                    <p className="text-muted small mb-0">Inicia conversaciones privadas con alumnos y docentes</p>
                </div>
            </div>

            {/* Caja de Creación Minimalista */}
            <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '14px', backgroundColor: '#ffffff' }}>
                <form onSubmit={crearConversacionPorCorreo}>
                    <label className="form-label text-secondary fw-semibold small">Crear nueva conversación privada</label>
                    <div className="input-group shadow-sm rounded-pill overflow-hidden border">
                        <input
                            type="email"
                            className="form-control border-0 px-4 py-2 bg-light"
                            placeholder="Correo electrónico del usuario (ejemplo@instituto.edu.mx)"
                            value={correoNuevo}
                            onChange={(e) => setCorreoNuevo(e.target.value)}
                            style={{ fontSize: '0.92rem' }}
                        />
                        <button className="btn btn-success px-4" type="submit" style={{ backgroundColor: '#00a884', borderColor: '#00a884' }}>
                            <i className="bi bi-plus-lg me-1"></i> Crear
                        </button>
                    </div>
                </form>
                {creacionError && <div className="alert alert-danger py-2 px-3 small rounded-pill mt-3 mb-0 shadow-sm">{creacionError}</div>}
                {creacionExitosa && <div className="alert alert-success py-2 px-3 small rounded-pill mt-3 mb-0 shadow-sm">{creacionExitosa}</div>}
            </div>

            {/* Listado de Chats con Diseño Premium */}
            {loading ? (
                // Animación de Placeholder / Esqueleto de carga limpio
                [1, 2, 3].map((i) => (
                    <div key={i} className="card mb-3 border-0 shadow-sm p-3 placeholder-glow" style={{ borderRadius: '12px' }}>
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-body-secondary me-3 placeholder" style={{ width: '50px', height: '50px' }}></div>
                            <div className="flex-grow-1">
                                <div className="bg-body-secondary rounded mb-2 placeholder col-4" style={{ height: '15px' }}></div>
                                <div className="bg-body-secondary rounded placeholder col-7" style={{ height: '12px' }}></div>
                            </div>
                        </div>
                    </div>
                ))
            ) : error ? (
                <div className="alert alert-warning text-center rounded-3 shadow-sm">{error}</div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {conversaciones.length === 0 ? (
                        <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-light-subtle">
                            <i className="bi bi-chat-dots-fill text-body-secondary display-3 mb-3 d-block"></i>
                            <h5 className="text-dark fw-bold mb-1">Sin chats activos</h5>
                            <p className="text-secondary small mb-0 px-3">Introduce un correo electrónico arriba para abrir un canal privado.</p>
                        </div>
                    ) : (
                        conversaciones.map((conv) => {
                            const nombreConversacion = conv.esDirect
                                ? (conv.otroParticipante
                                    ? `${conv.otroParticipante.nombres} ${conv.otroParticipante.apellidos}`
                                    : (conv.nombreConversacion || `Conversación ${conv._id}`))
                                : (conv.nombreConversacion || `Conversación ${conv._id}`);

                            return (
                                <div
                                    key={conv._id}
                                    className="card border-0 shadow-sm p-3 list-group-item-action"
                                    style={{ cursor: 'pointer', borderRadius: '12px', transition: 'transform 0.15s ease' }}
                                    onClick={() => abrirChat(conv)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div className="d-flex align-items-center">
                                        {/* Avatar Circular con iniciales */}
                                        <div 
                                            className="rounded-circle text-white d-flex align-items-center justify-content-center me-3 shadow-sm fw-bold" 
                                            style={{ 
                                                width: '52px', 
                                                height: '52px', 
                                                fontSize: '1.15rem', 
                                                backgroundColor: conv.esDirect ? '#00a884' : '#0d6efd' 
                                            }}
                                        >
                                            {nombreConversacion.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Cuerpo informativo */}
                                        <div className="flex-grow-1 overflow-hidden">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <h6 className="mb-0 fw-bold text-dark text-truncate pe-2" style={{ fontSize: '0.98rem' }}>
                                                    {nombreConversacion}
                                                </h6>
                                                <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                                    {conv.fechaCreacion ? new Date(conv.fechaCreacion).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="text-muted mb-0 small text-truncate fw-medium" style={{ maxWidth: '85%' }}>
                                                    {conv.esDirect && conv.otroParticipante 
                                                        ? `${conv.otroParticipante.correo}` 
                                                        : 'Grupo de discusión'}
                                                </p>
                                                {conv.cantidadMensajes > 0 && (
                                                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1" style={{ fontSize: '0.68rem' }}>
                                                        {conv.cantidadMensajes} msg
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <i className="bi bi-chevron-right text-muted ms-3 small"></i>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default ConversacionesDirectas;