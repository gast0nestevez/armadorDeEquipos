# Flujo de trabajo con Git
- Nunca trabajar directamente sobre `main`.
- Antes de empezar una feature, crear una rama nueva: `feature/nombre-corto`.
- Commitear en esa rama con mensajes claros.
- No hacer merge a `main` ni pushear a `main`. El merge lo hace el usuario manualmente.
- Al terminar, correr `npm run all` para normalizar, pushear la rama y resumir qué cambió y qué quedó pendiente.
