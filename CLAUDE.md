# Luz y Palabra — sitio cristiano de artículos

## Contexto

- Sitio web cristiano donde 6 hermanos publican artículos para compartir conocimiento y noticias.
- **El editor (quien usa esta carpeta) es el único que sube artículos.** Los demás se los envían en Word o PDF, ya revisados.
- **El editor no sabe programar.** Explícale todo en español, con palabras simples y sin jerga. Si hay que instalar algo, guíalo paso a paso. No le pidas que edite código: hazlo tú.
- "Luz y Palabra" es un nombre provisorio. El nombre, el lema y el texto de bienvenida se cambian en `src/_data/sitio.json` (en ningún otro lugar).
- Todavía no hay dominio ni hosting. Por ahora se ve solo en el computador; después se publicará en un hosting gratuito.
- La carpeta está conectada a GitHub mediante **GitHub Desktop**. El editor guarda y sube los cambios desde ahí; no hagas commit ni push salvo que él lo pida.

## Cómo está hecho

Sitio estático armado con **Eleventy** (necesita Node.js). Cada artículo es un archivo de texto Markdown en `src/articulos/`. La portada y las secciones se generan solas a partir de esos archivos.

```
src/
  _data/sitio.json      Nombre, lema, bienvenida y lista de secciones
  _includes/            Plantillas (base, artículo, página, tarjetas)
  articulos/            UN ARCHIVO .md POR ARTÍCULO
  css/estilo.css        Diseño (colores al comienzo del archivo)
  img/articulos/        Imágenes de portada y del interior de los artículos
  img/secciones/        Imagen por defecto de cada sección (<slug>.jpg)
  img/arte/             Pinturas y fotos de la portada
  js/sitio.js           Animaciones y formulario de contacto
  index.njk             Portada: bienvenida + todos los artículos
  secciones.njk         Genera la página de cada sección
  quienes-somos.md      Página fija "Quiénes somos"
  404.njk               Página de "no encontrada"
  favicon.svg           Icono de la pestaña del navegador
eleventy.config.js      Configuración (orden por fecha, validaciones, fechas en español)
ver-pagina.bat          Doble clic para ver la página en el computador
entrada/                Word/PDF originales (no se suben a GitHub)
_site/                  Página ya armada (se genera sola, no editar)
```

Comandos:

- `npm start` — arma la página y la muestra en http://localhost:8080 (se actualiza sola al guardar).
- `npm run build` — arma la página en `_site/` y avisa si algún artículo tiene errores.

## Secciones

El campo `seccion` de un artículo debe ser exactamente uno de estos valores:

| Valor en `seccion`  | Nombre visible    |
| ------------------- | ----------------- |
| `estudios-biblicos` | Estudios bíblicos |
| `vida-cristiana`    | Vida cristiana    |
| `educacion`         | Educación         |
| `noticias`          | Noticias          |

Para agregar una sección nueva: añadirla en `src/_data/sitio.json` y agregar su imagen por defecto `src/img/secciones/<slug>.jpg`. El menú y la página de la sección se crean solos.

## Formato de un artículo

Archivo: `src/articulos/AAAA-MM-DD-titulo-corto.md` (minúsculas, sin tildes ni eñes, palabras separadas por guiones; la fecha del nombre es la misma que la del artículo).

```markdown
---
titulo: "Título del artículo"
autor: "Nombre del autor"
fecha: 2026-11-15
seccion: estudios-biblicos
resumen: "Una o dos frases que resumen el artículo (máximo unas 30 palabras)."
imagen:
---

Texto del artículo...

## Subtítulo

> Texto del versículo.
>
> *Juan 3:16*
```

Reglas de los datos:

- `titulo`, `autor`, `resumen`: siempre entre comillas dobles. Si el texto lleva comillas dentro, usar « ».
- `fecha`: año-mes-día, sin comillas. Es la fecha de publicación y define el orden (lo más nuevo primero).
- `imagen`: opcional. Si hay imagen de portada, guardarla en `src/img/articulos/` y escribir solo el nombre del archivo (ej. `imagen: la-oracion.jpg`). Si se deja vacío, la tarjeta usa la imagen por defecto de la sección.
- Los cinco primeros datos son obligatorios; si falta alguno o la sección no existe, `npm run build` falla con un mensaje que lo explica.

## Cómo convertir un Word o PDF en artículo

Cuando el editor entregue un archivo (normalmente lo dejará en la carpeta `entrada/`):

1. **Leer el documento completo.**
   - PDF: leerlo directamente.
   - Word (.docx): convertirlo con `npx mammoth "entrada/archivo.docx" --output-format=markdown` (o con la skill de docx). Si trae imágenes, extraerlas con `npx mammoth "entrada/archivo.docx" --output-dir=<carpeta temporal>`.
