import { useState } from 'react';

const ModalAgregarAlumno = ({ alCerrar, alGuardar, alumnosActuales }) => {
    const [emails, setEmails] = useState('');
    const [cargando, setCargando] = useState(false);
    const [erroresValidacion, setErroresValidacion] = useState([]);

    const correosActuales = alumnosActuales.map(a => (a.Correo || a.correo || '').toLowerCase());

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errores = [];

        // Validar que haya al menos un correo
        if (!emails.trim()) {
            errores.push('Debes ingresar al menos un correo electrónico.');
            setErroresValidacion(errores);
            return;
        }

        // Procesar correos
        const listaEmails = emails
            .split(/[,;\n]/)
            .map(email => email.trim().toLowerCase())
            .filter(email => email.length > 0);

        if (listaEmails.length === 0) {
            errores.push('Debes ingresar al menos un correo electrónico válido.');
            setErroresValidacion(errores);
            return;
        }

        // Validar formato de correos
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const correosInvalidos = listaEmails.filter(email => !regexEmail.test(email));
        if (correosInvalidos.length > 0) {
            errores.push(`Correos inválidos: ${correosInvalidos.join(', ')}`);
        }

        // Validar correos duplicados en la lista actual
        const correoDuplicados = listaEmails.filter(email =>
            correosActuales.includes(email.toLowerCase())
        );
        if (correoDuplicados.length > 0) {
            errores.push(`Ya existen alumnos con estos correos: ${correoDuplicados.join(', ')}`);
        }

        if (errores.length > 0) {
            setErroresValidacion(errores);
            return;
        }

        // Enviar datos
        setCargando(true);
        try {
            await alGuardar(listaEmails);
            setEmails('');
            setErroresValidacion([]);
        } catch (error) {
            console.error('Error al guardar:', error);
            setErroresValidacion(['Error al agregar alumno(s). Intenta de nuevo.']);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>

                    {/* Header */}
                    <div className="modal-header text-white" style={{ backgroundColor: '#1a73e8', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <h5 className="modal-title fw-bold">Agregar Alumno a la Clase</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={alCerrar}
                            disabled={cargando}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4" style={{ backgroundColor: '#f8f9fa' }}>

                            {/* Errores de validación */}
                            {erroresValidacion.length > 0 && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    <strong>Errores encontrados:</strong>
                                    <ul className="mb-0 mt-2">
                                        {erroresValidacion.map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Campo de correos */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">
                                    Correo(s) Electrónico(s)
                                </label>
                                <textarea
                                    className="form-control form-control-lg"
                                    placeholder="Ingresa uno o varios correos separados por comas, punto y coma o saltos de línea.&#10;Ej:&#10;alumno1@email.com&#10;alumno2@email.com"
                                    rows="5"
                                    value={emails}
                                    onChange={(e) => setEmails(e.target.value)}
                                    disabled={cargando}
                                    style={{ borderRadius: '10px' }}
                                />
                                <div className="form-text mt-2">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Puedes separar los correos con comas, punto y coma o saltos de línea.
                                </div>
                            </div>

                            {/* Ejemplo */}
                            <div className="p-3" style={{ backgroundColor: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                                <small className="text-success fw-semibold">
                                    <i className="bi bi-lightbulb-fill me-2"></i>Consejo:
                                </small>
                                <small className="text-success d-block mt-1">
                                    Los alumnos que ya estén asignados no podrán ser agregados nuevamente.
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
                                className="btn btn-primary px-4"
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Agregando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-2"></i>Agregar
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

export default ModalAgregarAlumno;
