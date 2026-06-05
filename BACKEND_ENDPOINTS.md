# 📋 Guía de Implementación - Endpoints Backend Requeridos

## 🎯 Resumen de la Implementación

Se ha completado un **sistema integral de gestión de alumnos en clases** que permite:

### Para **Docentes (rol 3)**:
- ✅ Ver asistencias de todos sus alumnos por clase
- ✅ Gestionar alumnos (agregar y desasignar)
- ✅ Acceso exclusivo a estas funcionalidades

### Para **Estudiantes (rol 2)**:
- ✅ Unirse a clases mediante código único
- ✅ Ver sus propias asistencias

---

## 🔌 Endpoints Backend Requeridos

### 1️⃣ **Gestión de Alumnos en Clases**

#### `GET /clases/:codigo/alumnos`
**Descripción**: Obtiene la lista de todos los alumnos asignados a una clase.

**Parámetros**:
- `codigo` (path) - Código único de la clase

**Response (200)**:
```json
[
  {
    "IdAlumno": 1,
    "NombreCompleto": "Juan Pérez",
    "Correo": "juan.perez@email.com"
  },
  {
    "IdAlumno": 2,
    "NombreCompleto": "María García",
    "Correo": "maria.garcia@email.com"
  }
]
```

**Validación**:
- Solo docentes (rol 3) pueden acceder
- Debe ser docente de esa clase

---

#### `POST /clases/:codigo/alumnos`
**Descripción**: Agrega uno o varios alumnos a una clase.

**Parámetros**:
- `codigo` (path) - Código único de la clase
- `emails` (body) - Array de correos electrónicos

**Request**:
```json
{
  "emails": [
    "alumno1@email.com",
    "alumno2@email.com",
    "alumno3@email.com"
  ]
}
```

**Response (200)**:
```json
{
  "mensaje": "Alumnos agregados exitosamente",
  "agregados": 3,
  "duplicados": 0
}
```

**Respuestas de Error**:
- `400` - Correo ya existe en la clase: `{ "message": "El alumno ya existe en esta clase" }`
- `404` - Correo no encontrado: `{ "message": "Usuario no encontrado" }`
- `403` - No autorizado: `{ "message": "No tienes permiso" }`

**Validación**:
- Solo docentes (rol 3)
- No permitir duplicados en la misma clase
- Validar que los usuarios existan
- Validar que sean alumnos (rol 2)

---

#### `DELETE /clases/:codigo/alumnos/:idAlumno`
**Descripción**: Desasigna un alumno de una clase.

**Parámetros**:
- `codigo` (path) - Código único de la clase
- `idAlumno` (path) - ID del alumno

**Response (200)**:
```json
{
  "mensaje": "Alumno desasignado exitosamente"
}
```

**Respuestas de Error**:
- `404` - Alumno no encontrado: `{ "message": "Alumno no encontrado" }`
- `403` - No autorizado

**Validación**:
- Solo docentes (rol 3) de esa clase

---

### 2️⃣ **Sistema de Unión a Clases (Estudiantes)**

#### `POST /clases/unirse/:codigo`
**Descripción**: Permite que un estudiante se una a una clase usando su código único.

**Parámetros**:
- `codigo` (path) - Código único de la clase

**Response (200)**:
```json
{
  "mensaje": "Te has unido a la clase exitosamente",
  "clase": {
    "Codigo_PK": "PROG101",
    "NombreC": "Programación Web",
    "NombreCompletoDocente": "Dr. Juan López"
  }
}
```

**Respuestas de Error**:
- `404` - Clase no encontrada: `{ "message": "La clase no existe" }`
- `400` - Ya está asignado: `{ "message": "Ya estás asignado a esta clase" }`
- `403` - Código inválido o no activo

**Validación**:
- Solo estudiantes (rol 2) pueden acceder
- Verificar que el código sea válido y esté activo
- No permitir duplicados (estudiante ya en clase)
- El estudiante se asigna automáticamente

