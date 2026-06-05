export function formatFechaHora(fecha, hora) {
    // fecha puede ser 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS.ZZZZ', o formato legible;
    // hora puede ser 'HH:MM:SS' o estar vacía.
    if (!fecha && !hora) return 'Sin fecha';

    let dateStr = fecha || '';
    let timeStr = hora || '';

    // Si `fecha` contiene 'T', extraer fecha y hora desde ahí
    if (dateStr.includes('T')) {
        const [dPart, tPart] = dateStr.split('T');
        dateStr = dPart;
        if (!timeStr && tPart) {
            timeStr = tPart.split('.')[0].replace('Z', '').split('+')[0];
        }
    }

    // Limpiar la parte de hora si viene con milisegundos o zona
    if (timeStr) {
        timeStr = timeStr.split('.')[0].split(' ')[0].replace('Z', '');
    }

    // Intentar transformar YYYY-MM-DD -> DD-MM-YYYY
    const isoMatch = /^\s*(\d{4})[-\/](\d{2})[-\/](\d{2})\s*$/.exec(dateStr);
    if (isoMatch) {
        const [, y, m, d] = isoMatch;
        dateStr = `${d}-${m}-${y}`;
    } else {
        // Si no coincide, intentar parsear con Date y formatear
        const dt = new Date(dateStr);
        if (!isNaN(dt.getTime())) {
            const d = String(dt.getDate()).padStart(2, '0');
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const y = dt.getFullYear();
            dateStr = `${d}-${m}-${y}`;
            if (!timeStr) {
                timeStr = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:${String(dt.getSeconds()).padStart(2, '0')}`;
            }
        }
    }

    if (dateStr && timeStr) return `${dateStr} ${timeStr}`;
    if (dateStr) return dateStr;
    return 'Sin fecha';
}
