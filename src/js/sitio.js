/* ==========================================================
   Pequeñas ayudas de la página. Si este archivo no carga,
   todo sigue funcionando: solo se pierden las animaciones.
   ========================================================== */

/* ---------- 1. Aparición suave al bajar por la página ----------
   Los elementos con la clase "revelar" empiezan un poco más abajo
   y transparentes, y aparecen cuando entran en la pantalla. */
(function () {
  var elementos = document.querySelectorAll(".revelar");
  var sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Si la persona pidió menos movimiento, o el navegador es antiguo, no animamos.
  if (!elementos.length || sinMovimiento || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("con-animacion");

  var observador = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target); // se anima una sola vez
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  elementos.forEach(function (el) {
    observador.observe(el);
  });
})();

/* ---------- 2. Formulario de contacto ----------
   La página no tiene servidor propio, así que el formulario prepara
   el mensaje y abre el programa de correo de la persona. */
(function () {
  var formulario = document.querySelector("[data-contacto]");
  if (!formulario) return;

  var aviso = formulario.querySelector("[data-aviso]");

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var nombre = formulario.elements.nombre.value.trim();
    var correo = formulario.elements.correo.value.trim();
    var mensaje = formulario.elements.mensaje.value.trim();

    if (!nombre || !correo || !mensaje) {
      aviso.textContent = "Por favor completa tu nombre, tu correo y el mensaje.";
      return;
    }
    if (!formulario.elements.correo.checkValidity()) {
      aviso.textContent = "Revisa tu correo: parece que le falta algo (por ejemplo, la @).";
      formulario.elements.correo.focus();
      return;
    }

    var asunto = "Mensaje de " + nombre + " desde la página";
    var cuerpo = mensaje + "\n\n" + nombre + "\n" + correo;

    window.location.href =
      "mailto:" + formulario.dataset.contacto +
      "?subject=" + encodeURIComponent(asunto) +
      "&body=" + encodeURIComponent(cuerpo);

    aviso.textContent =
      "Abrimos tu programa de correo con el mensaje listo. Solo falta que presiones Enviar.";
  });
})();
