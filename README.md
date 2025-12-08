# Armador de Equipos

Aplicación web para organizar partidos y armar equipos de forma
sencilla. Permite gestionar usuarios, crear partidos, registrar
jugadores, cargar resultados y visualizar estadísticas básicas.

## Tecnologías principales
### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js (Typescript) / Express
- MongoDB
- JWT Authentication 
- Google OAuth

## Funcionalidades
- Autenticación con Google
- Creación de equipos balanceados por habilidad
- Almacenamiento de partidos
- Carga de resultados y detalles
- Visualización de estadísticas

## Estructura del proyecto

    /backend
      /src
        /models
        /routes
        /services
        /middleware
        /controllers
        /repositories

    /frontend
      /src
        /css
        /hooks
        /utils
        /pages
        /routes
        /context
        /components

## Futuras mejoras

- Agrupar partidos en colecciones ("futbol de los lunes")
- Sección armador de fixture (liga/torneo)
- Compartir partidos para que tus amigos no tengan que escribirlos a mano
- Goles de cada jugador

