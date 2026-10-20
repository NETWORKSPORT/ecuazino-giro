# Ecuazino · Giro

Pantalla de bienvenida animada de Ecuazino (giro 7-7-7 + logo + "100% ecuatoriano").
Sitio estático: HTML, CSS y JS sin dependencias ni compilación.

## Ver en local
Abre `index.html` en el navegador, o en VS Code usa la extensión **Live Server**.

## Estructura
- `index.html` – página
- `assets/css/styles.css` – estilos y animaciones
- `assets/js/main.js` – monedas, interacción del logo
- `assets/img/` – logo y fondo de la plataforma
- `vercel.json` – caché de assets para Vercel

## Publicar en Vercel
1. Importa este repositorio en vercel.com → Add New → Project.
2. Framework preset: **Other**. Sin comando de build. Output: raíz del proyecto.
3. En Settings → Domains agrega tu dominio y copia los registros DNS que indique Vercel.
