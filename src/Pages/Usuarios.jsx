import { useEffect, useState } from 'react';
import usuarioService from '../services/usuarioService';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // Estado para el ojo
    const [formData, setFormData] = useState({
        NombresU: '', ApellidosU: '', Correo: '', Contraseña: '', IdRol_FK: "1"
    });

    const cargarUsuarios = async () => {
        const data = await usuarioService.obtenerTodos();
        setUsuarios(data);
    };

    useEffect(() => { cargarUsuarios(); }, []);

    const prepararEdicion = (u) => {
        setEditandoId(u.IdUsuario_PK);
        setFormData({
            NombresU: u.NombresU,
            ApellidosU: u.ApellidosU,
            Correo: u.Correo,
            IdRol_FK: u.IdRol_FK,
            Contraseña: '' // Se deja vacío; si el admin escribe algo, se reseteará
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                IdRol_FK: Number(formData.IdRol_FK)
            };

            if (editandoId) {
                await usuarioService.actualizar(editandoId, payload);
                alert("Usuario actualizado (y contraseña reseteada si se ingresó una)");
            } else {
                await usuarioService.crear(payload);
                alert("Usuario creado");
            }
            setEditandoId(null);
            setFormData({ NombresU: '', ApellidosU: '', Correo: '', Contraseña: '', IdRol_FK: '1' });
            cargarUsuarios();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.mensaje || error.message || "Error en la operación");
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario con el id ${id}? Esta acción no se puede deshacer.`)) {
            try {
                await usuarioService.eliminar(id);
                alert("Usuario eliminado con éxito");
                // Llamamos a la función que refresca la lista (cargar o obtenerUsuarios)
                cargarUsuarios(); 
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.mensaje || "Error al eliminar usuario");
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">
                        {editandoId ? 'Editar / Resetear Clave' : 'Registrar Nuevo Usuario'}
                    </h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small">Nombres</label>
                            <input type="text" className="form-control" value={formData.NombresU}
                                onChange={e => setFormData({...formData, NombresU: e.target.value})} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Apellidos</label>
                            <input type="text" className="form-control" value={formData.ApellidosU}
                                onChange={e => setFormData({...formData, ApellidosU: e.target.value})} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Correo</label>
                            <input type="email" className="form-control" value={formData.Correo}
                                onChange={e => setFormData({...formData, Correo: e.target.value})} required />
                        </div>
                        
                        {/* CAMPO DE CONTRASEÑA CON OJO */}
                        <div className="col-md-3">
                            <label className="form-label small">
                                {editandoId ? 'Nueva Clave (opcional)' : 'Contraseña'}
                            </label>
                            <div className="input-group">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-control" 
                                    placeholder={editandoId ? "Dejar vacío para mantener" : "Clave temporal"}
                                    value={formData.Contraseña}
                                    onChange={e => setFormData({...formData, Contraseña: e.target.value})}
                                    required={!editandoId} // Solo obligatoria si es usuario nuevo
                                />
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label small">Rol</label>
                            <select className="form-select" value={formData.IdRol_FK} required onChange={e => setFormData({...formData, IdRol_FK: e.target.value})}>
                                <option value="1">Admin</option>
                                <option value="2">Alumno</option>
                                <option value="3">Docente</option>
                            </select>
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                                <button className={`btn ${editandoId ? 'btn-success' : 'btn-primary'} w-100 shadow-sm`}>
                                {editandoId ? 'Guardar' : 'Crear usuario'}
                            </button>
                            {editandoId && (
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => {setEditandoId(null); setFormData({NombresU: '', ApellidosU: '', Correo: '', Contraseña: '', IdRol_FK: ''})}}
                                    >
                                        X
                                    </button>
                                )}
                        </div>
                    </form>
                </div>
            </div>
            <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>IdUsuario</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th className="text-end px-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.IdUsuario_PK}>
                                <td>{u.IdUsuario_PK}</td>
                                <td>{u.NombresU} {u.ApellidosU}</td>
                                <td>{u.Correo}</td>
                                <td>{u.IdRol_FK === 1 ? 'Admin' : u.IdRol_FK === 3 ? 'Docente' : 'Alumno'}</td>
                                <td className="text-end px-4">
                                    <button onClick={() => prepararEdicion(u)} className="btn btn-sm btn-info me-2 text-white">
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button onClick={() => handleEliminar(u.IdUsuario_PK)} className="btn btn-sm btn-danger">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Usuarios;