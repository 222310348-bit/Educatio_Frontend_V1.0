import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supportContacts from '../config/supportContacts';

const RestablecerContrasenia = () => {
    const navigate = useNavigate();
    const [mostrarInfo, setMostrarInfo] = useState(true);

    return (
        <main>
            <section className="hero-section d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-12 mx-auto">
                            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                                <div className="card-body p-5 text-center">
                                    <h2 className="hero-title mb-3">Recuperación de acceso</h2>
                                    <p className="text-muted mb-4">
                                        Lo sentimos, por favor contacte al administrador de su instituto para poder recuperar el acceso.
                                    </p>

                                    <div className="d-flex justify-content-center gap-3">
                                        <button className="btn btn-primary" onClick={() => navigate('/login')}>
                                            Volver al inicio de sesión
                                        </button>
                                        <button className="btn btn-outline-secondary" onClick={() => setMostrarInfo(!mostrarInfo)}>
                                            {mostrarInfo ? 'Más información' : 'Ocultar'}
                                        </button>
                                    </div>

                                    {mostrarInfo && (
                                        <div className="mt-4 text-start" style={{ maxWidth: '420px', margin: '0 auto' }}>
                                            <h6 className="fw-semibold">Sugerencias</h6>
                                            <ul className="mb-0 ps-3">
                                                <li>Contacte con el administrador de TI de su institución.</li>
                                                <li>Tenga a mano su correo institucional para acelerar la verificación.</li>
                                                <li>Evite compartir sus credenciales por medios no oficiales.</li>
                                            </ul>

                                            <h6 className="fw-semibold mt-3">Contactos de soporte</h6>
                                            <ul className="mb-0 ps-3">
                                                {supportContacts.map((c, i) => (
                                                    <li key={i}>
                                                        <a href={`mailto:${c.email}`} className="text-decoration-none">{c.name}: {c.email}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default RestablecerContrasenia;
