import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const CambiarContrasenia = () => {
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [errores, setErrores] = useState([]);
    const [exito, setExito] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const validarContrasena = () => {
        const nuevosErrores = [];

        if (!actual.trim()) {
            nuevosErrores.push('Debes ingresar tu contraseña actual.');
        }

        if (!nueva.trim()) {
            nuevosErrores.push('Debes ingresar una nueva contraseña.');
        }

        if (!confirmar.trim()) {
            nuevosErrores.push('Debes confirmar la nueva contraseña.');
        }

        if (nueva !== confirmar) {
            nuevosErrores.push('La nueva contraseña y la confirmación no coinciden.');
        }

        if (nueva.length > 0 && nueva.length < 12) {
            nuevosErrores.push('La nueva contraseña debe tener al menos 12 caracteres.');
        }

        if (nueva && !/[A-Z]/.test(nueva)) {
            nuevosErrores.push('Incluye al menos una letra mayúscula.');
        }

        if (nueva && !/[a-z]/.test(nueva)) {
            nuevosErrores.push('Incluye al menos una letra minúscula.');
        }

        if (nueva && !/[0-9]/.test(nueva)) {
            nuevosErrores.push('Incluye al menos un número.');
        }

        if (nueva && !/[^A-Za-z0-9]/.test(nueva)) {
            nuevosErrores.push('Incluye al menos un carácter especial (por ejemplo: !@#$%^&*).');
        }

        if (nueva && /\s/.test(nueva)) {
            nuevosErrores.push('La contraseña no puede contener espacios.');
        }

        setErrores(nuevosErrores);
        return nuevosErrores.length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setExito('');

        if (!validarContrasena()) {
            return;
        }

        setCargando(true);
        try {
            const respuesta = await authService.cambiarPassword({
                contrasenaActual: actual,
                nuevaContrasena: nueva
            });

            setExito(respuesta.mensaje || 'Contraseña actualizada correctamente.');
            setActual('');
            setNueva('');
            setConfirmar('');
            setErrores([]);
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || error.response?.data?.message || 'Error al cambiar la contraseña.';
            setErrores([mensajeError]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5" style={{ minHeight: '100vh' }}>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '20px' }}>
                        <div className="card-body p-5">
                            <div className="mb-4 text-center">
                                <h2 className="fw-bold">Cambiar Contraseña</h2>
                                <p className="text-muted mb-0">
                                    Protege tu cuenta con una contraseña segura y actualízala cuando lo necesites.
                                </p>
                            </div>

                            {exito && (
                                <div className="alert alert-success" role="alert">
                                    {exito}
                                </div>
                            )}

                            {errores.length > 0 && (
                                <div className="alert alert-danger" role="alert">
                                    <ul className="mb-0">
                                        {errores.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Contraseña actual</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        value={actual}
                                        onChange={(e) => setActual(e.target.value)}
                                        placeholder="Ingresa tu contraseña actual"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Nueva contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        value={nueva}
                                        onChange={(e) => setNueva(e.target.value)}
                                        placeholder="Ingresa una nueva contraseña segura"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Confirmar nueva contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        value={confirmar}
                                        onChange={(e) => setConfirmar(e.target.value)}
                                        placeholder="Repite la nueva contraseña"
                                        required
                                    />
                                </div>

                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                    <h6 className="fw-semibold mb-3">Recomendaciones para una contraseña segura</h6>
                                    <ul className="mb-0 ps-3">
                                        <li>Al menos 12 caracteres.</li>
                                        <li>Incluye mayúsculas, minúsculas, números y un carácter especial.</li>
                                        <li>No uses palabras comunes, fechas o datos personales.</li>
                                        <li>No compartas tu contraseña con nadie.</li>
                                    </ul>
                                </div>

                                <div className="d-grid gap-3">
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={cargando}>
                                        {cargando ? 'Actualizando contraseña...' : 'Actualizar contraseña'}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/dashboard')}>
                                        Volver al Dashboard
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CambiarContrasenia;
