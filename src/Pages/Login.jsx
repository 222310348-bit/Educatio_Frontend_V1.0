import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link

const Login = () => {
    const [Correo, setEmail] = useState('');
    const [Contrasena, setPassword] = useState('');
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Llamamos a tu servicio de Node.js
            const data = await authService.login({ Correo, Contrasena });
            
            // Guardamos el token que devuelve tu backend
            localStorage.setItem('token', data.token);
            
            // Actualizamos el estado global
            setAuth(data.usuario);
            
            // Redirigimos al dashboard (que crearemos luego)
            navigate('/dashboard');
        } catch (error) {
            console.error("Error al iniciar sesión", error.response?.data);
            alert("Credenciales incorrectas");
        }
    };

    return (
        <main>
            <section className="hero-section d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-12 mx-auto">
                            <form className="custom-form login-form" onSubmit={handleSubmit}>
                                <h2 className="hero-title text-center mb-4 pb-2">Iniciar sesión</h2>
                                
                                <div className="form-floating mb-4 p-0">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        required 
                                        value={Correo}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label>Correo electrónico</label>
                                </div>

                                <div className="form-floating p-0 mb-2">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        required 
                                        value={Contrasena}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label>Contraseña</label>
                                </div>

                                {/* Link de Olvidé mi contraseña */}
                                <div className="mb-4 text-center">
                                    <Link to="/forgot-password" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                                        He olvidado mi contraseña
                                    </Link>
                                </div>

                                <div className="row justify-content-center align-items-center">
                                    <div className="col-lg-5 col-6">
                                        <button type="submit" className="form-control">Entrar</button>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <span className="text-muted">¿No tienes cuenta? </span>
                                    <Link to="/register" style={{ color: 'black', textDecoration: 'none', fontWeight: '600' }}>
                                        Crear cuenta
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

export default Login;