import { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import claseService from '../services/claseService';
import usuarioService from '../services/usuarioService';

const GestionClases = () => {
    const { auth } = useContext(AuthContext);
    const [clases, setClases] = useState([]);
    const [docentes, setDocentes] = useState([]); 
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({ NombreC: '', IdClase: '', IdDocenteSeleccionado: '' });

    const cargar = useCallback(async () => {
        try {
            const data = await claseService.obtenerMisClases();
            setClases(data);
            if (auth.rol === 1) {
                const usuarios = await usuarioService.obtenerTodos();
                setDocentes(usuarios.filter(u => u.IdRol_FK === 3));
            }
        } catch (err) { console.error("Error al cargar:", err); }
    }, [auth.rol]);

    useEffect(() => { cargar(); }, [cargar]); 

    const handleEliminar = async (codigo) => {
        if (window.confirm(`¿Seguro que quieres eliminar la clase ${codigo}?`)) {
            try {
                await claseService.eliminar(codigo);
                alert("Eliminada correctamente");
                cargar();
            } catch (err) { alert("Error al eliminar"); }
        }
    };

    const prepararEdicion = (clase) => {
        setEditando(clase.Codigo_PK);
        setFormData({ 
            NombreC: clase.NombreC, 
            IdClase: clase.IdClase, 
            IdDocenteSeleccionado: clase.IdUsuario_FK || '' 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await claseService.actualizar(editando, formData);
            } else {
                await claseService.crear(formData);
            }
            setEditando(null);
            setFormData({ NombreC: '', IdClase: '', IdDocenteSeleccionado: '' });
            cargar(); 
            alert("Operación exitosa");
        } catch (err) { alert("Error en la operación"); }
    };

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-4">Administración de Clases</h2>
            <div className="card shadow-sm border-0 mb-4 py-2">
                <div className="card-body">
                    <h6 className="fw-bold">{editando ? 'Editar Clase' : 'Crear materia'}</h6>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Nombre Materia" value={formData.NombreC} onChange={e => setFormData({...formData, NombreC: e.target.value})} required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" className="form-control" placeholder="ID Interno" value={formData.IdClase} onChange={e => setFormData({...formData, IdClase: e.target.value})} required />
                        </div>
                        <div className="col-md-3">
                            {(auth?.rol === 1) && (
                                <select className="form-select" value={formData.IdDocenteSeleccionado} onChange={e => setFormData({...formData, IdDocenteSeleccionado: e.target.value})} required>
                                   <option value="">Asignar Docente...</option>
                                    {docentes.map(d => <option key={d.IdUsuario_PK} value={d.IdUsuario_PK}>{d.NombresU} {d.ApellidosU}</option>)}
                                </select>
                            )}
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                            <button className={`btn ${editando ? 'btn-success' : 'btn-primary'} w-100`}>{editando ? 'Guardar' : 'Crear'}</button>
                            {editando && <button type="button" className="btn btn-secondary" onClick={() => {setEditando(null); setFormData({NombreC:'', IdClase:'', IdDocenteSeleccionado:''})}}>X</button>}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0 table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="ps-4">Código</th>
                            <th>Materia</th>
                            <th>ID Interno</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clases.map(clase => (
                            <tr key={clase.Codigo_PK}>
                                <td className="ps-4 fw-bold text-primary">{clase.Codigo_PK}</td>
                                <td>{clase.NombreC}</td>
                                <td>{clase.IdClase}</td>
                                <td className="text-center">
                                    <button onClick={() => prepararEdicion(clase)} className="btn btn-sm btn-outline-info me-2 border-0"><i className="bi bi-pencil-square fs-5"></i></button>
                                    <button onClick={() => handleEliminar(clase.Codigo_PK)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3 fs-5"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionClases;