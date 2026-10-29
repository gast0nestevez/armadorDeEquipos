# Normas generales
- Evitar comentarios en el código y usar tipado extremadamente estricto, incluso las funciones, por ejemplo:
`const sum: (a: number, b: number) => number = (a: number, b: number): number => a+b;`.
Lo único que no se debe tipar son los componentes, states o cualquier otra cosa exclusiva de React, sus tipos son muy verbosos.
- Al terminar, correr `npm run all` para normalizar y resumir qué cambió y qué quedó pendiente.

# Flujo de trabajo con Git
- Nunca trabajar directamente sobre `main`. Nunca hacer merge a `main` ni pushear a `main`.
- Antes de empezar una feature, crear una rama nueva: `feature/nombre-corto-y-descriptivo`. Los nombres de ramas y commits deben estar en inglés.
- Commitear en esa rama con mensajes claros, pero no pushear. El push lo hace el usuario manualmente. Se prefiere que el trabajo se separe en varios commits pequeños y declarativos dentro de una misma rama.
