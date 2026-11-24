# IncidenciasHub · Sistema de Gestión de Incidencias

Aplicación web CRUD desarrollada en **Angular** y **TypeScript** para registrar y administrar incidencias institucionales (fallas de red, errores de acceso, mantenimiento de equipos, etc.).

Proyecto del reto individual **S06 | AP4 · Preparándonos para la Hackathon**.

> **Autor:** TU NOMBRE COMPLETO
> **Repositorio:** https://github.com/TU_USUARIO/gestion-incidencias
> **Video de sustentación:** ENLACE_AL_VIDEO

---

## Descripción

IncidenciasHub es una interfaz moderna con tema oscuro (morado, rosa y azul) que permite gestionar el ciclo de vida de una incidencia. El enfoque es **100% front-end**: no usa back-end, y los datos se guardan en el navegador mediante `localStorage`, por lo que persisten al recargar la página.

### Estructura de datos de la incidencia

| Campo | Descripción |
|---|---|
| `codigo` | Identificador único autogenerado (INC-001, INC-002, ...) |
| `titulo` | Asunto breve |
| `descripcion` | Detalle técnico |
| `responsable` | Técnico asignado |
| `prioridad` | Alta, Media o Baja |
| `estado` | Pendiente, En proceso o Resuelta |
| `fecha` | Fecha de registro (automática) |

---

## Funcionalidades

### Requeridas por el reto
1. **Listar:** tabla estructurada con todos los registros.
2. **Registrar:** formulario con validaciones activas.
3. **Visualizar:** vista con el detalle completo de cada incidencia.
4. **Actualizar:** edición de incidencias existentes.
5. **Eliminar:** borrado con confirmación previa.
6. **Buscar y filtrar:** por título, prioridad o estado.

### Mejoras propias
- Tarjetas de resumen (total, pendientes, en proceso, resueltas y alta prioridad abiertas) que filtran la tabla al hacer clic.
- Cambio rápido de estado desde la propia tabla.
- Ordenamiento por columna (código, título, prioridad, estado y fecha).
- Paginación.
- Notificaciones (toasts) al registrar, editar, eliminar o cambiar de estado.
- Exportación a CSV respetando filtros y orden.
- Contador de caracteres en la descripción.
- Botón para limpiar filtros y animaciones de entrada.
- Diseño oscuro y responsive.

---

## Capturas de pantalla

> Guarda tus capturas en la carpeta `docs/capturas/` y ajusta los nombres si es necesario.

| Panel de incidencias | Formulario de registro |
|---|---|
| ![Panel](docs/capturas/panel.png) | ![Formulario](docs/capturas/formulario.png) |

| Validaciones | Detalle |
|---|---|
| ![Validaciones](docs/capturas/validaciones.png) | ![Detalle](docs/capturas/detalle.png) |

| Confirmación al eliminar | Búsqueda y filtros |
|---|---|
| ![Eliminar](docs/capturas/eliminar.png) | ![Filtros](docs/capturas/filtros.png) |

---

## Tecnologías

- [Angular](https://angular.dev) (componentes standalone, signals y nuevo control de flujo `@if` / `@for`)
- TypeScript
- Formularios reactivos (`ReactiveFormsModule`)
- Angular Router
- SCSS con variables CSS
- `localStorage` como almacenamiento local

---

## Arquitectura

Flujo modular por capas: **Componentes ⇄ Servicios ⇄ Datos locales**.

```
src/app/
├── models/
│   └── incidencia.model.ts        # Interfaz Incidencia
├── services/
│   ├── incidencia.service.ts      # Lógica CRUD + persistencia en localStorage
│   └── toast.service.ts           # Notificaciones
├── components/
│   ├── incidencia-list/           # Panel: tabla, filtros, orden, paginación, resumen
│   ├── incidencia-form/           # Registrar y editar (validaciones)
│   ├── incidencia-detail/         # Detalle de una incidencia
│   ├── confirm-dialog/            # Diálogo de confirmación reutilizable
│   └── toast/                     # Contenedor de notificaciones
├── app.routes.ts                  # Rutas
├── app.ts / app.html / app.scss   # Componente raíz
└── app.config.ts
```

### Rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `IncidenciaList` | Panel de incidencias |
| `/nueva` | `IncidenciaForm` | Registrar |
| `/editar/:codigo` | `IncidenciaForm` | Editar |
| `/detalle/:codigo` | `IncidenciaDetail` | Ver detalle |

### Validaciones del formulario

- **Título:** obligatorio, entre 5 y 80 caracteres.
- **Descripción:** obligatoria, entre 10 y 500 caracteres.
- **Responsable:** obligatorio, mínimo 3 caracteres.
- **Prioridad y estado:** obligatorios.

---

## Requisitos previos

- [Node.js](https://nodejs.org) 20 o superior (se recomienda la versión LTS).
- npm (se instala junto con Node.js).
- [Angular CLI](https://angular.dev/tools/cli):

```bash
npm install -g @angular/cli
```

---

## Instalación y ejecución

1. **Clona el repositorio**

```bash
git clone https://github.com/TU_USUARIO/gestion-incidencias.git
```

2. **Entra a la carpeta del proyecto**

```bash
cd gestion-incidencias
```

3. **Instala las dependencias**

```bash
npm install
```

4. **Inicia el servidor de desarrollo**

```bash
ng serve
```

5. **Abre el navegador** en [http://localhost:4200](http://localhost:4200)

La aplicación se recarga automáticamente al guardar cambios.

### Generar versión de producción

```bash
ng build
```

Los archivos compilados quedan en la carpeta `dist/`.

---

## Datos de ejemplo

La primera vez que se abre la aplicación se cargan incidencias de ejemplo. Los datos se guardan en `localStorage` bajo la clave `incidencias`.

Para restablecerlos: abre las herramientas del navegador (F12) → **Application** → **Local Storage**, elimina la clave `incidencias` y recarga la página.

---

## Uso rápido

1. **Registrar:** pulsa **+ Nueva incidencia**, completa el formulario y guarda.
2. **Buscar y filtrar:** usa el buscador, los selectores de prioridad y estado, o las tarjetas de resumen.
3. **Ver detalle:** pulsa **Ver** en la fila.
4. **Editar:** pulsa **Editar**, modifica los datos y guarda. También puedes cambiar el estado directamente desde la tabla.
5. **Eliminar:** pulsa **Eliminar** y confirma en el diálogo.
6. **Exportar:** pulsa **Exportar CSV** para descargar la lista actual.

---

## Autor

**TU NOMBRE COMPLETO**
Reto individual S06 | AP4 · Preparándonos para la Hackathon