// Configuración de Eleventy, el programa que arma la página.
// Normalmente no hace falta tocar este archivo.

import fs from "node:fs";
import { HtmlBasePlugin } from "@11ty/eleventy";

const sitio = JSON.parse(fs.readFileSync("./src/_data/sitio.json", "utf8"));
const seccionesValidas = sitio.secciones.map((s) => s.slug);

// Revisa que un artículo tenga todos sus datos; si falta algo, avisa con un mensaje claro.
function revisarArticulo(articulo) {
  const d = articulo.data;
  const archivo = articulo.inputPath;
  for (const campo of ["titulo", "autor", "fecha", "seccion", "resumen"]) {
    if (!d[campo]) {
      throw new Error(`Al artículo ${archivo} le falta el dato "${campo}".`);
    }
  }
  if (!(d.fecha instanceof Date) || isNaN(d.fecha)) {
    throw new Error(
      `La fecha del artículo ${archivo} no es válida. Debe escribirse así: 2026-11-15 (año-mes-día, sin comillas).`
    );
  }
  if (!seccionesValidas.includes(d.seccion)) {
    throw new Error(
      `La sección "${d.seccion}" del artículo ${archivo} no existe. Opciones: ${seccionesValidas.join(", ")}.`
    );
  }
  if (d.imagen && !fs.existsSync(`./src/img/articulos/${d.imagen}`)) {
    throw new Error(
      `El artículo ${archivo} usa la imagen "${d.imagen}", pero no está en la carpeta src/img/articulos/.`
    );
  }
}

export default function (eleventyConfig) {
  // Permite publicar la página dentro de una subcarpeta (por ejemplo en GitHub Pages).
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Carpetas que se copian tal cual.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  // Todos los artículos, del más nuevo al más antiguo.
  eleventyConfig.addCollection("articulos", (api) => {
    const lista = api.getFilteredByGlob("src/articulos/*.md");
    lista.forEach(revisarArticulo);
    return lista.sort((a, b) => b.data.fecha - a.data.fecha);
  });

  // Solo los artículos de una sección.
  eleventyConfig.addFilter("deSeccion", (articulos, slug) =>
    articulos.filter((a) => a.data.seccion === slug)
  );

  // "vida-cristiana" -> "Vida cristiana"
  eleventyConfig.addFilter("nombreSeccion", (slug) => {
    const s = sitio.secciones.find((x) => x.slug === slug);
    return s ? s.nombre : slug;
  });

  // "vida-cristiana" -> todos los datos de esa sección
  eleventyConfig.addFilter("datosSeccion", (slug) =>
    sitio.secciones.find((x) => x.slug === slug)
  );

  // Fecha -> "15 de noviembre de 2026"
  eleventyConfig.addFilter("fechaLarga", (fecha) =>
    new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(fecha)
  );

  // Fecha -> "2026-11-15" (para los buscadores)
  eleventyConfig.addFilter("fechaISO", (fecha) => fecha.toISOString().slice(0, 10));

  eleventyConfig.addGlobalData("anio", () => new Date().getFullYear());

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
