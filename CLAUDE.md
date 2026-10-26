# Flujo de trabajo con Git
- Nunca trabajar directamente sobre `main`.
- Antes de empezar una feature, crear una rama nueva: `feature/nombre-corto`.
- Commitear en esa rama con mensajes claros.
- Nunca hacer merge a `main` ni pushear a `main`. Tampoco pushees, el push el usuario manualmente, sólo commiteá.
- Evitar comentarios en el código y usar tipado extremadamente estricto.
- Al terminar, correr `npm run all` para normalizar y resumir qué cambió y qué quedó pendiente.
