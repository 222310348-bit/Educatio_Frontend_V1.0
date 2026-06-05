import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import conversacionService from '../services/conversacionService';
import mensajeService from '../services/mensajeService';

const ConversacionesClase = () => {
    const { codigo } = useParams();
    const location = useLocation();
    const claseState = location.state?.clase;

    const { auth } = useContext(AuthContext);
    const userId = Number(auth?.id_usuario); 

    const [conversacion, setConversacion] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [cargando, setCargando] = useState(true);
    const mensajesEndRef = useRef(null);

    // NUEVOS ESTADOS PARA EDICIÓN [Punto 4]
    const [mensajeEditandoId, setMensajeEditandoId] = useState(null);
    const [textoEditado, setTextoEditado] = useState('');

    const cargarMensajes = async (convoId) => {
        try {
            const data = await mensajeService.obtenerPorConversacion(convoId);
            setMensajes(data);
        } catch (error) {
            console.error("Error al obtener los mensajes:", error);
        }
    };

    useEffect(() => {
        const iniciarChat = async () => {
            try {
                const dataConvo = await conversacionService.obtenerPorClase(codigo);
                if (dataConvo && dataConvo.length > 0) {
                    const convoPrincipal = dataConvo[0]; 
                    setConversacion(convoPrincipal);
                    await cargarMensajes(convoPrincipal._id || convoPrincipal.id);
                }
            } catch (err) {
                console.error("Error al inicializar el chat:", err);
            } finally {
                setCargando(false);
            }
        };
        iniciarChat();
    }, [codigo]);

    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    // HANDLERS PARA EDICIÓN Y ELIMINACIÓN
    const activarEdicion = (m) => {
        setMensajeEditandoId(m._id);
        setTextoEditado(m.contenido);
    };

    const cancelarEdicion = () => {
        setMensajeEditandoId(null);
        setTextoEditado('');
    };

    const guardarEdicion = async (id) => {
        if (!textoEditado.trim()) return;
        try {
            await mensajeService.editarMensaje(id, textoEditado.trim());
            setMensajeEditandoId(null);
            await cargarMensajes(conversacion._id || conversacion.id);
        } catch (err) {
            alert("No se pudo editar el mensaje.");
        }
    };

    const ejecutarEliminacion = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar tu mensaje? Esta acción no se puede deshacer.")) {
            try {
                await mensajeService.eliminarMensaje(id);
                await cargarMensajes(conversacion._id || conversacion.id);
            } catch (err) {
                alert("Error al intentar eliminar el mensaje.");
            }
        }
    };

    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !conversacion) return;

        try {
            const targetId = conversacion._id || conversacion.id;
            await mensajeService.enviarMensaje(targetId, nuevoMensaje.trim());
            setNuevoMensaje(''); 
            await cargarMensajes(targetId); 
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    if (cargando) return <div className="container p-5 text-center text-muted fw-semibold">Conectando al canal de la clase...</div>;

    return (
        <div className="container-fluid p-3 d-flex flex-column" style={{ backgroundColor: '#f0f2f5', height: 'calc(100vh - 40px)' }}>
            <div className="card shadow-sm border-0 flex-grow-1 d-flex flex-column overflow-hidden" style={{ borderRadius: '16px' }}>

                {/* Cabecera del Chat */}
                <div className="card-header bg-white py-3 border-bottom border-light-subtle">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.3px' }}>
                                {claseState?.NombreC || "Chat General de la Asignatura"}
                            </h5>
                            <small className="text-muted fw-medium">
                                <i className="bi bi-code-slash me-1"></i> Código: {codigo} • {mensajes.length} mensajes
                            </small>
                        </div>
                        <span className="badge rounded-pill bg-light text-secondary border px-3 py-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
                            Mi ID SQL: {userId}
                        </span>
                    </div>
                </div>

                {/* Área de Mensajes */}
                <div className="card-body overflow-auto p-4 d-flex flex-column gap-2" style={{ backgroundColor: '#efeae2' }}>
                    {conversacion ? (
                        mensajes.length > 0 ? (
                            mensajes.map((m) => {
                                const esMio = Number(m.emisorId) === userId; 
                                const estaEditando = mensajeEditandoId === m._id;

                                return (
                                    <div key={m._id || m.id} className={`d-flex ${esMio ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div 
                                            className="p-2 px-3 shadow-sm position-relative"
                                            style={{ 
                                                width: estaEditando ? '65%' : 'auto',
                                                maxWidth: '65%', 
                                                backgroundColor: esMio ? '#d9fdd3' : '#ffffff', 
                                                color: '#111b21',
                                                borderRadius: esMio ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                                border: esMio ? '1px solid #c1f0b8' : '1px solid #e9e9e9'
                                            }}
                                        >
                                            {!esMio && (
                                                <small className="fw-bold d-block mb-1 text-success" style={{ fontSize: '0.75rem', color: '#128c7e' }}>
                                                    {m.nombreEmisor}
                                                </small>
                                            )}

                                            {/* RENDER CONDICIONAL: ¿EDICIÓN O TEXTO NORMAL? */}
                                            {estaEditando ? (
                                                <div className="d-flex flex-column gap-2 py-1">
                                                    <input 
                                                        type="text"
                                                        className="form-control form-control-sm border-0 bg-white shadow-none"
                                                        value={textoEditado}
                                                        onChange={(e) => setTextoEditado(e.target.value)}
                                                        autoFocus
                                                        style={{ fontSize: '0.92rem', color: '#111b21' }}
                                                    />
                                                    <div className="d-flex justify-content-end gap-2 border-top pt-1" style={{ fontSize: '1.1rem' }}>
                                                        <i className="bi bi-check-lg text-success cursor-pointer me-2" title="Guardar" style={{ cursor: 'pointer' }} onClick={() => guardarEdicion(m._id)}></i>
                                                        <i className="bi bi-x-lg text-danger cursor-pointer" title="Cancelar" style={{ cursor: 'pointer' }} onClick={cancelarEdicion}></i>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="mb-1" style={{ fontSize: '0.92rem', lineHeight: '1.4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {m.contenido}
                                                    </p>

                                                    <div className="d-flex align-items-column align-items-sm-center justify-content-end gap-2 mt-1" style={{ float: 'right' }}>
                                                        <small className="text-muted" style={{ fontSize: '0.62rem' }}>
                                                            {m.editado && <span className="me-1 fw-bold text-secondary">(editado)</span>}
                                                            {new Date(m.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </small>

                                                        {esMio && (
                                                            <div className="d-flex gap-2 text-muted border-start ps-2 ms-1" style={{ fontSize: '0.72rem', opacity: 0.65 }}>
                                                                <i className="bi bi-pencil cursor-pointer" title="Editar" style={{ cursor: 'pointer' }} onClick={() => activarEdicion(m)}></i>
                                                                <i className="bi bi-trash cursor-pointer" title="Eliminar" style={{ cursor: 'pointer' }} onClick={() => ejecutarEliminacion(m._id)}></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center p-4 mt-5 text-muted bg-white rounded-3 shadow-sm mx-auto border" style={{ maxWidth: '360px' }}>
                                <i className="bi bi-chat-right-heart-fill text-success display-6 mb-2 d-block"></i>
                                <span className="fw-semibold d-block text-dark mb-1">Bandeja vacía</span>
                                No hay mensajes todavía. ¡Rómpe el hielo enviando el primero!
                            </div>
                        )
                    ) : (
                        <div className="text-center p-5 text-muted fw-medium">No se encontró una conversación activa para esta clase.</div>
                    )}
                    <div ref={mensajesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="card-footer bg-white border-top border-light-subtle p-3">
                    <form onSubmit={handleEnviar} className="d-flex align-items-center gap-2">
                        <input
                            type="text"
                            className="form-control border-light-subtle bg-light px-4 py-2 rounded-pill"
                            style={{ fontSize: '0.92rem', shadow: 'none' }}
                            placeholder="Escribe un mensaje aquí..."
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            disabled={!conversacion}
                        />
                        <button 
                            className="btn btn-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                            type="submit" 
                            style={{ width: '42px', height: '42px', backgroundColor: '#00a884', borderColor: '#00a884' }}
                            disabled={!nuevoMensaje.trim() || !conversacion}
                        >
                            <i className="bi bi-send-fill text-white" style={{ fontSize: '0.95rem' }}></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConversacionesClase;