import { useState, useEffect } from 'react';
import usuarioService from '../services/usuarioService';

const ModalNuevaClase = ({ alCerrar, alGuardar, auth }) => {
    const [docentes, setDocentes] = useState([]);
    const [datos, setDatos] = useState({
        NombreC: '',
        IdClase: '', // Este es el que pide tu tabla
        IdDocenteSeleccionado: ''
    });

    useEffect(() => {
        // Cargar docentes solo si el usuario es Admin
        if (auth.rol === 1) {
            usuarioService.obtenerTodos().then(data => {
                const soloDocentes = data.filter(u => u.IdRol_FK === 3);
                setDocentes(soloDocentes);
            });
        }
    }, [auth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validamos que si es admin, haya seleccionado un docente
        if (auth.rol === 1 && !datos.IdDocenteSeleccionado) {
            alert("Por favor, selecciona un profesor para esta clase");
            return;
        }
        await alGuardar(datos);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                    
                    {/* Header con color azul profesional */}
                    <div className="modal-header text-white" style={{ backgroundColor: '#1a73e8', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <h5 className="modal-title fw-bold">Crear Nueva Clase</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={alCerrar}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
                            
                            {/* Campo: Nombre de la Materia */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">Nombre de la Materia</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg fs-6" 
                                    placeholder="Ej: Programación Web" 
                                    onChange={e => setDatos({...datos, NombreC: e.target.value})} 
                                    required 
                                />
                            </div>

                            {/* Campo: ID Clase (El que pediste) */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">ID Clase (Identificador)</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg fs-6" 
                                    placeholder="Ej: PROG101" 
                                    onChange={e => setDatos({...datos, IdClase: e.target.value})} 
                                    required 
                                />
                                <div className="form-text">Este ID ayuda a organizar las materias internamente.</div>
                            </div>

                            {/* Campo: Asignar Docente (Solo visible para Admin) */}
                            {auth.rol === 1 && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary">Asignar Docente</label>
                                    <select 
                                        className="form-select form-select-lg fs-6" 
                                        required
                                        onChange={e => setDatos({...datos, IdDocenteSeleccionado: e.target.value})}
                                    >
                                        <option value="">Selecciona un profesor...</option>
                                        {docentes.map(d => (
                                            <option key={d.IdUsuario_PK} value={d.IdUsuario_PK}>
                                                {d.NombresU} {d.ApellidosU}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Footer con botones limpios */}
                        <div className="modal-footer border-0 p-3 justify-content-center" style={{ backgroundColor: '#f8f9fa', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                            <button type="button" className="btn btn-outline-secondary px-4 me-2" onClick={alCerrar} style={{ borderRadius: '8px' }}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary px-4 shadow-sm" style={{ borderRadius: '8px', backgroundColor: '#1a73e8' }}>
                                Crear Clase
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevaClase;