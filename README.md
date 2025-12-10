# Frontend - Challenge

Este repositorio contiene el frontend para el challenge de Angular Academy 2025. La misma, consume la API de backend para gestionar usuarios, sesiones y métricas.

## Features Implementadas

### Autenticación y Seguridad

- Registro de Usuario: Formulario reactivo (usando ReactiveForms) con validaciones:
    - Formato de email.
    - Complejidad de contraseña (mínimo 8 caracteres y 1 número).
    - Confirmación de contraseña coincidente.

- Login: Autenticación de usuarios y almacenamiento del JWT en localStorage.
- Route Guards: Protección de rutas (/dashboard) que redirige al login si no existe una sesión válida.
- Interceptor HTTP: Inyección automática del token Bearer en todas las peticiones a la API.

### Dashboard y Datos

- Métricas Personales: Visualización de datos del usuario (Total de logins, Último acceso) todo obtenido desde el endpoint /me.
- Panel de Administrador: Sección que solo se muestra si el usuario tiene rol de admin, mostrando métricas globales del sistema y personales del admin.

## Guía de Instalación y Ejecución

1. Prerrequisitos

- node.js (v18 o superior)
- Angular CLI instalado globalmente:

```
npm install -g @angular/cli
```

El Backend debe estar corriendo en el puerto 3000 (ver el repositorio del backend).

2. Instalación de Dependencias

Ejecutar:
```
npm install
```

3. Configuración de Entorno

Verifica que el archivo `src/environments/environment.ts` apunte al backend local (HTTP, no HTTPS):
```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

4. Correr la Aplicación

Para iniciar el servidor:

```
ng serve -o
```
El flag -o abre automáticamente el navegador.

Támbien se puede usar `npm start`

La app deberá de correr en `http://localhost:4200`