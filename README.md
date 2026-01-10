# Armador de Equipos

Aplicación web para organizar partidos y armar equipos de forma
sencilla. Permite gestionar usuarios, crear partidos, registrar
jugadores, cargar resultados y visualizar estadísticas básicas.

## Índice

- [Tecnologías principales](#tecnologías-principales)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Futuras mejoras](#futuras-mejoras)

## Tecnologías principales
### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js (Typescript) / Express
- MongoDB
- JWT Authentication

## Funcionalidades
- Creación de equipos balanceados por habilidad
- Autenticación de usuarios
- Almacenamiento de partidos
- Carga de resultados y detalles
- Visualización de estadísticas

## Estructura del proyecto

    /backend
      /src
        /error
        /config
        /models
        /routes
        /services
        /middleware
        /controllers
        /repositories

    /frontend
      /public
      /src
        /css
        /hooks
        /utils
        /pages
        /routes
        /context
        /components

## Contribuciones

Este proyecto está en desarrollo activo y cualquier ayuda para mejorarlo es altamente valorada, ya sea en forma de código, ideas, documentación o reportes de errores.

### Cómo contribuir

1. Forkeá el repositorio

2. Creá una rama

Trabajá siempre sobre una rama descriptiva:
```bash
git checkout -b feature/nueva-funcionalidad
```
o
```bash
git checkout -b fix/descripcion-del-fix
```

3. Implementá tus cambios

4. Hacé commit y abrí un Pull Request:
Explicá qué problema resuelve o qué funcionalidad agrega tu PR.

### Qué se puede contribuir

- Nuevas funcionalidades (ver sección Futuras mejoras)
- Optimización de rendimiento
- Tests
- Mejoras de UI/UX
- Corrección de bugs
- Documentación (README, comentarios, ejemplos de uso)

## Futuras mejoras

- Agrupar partidos en colecciones ("futbol de los lunes")
- Sección armador de fixture (liga/torneo)
- Compartir partidos para que tus amigos no tengan que escribirlos a mano
- Goles de cada jugador
