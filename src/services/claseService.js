import clienteAxios from '../config/axiosClient';

const claseService = {
    obtenerMisClases: async () => {
        // El interceptor de axios ya envía el token automáticamente
        const respuesta = await clienteAxios.get('/clases');
        return respuesta.data;
    },
    crear: async (datos) => {
        const respuesta = await clienteAxios.post('/clases', datos);
        return respuesta.data;
    },
    actualizar: async (codigoClase, datos) => {
        const res = await clienteAxios.put(`/clases/${codigoClase}`, datos);
        return res.data;
    },
    eliminar: async (codigoClase) => {
        const respuesta = await clienteAxios.delete(`/clases/${codigoClase}`);
        return respuesta.data;
    },
    
    // Métodos para gestión de alumnos en clases
    obtenerAlumnosClase: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/alumnos`);
        return respuesta.data?.data || respuesta.data || [];
    },
    
    agregarAlumnoClase: async (codigoClase, emails) => {
        const respuesta = await clienteAxios.post(`/clases/${codigoClase}/alumnos`, { emails });
        return respuesta.data;
    },
    
    desasignarAlumno: async (codigoClase, idAlumno) => {
        const respuesta = await clienteAxios.delete(`/clases/${codigoClase}/alumnos/${idAlumno}`);
        return respuesta.data;
    },
    
    unirseClase: async (codigoClase) => {
        const respuesta = await clienteAxios.post(`/clases/unirse/${codigoClase}`);
        return respuesta.data;
    }
};

export default claseService;