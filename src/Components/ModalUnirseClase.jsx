import { useState } from 'react';

const ModalUnirseClase = ({ alCerrar, alGuardar }) => {
    const [codigo, setCodigo] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const codigoLimpio = codigo.trim().toUpperCase();

        if (!codigoLimpio) {
            setError('Debes ingresar el código de la clase.');
            return;
        }

        if (codigoLimpio.length < 2) {
            setError('El código debe tener al menos 2 caracteres.');
            return;
        }

        setCargando(true);
        try {
            await alGuardar(codigoLimpio);
            setCodigo('');
            setError('');
        } catch (err) {
            console.error('Error al unirse a la clase:', err);
            setError(err.response?.data?.message || 'No se pudo unir a la clase. Verifica el código e intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>

                    {/* Header */}
                    <div className="modal-header text-white" style={{ backgroundColor: '#1e8e3e', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <h5 className="modal-title fw-bold">Unirse a una Clase</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={alCerrar}
                            disabled={cargando}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4" style={{ backgroundColor: '#f8f9fa' }}>

                            {/* Error */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {/* Campo de código */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">
                                    Código de la Clase
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Ej: PROG101, MATE2024"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                    disabled={cargando}
                                    style={{ borderRadius: '10px' }}
                                    maxLength="20"
                                />
                                <div className="form-text mt-2">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Solicita el código de la clase a tu profesor.
                                </div>
                            </div>

                            {/* Información */}
                            <div className="p-3" style={{ backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                                <small className="text-success fw-semibold d-block">
                                    <i className="bi bi-check-circle-fill me-2"></i>¿Cómo obtener el código?
                                </small>
                                <small className="text-success d-block mt-2">
                                    Contáctate con tu profesor para que te proporcione el código único de la clase.
                                </small>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-top p-4" style={{ backgroundColor: '#ffffff' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={alCerrar}
                                disabled={cargando}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={cargando || !codigo.trim()}
                            >
                                {cargando ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Uniéndose...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-2"></i>Unirse
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalUnirseClase;
