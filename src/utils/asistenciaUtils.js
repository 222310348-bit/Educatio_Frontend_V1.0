const ESTADO_ASISTENCIA_MAP = {
    P: 'Presente',
    A: 'Presente',
    F: 'Ausente',
    J: 'Justificado',
    Presente: 'Presente',
    Ausente: 'Ausente',
    Justificado: 'Justificado',
    Asistencia: 'Presente',
    Falta: 'Ausente'
};

const ESTADO_ASISTENCIA_CODE = {
    Presente: 'P',
    Ausente: 'F',
    Justificado: 'J'
};

const normalizarEstadoAsistencia = (estado) => {
    const valor = estado == null ? '' : String(estado).trim();
    if (!valor) return 'Desconocido';

    if (valor.length === 1) {
        const letra = valor.toUpperCase();
        return ESTADO_ASISTENCIA_MAP[letra] || valor;
    }

    const capitalizado = valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
    return ESTADO_ASISTENCIA_MAP[capitalizado] || valor;
};

const obtenerCodigoEstadoAsistencia = (estado) => {
    const normalizado = normalizarEstadoAsistencia(estado);
    return ESTADO_ASISTENCIA_CODE[normalizado] || normalizado;
};

const obtenerClaseBadgeEstado = (estado) => {
    const normalizado = normalizarEstadoAsistencia(estado);
    if (normalizado === 'Presente') return 'bg-success';
    if (normalizado === 'Ausente') return 'bg-danger';
    if (normalizado === 'Justificado') return 'bg-warning';
    return 'bg-secondary';
};

export {
    normalizarEstadoAsistencia,
    obtenerCodigoEstadoAsistencia,
    obtenerClaseBadgeEstado
};
