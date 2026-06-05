import clienteAxios from '../config/axiosClient';

const mensajeService = {
    obtenerPorConversacion: async (conversacionId) => {
        const respuesta = await clienteAxios.get(`/mensajes/conversacion/${conversacionId}`);
        return respuesta.data?.data || respuesta.data || [];
    },

    enviarMensaje: async (conversacionId, contenido) => {
        const respuesta = await clienteAxios.post('/mensajes', { conversacionId, contenido });
        return respuesta.data;
    },

    // PUT: Envía el nuevo texto al backend de Node
    editarMensaje: async (id, nuevoContenido) => {
        const respuesta = await clienteAxios.put(`/mensajes/${id}/editar`, { nuevoContenido });
        return respuesta.data;
    },

    // PATCH: Apaga las banderas de visibilidad en MongoDB
    eliminarMensaje: async (id) => {
        const respuesta = await clienteAxios.patch(`/mensajes/${id}/eliminar`);
        return respuesta.data;
    }
};

export default mensajeService;