import clienteAxios from '../config/axiosClient';

const conversacionService = {
    obtenerPorClase: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/conversaciones`);
        return respuesta.data;
    }
    ,
    obtenerDirectas: async () => {
        const respuesta = await clienteAxios.get('/conversacion');
        return respuesta.data?.data || [];
    },
    obtenerPorId: async (id) => {
        const respuesta = await clienteAxios.get(`/conversacion/${id}`);
        return respuesta.data?.data || respuesta.data;
    },
    crearDirecta: async (participanteId) => {
        const payload = { esDirect: true, participanteId };
        const respuesta = await clienteAxios.post('/conversacion', payload);
        return respuesta.data;
    },
    crearDirectaPorCorreo: async (correo) => {
        const payload = { esDirect: true, participanteCorreo: correo };
        const respuesta = await clienteAxios.post('/conversacion', payload);
        return respuesta.data;
    }
};

export default conversacionService;