2. **Reunir los datos.** Tomar título y autor del documento. Si el editor no indicó la **sección**, el **autor** o la **fecha**, y no se deducen con claridad, preguntarle antes de seguir (todo en una sola pregunta). Si no dice la fecha, usar la de hoy.
3. **Escribir el resumen** (1–2 frases) solo si el documento no trae uno, y avisarle al editor para que lo apruebe.
4. **Pasar el texto a Markdown respetando al autor:**
   - **No cambiar la redacción.** El texto ya viene revisado: no resumir, no reescribir, no "mejorar", no agregar ni quitar contenido. Solo se corrige el formato.
   - Si se detecta un error evidente (tipeo, cita bíblica que no coincide con su referencia), **no corregirlo en silencio**: avisarle al editor.
   - El título va solo en `titulo`; no repetirlo dentro del texto. Tampoco repetir autor ni fecha.
   - Subtítulos con `##` y, dentro de ellos, `###`. Nunca usar `#`.
   - Versículos y citas largas como cita (`>`), con la referencia en una línea aparte en cursiva (`> *Salmo 23:1*`). Mantener la versión bíblica que usó el autor.
   - Conservar negritas, cursivas, listas y notas al pie. Quitar restos del Word/PDF: números de página, encabezados y pies repetidos, saltos de línea a mitad de frase, guiones de corte de palabra.
   - Bibliografía o notas al final: bajo un subtítulo `## Notas` o `## Bibliografía`.
5. **Imágenes.**
   - Portada: si el editor entrega una, guardarla en `src/img/articulos/` con nombre simple (minúsculas, sin espacios ni tildes), idealmente horizontal y de unos 1200 px de ancho, y anotarla en `imagen`. Si no hay, dejar `imagen:` vacío.
   - Imágenes dentro del texto: guardarlas en la misma carpeta y ponerlas con `![Descripción breve](/img/articulos/nombre.jpg)`.
   - No usar imágenes sacadas de internet sin que el editor confirme que se pueden usar.
6. **Comprobar.** Ejecutar `npm run build` y confirmar que no hay errores. Si es posible, mirar el artículo y su tarjeta en el navegador.
7. **Avisar al editor**, en palabras simples: qué artículo se agregó, en qué sección, qué dudas quedaron, y recordarle que para guardarlo debe abrir GitHub Desktop, escribir una descripción breve, y presionar "Commit" y luego "Push".

## Diseño

- Pedido del editor: fondo **blanco**, **cuadros azules con letras blancas** para llamar la atención, **texto negro** fuera de ellos, tipografía **sans-serif moderna** (Figtree), tono profesional pero cercano, muy visual.
- Imágenes: **pinturas clásicas cristianas de dominio público** (Wikimedia Commons) y fotos sin derechos (CC0). Cada imagen nueva debe anotarse en `creditos` dentro de `src/_data/sitio.json`; la lista se muestra al final de "Quiénes somos". No usar imágenes cuya licencia no esté comprobada.
- La portada (`src/index.njk`) es una landing: hero (cuadro azul + pintura), últimos artículos, "Explora por tema" (un cuadro por sección), "Sobre nosotros", formulario de contacto y pie con redes. Sus textos están en `src/_data/sitio.json`.
- El menú superior (marca a la izquierda, secciones a la derecha) le gustó al editor: **mantener esa distribución**.
- La imagen por defecto de cada sección es `src/img/secciones/<slug>.jpg`; el dato `foco` de la sección indica qué parte de la pintura se ve al recortarla.
- Las tarjetas muestran miniatura, título y, debajo, sección y fecha. No poner etiquetas en mayúsculas sobre los títulos.
- Colores y medidas están como variables al inicio de `src/css/estilo.css`. Las animaciones al bajar (clase `revelar`) y el formulario están en `src/js/sitio.js`; la página debe verse completa aunque el JavaScript no cargue.
- El formulario de contacto no tiene servidor: abre el programa de correo del visitante con el mensaje listo. El correo (`contacto.correo`) y las redes sociales (`redes`) de `sitio.json` son **inventados**: hay que reemplazarlos por los reales.
- Debe verse bien en el celular: probar siempre en ancho de teléfono antes de dar un cambio por terminado.
- Al imprimir un artículo se ocultan el menú y el pie.
- Los enlaces internos se escriben empezando con `/` (ej. `/noticias/`).

## Publicación (GitHub Pages)

- La página se publica sola en GitHub Pages cada vez que el editor hace "Push" desde GitHub Desktop. La receta está en `.github/workflows/publicar.yml`: arma el sitio con Eleventy y le pasa el prefijo de la subcarpeta (`--pathprefix`), así que los enlaces internos deben seguir escribiéndose con `/` al inicio.
- Tarda uno o dos minutos en actualizarse. Si algo falla, se ve en la pestaña "Actions" del repositorio en GitHub.
- El repositorio es público: no guardar en él nada privado (los Word/PDF originales van en `entrada/`, que no se sube).

## Pendiente

- Elegir el nombre definitivo.
- Reemplazar el correo de contacto y las redes sociales inventadas por los reales.
- Reemplazar los textos de ejemplo (portada, "Sobre nosotros", "Quiénes somos") y borrar los 4 artículos de ejemplo.
