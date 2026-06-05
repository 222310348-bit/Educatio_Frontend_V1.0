import clienteAxios from '../config/axiosClient';

const asistenciaService = {
    obtenerMisAsistencias: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/mis-asistencias`);
        return respuesta.data;
    },
    
    obtenerAsistenciasAlumnos: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/asistencias-alumnos`);
        return respuesta.data?.data || respuesta.data || [];
    },

    obtenerAlumnosClase: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/alumnos`);
        return respuesta.data?.data || respuesta.data || [];
    },

    crearAsistencia: async (asistencia) => {
        const respuesta = await clienteAxios.post('/asistencias', asistencia);
        return respuesta.data?.data || respuesta.data;
    },

    actualizarEstadoAsistencia: async (id, estado) => {
        const respuesta = await clienteAxios.put(`/asistencias/Estado/${id}`, { Estado: estado });
        return respuesta.data?.data || respuesta.data;
    },

    obtenerTodasMisAsistencias: async () => {
        const respuesta = await clienteAxios.get('/asistencias');
        return respuesta.data;
    }
};

export default asistenciaService;
