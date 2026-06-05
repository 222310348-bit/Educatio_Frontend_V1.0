import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importación segura de sesión
import conversacionService from '../services/conversacionService';
import mensajeService from '../services/mensajeService';

const ChatDirecta = () => {
    const { id } = useParams(); // ID de la conversación (ObjectId de Mongo)
    const location = useLocation();
    const conversacionState = location.state?.conversacion;

    // Extraemos la identidad de MySQL usando el contexto central reactivo de la app
    const { auth } = useContext(AuthContext);
    const userId = Number(auth?.id_usuario);

    // Estados
    const [conversacion, setConversacion] = useState(conversacionState || null);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mensajesEndRef = useRef(null);

    // Función modular para refrescar el historial de mensajes
    const cargarMensajes = async () => {
        try {
            const data = await mensajeService.obtenerPorConversacion(id);
            const lista = Array.isArray(data) ? data : data.data ?? data;
            setMensajes(lista || []);
        } catch (err) {
            console.error('Error cargando mensajes de Mongo:', err);
            setError('No se pudieron cargar los mensajes.');
        }
    };

    // Carga inicial de los datos de la conversación privada
    useEffect(() => {
        const cargarDatosChat = async () => {
            try {
                setLoading(true);
                // Si no viene por state, lo consultamos directamente a la API
                if (!conversacionState) {
                    const data = await conversacionService.obtenerPorId(id);
                    setConversacion(data);
                }
                await cargarMensajes();
            } catch (err) {
                console.error('Error al inicializar chat privado:', err);
                setError('No se pudo cargar el canal de comunicación.');
            } finally {
                setLoading(false);
            }
        };
        cargarDatosChat();
    }, [id]);

    // Auto-scroll para mantener la pantalla fija en el último mensaje enviado o recibido
    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    // Lógica de envío de mensajes directos
    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        try {
            await mensajeService.enviarMensaje(id, nuevoMensaje.trim());
            setNuevoMensaje(''); // Limpiar el input inmediatamente
            await cargarMensajes(); // Sincronización instantánea del historial
        } catch (err) {
            console.error('Error enviando mensaje directo:', err);
            setError('No se pudo mandar el mensaje.');
        }
    };

    if (loading) return <div className="container p-5 text-center text-muted fw-semibold">Conectando al chat privado...</div>;

    // Obtener datos del remitente utilizando el puente enriquecido del backend
    const otroParticipante = conversacion?.otroParticipante;
    const nombreCabecera = otroParticipante 
        ? `${otroParticipante.nombres} ${otroParticipante.apellidos}`
        : conversacion?.nombreConversacion || "Chat Privado";

    return (
        <div className="container-fluid p-3 d-flex flex-column" style={{ backgroundColor: '#f0f2f5', height: 'calc(100vh - 40px)' }}>
            <div className="card shadow-sm border-0 flex-grow-1 d-flex flex-column overflow-hidden" style={{ borderRadius: '16px' }}>

                {/* Cabecera del Chat Directo - Estilo Minimalista con Inicial */}
                <div className="card-header bg-white py-3 border-bottom border-light-subtle">
                    <div className="d-flex align-items-center">
                        <div 
                            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3 shadow-sm fw-bold" 
                            style={{ width: '42px', height: '42px', fontSize: '1.05rem', backgroundColor: '#00a884' }}
                        >
                            {nombreCabecera.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.3px', fontSize: '1.1rem' }}>
                                {nombreCabecera}
                            </h5>
                            {otroParticipante?.correo && (
                                <small className="text-muted fw-medium">{otroParticipante.correo}</small>
                            )}
                        </div>
                    </div>
                </div>

                {/* Área del Chat Privado - Fondo e Inyección de Estilos Premium */}
                <div className="card-body overflow-auto p-4 d-flex flex-column gap-2" style={{ backgroundColor: '#efeae2' }}>
                    {error && <div className="alert alert-danger mx-auto py-2 px-4 small rounded-pill shadow-sm">{error}</div>}
                    
                    {mensajes.length > 0 ? (
                        mensajes.map((m) => {
                            // Comparación estricta usando el AuthContext corregido
                            const esMio = Number(m.emisorId) === userId;

                            return (
                                <div key={m._id || m.id} className={`d-flex ${esMio ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div 
                                        className="p-2 px-3 shadow-sm"
                                        style={{ 
                                            maxWidth: '65%', 
                                            backgroundColor: esMio ? '#d9fdd3' : '#ffffff', 
                                            color: '#111b21',
                                            borderRadius: esMio ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                            border: esMio ? '1px solid #c1f0b8' : '1px solid #e9e9e9'
                                        }}
                                    >
                                        {/* Nota: En chats directos 1 a 1 se omite el nombre arriba de la burbuja para máxima limpieza */}
                                        <p className="mb-1" style={{ fontSize: '0.92rem', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {m.contenido}
                                        </p>

                                        {/* Metadatos del mensaje (Hora y herramientas) */}
                                        <div className="d-flex align-items-center justify-content-end gap-2 mt-1" style={{ float: 'right' }}>
                                            <small className="text-muted" style={{ fontSize: '0.62rem' }}>
                                                {new Date(m.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>

                                            {esMio && (
                                                <div className="d-flex gap-1 text-muted border-start ps-1" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                                    <i className="bi bi-pencil cursor-pointer" title="Editar" style={{ cursor: 'pointer' }} onClick={() => alert("Próximamente: Editar mensaje")}></i>
                                                    <i className="bi bi-trash cursor-pointer" title="Eliminar" style={{ cursor: 'pointer' }} onClick={() => alert("Próximamente: Eliminar mensaje")}></i>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center p-4 mt-5 text-muted bg-white rounded-3 shadow-sm mx-auto border" style={{ maxWidth: '360px' }}>
                            <i className="bi bi-shield-lock-fill text-success display-6 mb-2 d-block" style={{ color: '#00a884' }}></i>
                            <span className="fw-semibold d-block text-dark mb-1">Conversación end-to-end</span>
                            Los mensajes enviados están protegidos. ¡Escribe el primer mensaje para iniciar el chat!
                        </div>
                    )}
                    <div ref={mensajesEndRef} />
                </div>

                {/* Entrada de Texto e Icono de Enviar */}
                <div className="card-footer bg-white border-top border-light-subtle p-3">
                    <form onSubmit={handleEnviar} className="d-flex align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control border-light-subtle bg-light px-4 py-2 rounded-pill"
                            style={{ fontSize: '0.92rem' }}
                            placeholder="Escribe un mensaje privado aquí..."
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                        />
                        <button 
                            className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                            type="submit" 
                            style={{ width: '42px', height: '42px', backgroundColor: '#00a884', borderColor: '#00a884' }}
                            disabled={!nuevoMensaje.trim()}
                        >
                            <i className="bi bi-send-fill text-white" style={{ fontSize: '0.95rem' }}></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatDirecta;