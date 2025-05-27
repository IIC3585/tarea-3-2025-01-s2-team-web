[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_WqwbqVu)

# Proyecto Tarea 3 - Equipo Web

## Distribución del trabajo
- **Javiera Norambuena**: 
  - **Registro de usuarios**: Permite crear nuevas cuentas y gestionar sesiones de usuario.
   - **Buscar clima por ciudad (GET)**: Consulta el clima de cualquier ciudad utilizando una operación GET a la API externa.
   - **Página de favoritos**: Permite agregar (POST) y eliminar (DELETE) ciudades favoritas utilizando JSONPlaceholder como API externa. Además, cada ciudad favorita cuenta con un dropdown que muestra información actualizada del clima (GET).
   - **Bugfixes generales**: Corrección de errores y mejoras en la experiencia de usuario.

- **Felipe Abarca**:
  - Configuración inicial del proyecto y ajustes en `App.vue`.
  - Desarrollo del componente `Weather.vue` para mostrar información del clima.
  - Implementación e integración de servicios para consumir APIs en `services/`.

- **0wulf**:
  - Integración de Tailwind CSS y Headless UI.
  - Responsividad, diseño general y optimización del código.
  - Despliegue de la aplicación en Netlify.


## Pasos para levantar la aplicación localmente
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navegar al directorio del proyecto:
   ```bash
   cd tarea-3-2025-01-s2-team-web/T3
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```
4. Buildear la aplicación:
   ```bash
   npm run build
   ```
5. Iniciar el servidor de desarrollo:
   ```bash
   npm run preview
   ```
6. Abrir el navegador en la URL que se muestra en la terminal (por defecto, `http://localhost:4173`).

## Resumen de funcionalidades implementadas
- **Autenticación**: Registro y login de usuarios.
- **Vista Home**: Muestra información del clima actual en la ubicación actual y permite buscar dentro de un grupo de ciudades.
- **Vista Favoritos**: Permite gestionar una lista de ubicaciones favoritas.
- **Diseño responsivo**: Uso de Tailwind CSS para un diseño adaptable y Headless UI para componentes más complejos.
- **Enrutamiento**: Navegación entre vistas mediante Vue Router.

### Funcionalidades faltantes
- N/A


## Uso de IA

> ***Disclaimer**: Esta aplicación fue construida con la ayuda de ChatGPT*