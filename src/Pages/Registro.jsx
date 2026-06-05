import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Registro = () => {
    const [IdRol_FK, setIdRol_FK] = useState('2');
    const [Nombres, setNombres] = useState('');
    const [Apellidos, setApellidos] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Contrasena, setContrasena] = useState('');
    const [errores, setErrores] = useState([]);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const validarFormulario = () => {
        const erroresTemp = [];
        if (!Nombres.trim()) erroresTemp.push('El nombre es obligatorio.');
        if (!Apellidos.trim()) erroresTemp.push('Los apellidos son obligatorios.');
        if (!Correo.trim()) {
            erroresTemp.push('El correo electrónico es obligatorio.');
        } else {
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(Correo)) {
                erroresTemp.push('Ingresa un correo electrónico válido.');
            }
        }
        if (!Contrasena.trim()) {
            erroresTemp.push('La contraseña es obligatoria.');
        } else if (Contrasena.length < 6) {
            erroresTemp.push('La contraseña debe tener al menos 6 caracteres.');
        }
        return erroresTemp;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validacion = validarFormulario();
        if (validacion.length > 0) {
            setErrores(validacion);
            return;
        }

        setCargando(true);
        setErrores([]);

        try {
            await authService.register({ IdRol_FK, Nombres, Apellidos, Correo, Contrasena });
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (error) {
            console.error('Error al crear cuenta:', error.response?.data || error.message);
            const mensaje = error.response?.data?.message || error.response?.data?.error || 'No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.';
            setErrores([mensaje]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <main>
            <section className="hero-section d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-12 mx-auto">
                            <form className="custom-form login-form" onSubmit={handleSubmit}>
                                <h2 className="hero-title text-center mb-4 pb-2">Crear cuenta</h2>

                                {errores.length > 0 && (
                                    <div className="alert alert-danger" role="alert">
                                        <ul className="mb-0">
                                            {errores.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary">Tipo de cuenta</label>
                                    <select
                                        className="form-select form-control-lg"
                                        value={IdRol_FK}
                                        onChange={(e) => setIdRol_FK(e.target.value)}
                                    >
                                        <option value="2">Estudiante</option>
                                        <option value="3">Docente</option>
                                    </select>
                                </div>

                                <div className="form-floating mb-4 p-0">
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={Nombres}
                                        onChange={(e) => setNombres(e.target.value)}
                                    />
                                    <label>Nombres</label>
                                </div>

                                <div className="form-floating mb-4 p-0">
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={Apellidos}
                                        onChange={(e) => setApellidos(e.target.value)}
                                    />
                                    <label>Apellidos</label>
                                </div>

                                <div className="form-floating mb-4 p-0">
                                    <input
                                        type="email"
                                        className="form-control"
                                        required
                                        value={Correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                    />
                                    <label>Correo electrónico</label>
                                </div>

                                <div className="form-floating p-0 mb-2">
                                    <input
                                        type="password"
                                        className="form-control"
                                        required
                                        value={Contrasena}
                                        onChange={(e) => setContrasena(e.target.value)}
                                    />
                                    <label>Contraseña</label>
                                </div>

                                <div className="row justify-content-center align-items-center mt-4">
                                    <div className="col-lg-6 col-6">
                                        <button type="submit" className="form-control" disabled={cargando}>
                                            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <span className="text-muted">¿Ya tienes cuenta? </span>
                                    <Link to="/login" style={{ color: 'black', textDecoration: 'none', fontWeight: '600' }}>
                                        Inicia sesión
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="video-wrap">
                    <video autoPlay loop muted playsInline className="custom-video">
                        <source src="/videos/video.mp4" type="video/mp4" />
                    </video>
                </div>
            </section>
        </main>
    );
};

export default Registro;
