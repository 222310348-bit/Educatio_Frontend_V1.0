import clienteAxios from '../config/axiosClient';

const usuarioService = {
    // Función para que el Admin cree empleados/otros usuarios
    crear: async (datos) => {
        // Esto enviará el token automáticamente gracias al interceptor que hicimos
        const respuesta = await clienteAxios.post('/usuarios', datos);
        return respuesta.data;
    },
    
    // Obtener todos los usuarios para listarlos en una tabla
    obtenerTodos: async () => {
        const respuesta = await clienteAxios.get('/usuarios');
        return respuesta.data;
    },

    actualizar: async (id, datos) => {
        const respuesta = await clienteAxios.put(`/usuarios/${id}`, datos);
        return respuesta.data;
    },

    eliminar: async (id) => {
        const respuesta = await clienteAxios.delete(`/usuarios/${id}`);
        return respuesta.data;
    }
};

export default usuarioService;