---

### 3️⃣ **Asistencias de Alumnos (Para Docentes)**

#### `GET /clases/:codigo/asistencias-alumnos`
**Descripción**: Obtiene el registro completo de asistencias de todos los alumnos en una clase.

**Parámetros**:
- `codigo` (path) - Código único de la clase

**Response (200)**:
```json
[
  {
    "NombreAlumno": "Juan Pérez",
    "idAlumno": 1,
    "fecha": "2024-05-27",
    "estado": "Presente"
  },
  {
    "NombreAlumno": "Juan Pérez",
    "idAlumno": 1,
    "fecha": "2024-05-26",
    "estado": "Presente"
  },
  {
    "NombreAlumno": "María García",
    "idAlumno": 2,
    "fecha": "2024-05-27",
    "estado": "Ausente"
  }
]
```

**Validación**:
- Solo docentes (rol 3) de esa clase

---

## 📊 Estructura de Datos (Referencia)

### Tabla: `clase_alumno` (Relación M:M)
```sql
CREATE TABLE clase_alumno (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Codigo_PK VARCHAR(50),
  IdAlumno INT,
  FechaAsignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Codigo_PK) REFERENCES clases(Codigo_PK),
  FOREIGN KEY (IdAlumno) REFERENCES usuarios(IdUsuario),
  UNIQUE KEY (Codigo_PK, IdAlumno)
);
```

### Tabla: `asistencias` (Posible estructura)
```sql
CREATE TABLE asistencias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Codigo_PK VARCHAR(50),
  IdAlumno INT,
  Fecha DATE,
  Estado ENUM('Presente', 'Ausente', 'Justificado'),
  FOREIGN KEY (Codigo_PK) REFERENCES clases(Codigo_PK),
  FOREIGN KEY (IdAlumno) REFERENCES usuarios(IdUsuario)
);
```

---

## 🔐 Reglas de Control de Acceso

| Endpoint | Rol Requerido | Permiso | Nota |
|----------|---------------|---------|------|
| GET `/clases/:codigo/alumnos` | Docente (3) | Lectura | Solo su clase |
| POST `/clases/:codigo/alumnos` | Docente (3) | Escritura | Agregar alumnos |
| DELETE `/clases/:codigo/alumnos/:idAlumno` | Docente (3) | Eliminar | Desasignar |
| POST `/clases/unirse/:codigo` | Estudiante (2) | Crear relación | Unirse a clase |
| GET `/clases/:codigo/asistencias-alumnos` | Docente (3) | Lectura | Asistencias alumnos |

---

## 📝 Notas Importantes

1. **Validación de Correos**: El frontend valida formato, pero el backend debe validar también.
2. **Prevención de Duplicados**: El frontend lo valida, pero el backend debe usar UNIQUE constraint.
3. **Autenticación**: Todos los endpoints requieren token en header `Authorization: Bearer <token>`
4. **Transacciones**: Al agregar múltiples alumnos, considerar usar transacciones.
5. **Auditoría**: Considerar registrar quién hizo qué cambios y cuándo.

---

## ✅ Frontend Implementado

Todos los componentes del frontend están listos:
- ✅ `Dashboard.jsx` - Panel principal con botones contextuales
- ✅ `GestionarAlumnosClase.jsx` - Gestión de alumnos para docentes
- ✅ `ModalAgregarAlumno.jsx` - Agregar alumnos (múltiples)
- ✅ `ModalUnirseClase.jsx` - Unirse a clase para estudiantes
- ✅ `VisualizarAsistenciasAlumnos.jsx` - Ver asistencias (docentes)
- ✅ `AppRouter.jsx` - Rutas actualizadas
- ✅ `claseService.js` - Métodos API listos

---

## 🚀 Próximos Pasos

1. Implementar los endpoints en el backend
2. Testear cada endpoint con Postman o herramienta similar
3. Ajustar nombres de campos según tu BD real
4. Implementar validaciones adicionales en backend si es necesario
