import clienteAxios from '../config/axiosClient';

const mensajeService = {
    obtenerPorConversacion: async (conversacionId) => {
        const respuesta = await clienteAxios.get(`/mensajes/conversacion/${conversacionId}`);
        return respuesta.data?.data || respuesta.data || [];
    },
    enviarMensaje: async (conversacionId, contenido) => {
        const respuesta = await clienteAxios.post('/mensajes', { conversacionId, contenido });
        return respuesta.data;
    }
};

export default mensajeService;
