/* A Saia da Carolina · Carballo — movimiento y utilidades.

   GSAP, ScrollTrigger y Lenis llegan de un CDN. Si fallan (bloqueador,
   red, CDN caído) nada de aquí puede romper la página: el maniquí sale
   ya vestido, las tarjetas ya colocadas, el horario pintado y el mapa
   y el teléfono funcionando. Por eso los estados "vacíos" del CSS
   viven bajo html.has-motion, que sólo se enciende desde este archivo.

   Movimiento de esta plantilla: DE PROBADOR. Prendas que se posan por
   capas, nada que rebote, nada de canvas, nada de partículas. Si algo
   parece tener prisa, está mal. */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsapReady = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const motion = gsapReady && !reduce;
  const html = document.documentElement;
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);
  if (motion) html.classList.add("has-motion");

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ================================================================
     Aviso de cookies
     El botón tiene que cerrarlo de verdad. Se oculta con [hidden] y en
     el CSS el display flex está en :not([hidden]), no en la clase, así
     que nada puede ganarle.
     ================================================================ */
  (function avisoCookies() {
    const banner = $(".aviso-cookies");
    const ack = $(".cookie-ack");
    if (!banner || !ack) return;
    const CLAVE = "saia-cookie-ack";
    let visto = false;
    try { visto = localStorage.getItem(CLAVE) === "1"; } catch (e) {}
    if (!visto) banner.hidden = false;
    ack.addEventListener("click", () => {
      banner.hidden = true;
      try { localStorage.setItem(CLAVE, "1"); } catch (e) {}
    });
  })();

  /* ================================================================
     Menú móvil
     ================================================================ */
  (function menuMovil() {
    const boton = $(".nav-boton");
    const menu = $("#nav-movil");
    if (!boton || !menu) return;
    const cerrar = () => { menu.hidden = true; boton.setAttribute("aria-expanded", "false"); };
    boton.addEventListener("click", () => {
      const abierto = boton.getAttribute("aria-expanded") === "true";
      menu.hidden = abierto;
      boton.setAttribute("aria-expanded", String(!abierto));
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", cerrar));
    window.addEventListener("resize", () => { if (window.innerWidth > 900) cerrar(); });
  })();

  /* ================================================================
     Mapa con consentimiento
     El iframe de Google NO existe hasta que se pulsa el botón: es lo
     único coherente con el aviso de "sin cookies de terceros".
     ================================================================ */
  (function mapa() {
    const caja = $("[data-mapa]");
    if (!caja) return;
    const boton = $("button", caja);
    if (!boton) return;
    boton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = caja.dataset.src;
      iframe.loading = "lazy";
      iframe.title = "Mapa de A Saia da Carolina en Rúa Igrexa, 28, Carballo";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      caja.innerHTML = "";
      caja.classList.add("cargado");
      caja.appendChild(iframe);
    });
  })();

  /* ================================================================
     WhatsApp pendiente
     No se publica un enlace de wa.me con un número sin confirmar: si
     el 611 no tuviera WhatsApp, el botón llevaría a una conversación
     con nadie. Mientras tanto, explica por qué y ofrece el teléfono.
     ================================================================ */
  (function whatsapp() {
    const boton = $("[data-abre-wasap]");
    const dlg = $("#dialogo-wasap");
    if (!boton || !dlg) return;
    boton.addEventListener("click", () => {
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    });
    $$("[data-cierra-dialogo]", dlg).forEach((b) =>
      b.addEventListener("click", () => {
        if (typeof dlg.close === "function") dlg.close();
        else dlg.removeAttribute("open");
      }));
  })();

  /* ================================================================
     Horario: qué día es hoy y si está abierto ahora
     Esto NO es movimiento: tiene que pasar también con movimiento
     reducido y sin GSAP.
     ================================================================ */
  (function horario() {
    const tramos = {
      0: [[11, 13.5]],                   /* domingo */
      1: [],                             /* lunes cerrado */
      2: [[10.5, 13.5], [17, 20]],
      3: [[10.5, 13.5], [17, 20]],
      4: [[10.5, 13.5], [17, 20]],
      5: [[10.5, 13.5], [17, 20]],
      6: [[11, 13.5]]                    /* sábado */
    };
    const ahora = new Date();
    const dia = ahora.getDay();
    const hora = ahora.getHours() + ahora.getMinutes() / 60;

    const fila = $('.dia[data-dia="' + dia + '"]');
    if (fila) fila.setAttribute("data-hoy", "");

    const estado = $("[data-estado]");
    if (!estado) return;
    const abierto = (tramos[dia] || []).some(([a, b]) => hora >= a && hora < b);
    estado.textContent = abierto ? "Abierto ahora" : "Cerrado ahora";
    estado.setAttribute("data-abierto", abierto ? "si" : "no");
    estado.hidden = false;
  })();

  /* ================================================================
     La cinta métrica lateral
     Cuánto llevas medido de la página. Es información, no adorno: se
     actualiza también sin GSAP y con movimiento reducido. Sólo toca
     transform y se limita a un fotograma con rAF.
     ================================================================ */
  (function recorrido() {
    const barra = $(".medida-recorrido");
    if (!barra) return;
    let pendiente = false;
    function pinta() {
      pendiente = false;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const p = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
      barra.style.transform = "scaleY(" + p.toFixed(4) + ")";
    }
    function pide() {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(pinta);
    }
    window.addEventListener("scroll", pide, { passive: true });
    window.addEventListener("resize", pide);
    pinta();
  })();

  /* ================================================================
     Contador de reseñas
     Con movimiento reducido no se anima, pero el número queda puesto
     igual: el contenido no depende del movimiento.
     ================================================================ */
  (function contador() {
    $$("[data-contador-num]").forEach((el) => {
      const fin = parseInt(el.dataset.contadorNum, 10) || 0;
      if (!motion) { el.textContent = String(fin); return; }
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: fin, duration: 1.3, ease: "power2.out",
            onUpdate: () => { el.textContent = String(Math.round(obj.v)); }
          });
        }
      });
    });
  })();

  /* ================================================================
     UN LOOK COMPLETO · vestir el maniquí capa a capa
     Qué prendas lleva puestas el maniquí es CONTENIDO, no adorno: con
     movimiento reducido o sin GSAP sigue cambiando, sólo que sin
     transición. Por eso vive aquí arriba y no en el bloque de
     movimiento.
     ================================================================ */
  const ORDEN_CAPAS = ["top", "falda", "abrigo", "calzado", "bolso"];

  const maniquiLook = $(".maniqui-look");
  const capas = $$(".capa");

  function vistePrendas(n) {
    if (!maniquiLook) return;
    ORDEN_CAPAS.forEach((clave, i) => {
      const g = $(".prenda-" + clave, maniquiLook);
      if (!g) return;
      const puesta = i < n;
      if (motion) {
        gsap.to(g, {
          opacity: puesta ? 1 : 0,
          y: puesta ? 0 : -18,
          duration: puesta ? 0.55 : 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });
      } else {
        g.style.opacity = puesta ? "1" : "0";
      }
    });
    const cont = $("[data-look-n]");
    if (cont) cont.textContent = String(Math.max(1, Math.min(ORDEN_CAPAS.length, n)));
    capas.forEach((c, i) => {
      if (i === n - 1) c.setAttribute("data-activa", "");
      else c.removeAttribute("data-activa");
    });
  }

  function abreCapa(i) {
    capas.forEach((c) => {
      c.removeAttribute("data-abierta");
      const b = $(".capa-btn", c);
      if (b) b.setAttribute("aria-expanded", "false");
    });
    const capa = capas[i];
    if (!capa) return;
    capa.setAttribute("data-abierta", "");
    const btn = $(".capa-btn", capa);
    if (btn) btn.setAttribute("aria-expanded", "true");
    vistePrendas(i + 1);
  }

  /* Acordeón (móvil). Cerrar una capa no desviste el maniquí: lo que se
     ha probado, probado está. */
  capas.forEach((capa, i) => {
    const btn = $(".capa-btn", capa);
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (capa.hasAttribute("data-abierta")) {
        capa.removeAttribute("data-abierta");
        btn.setAttribute("aria-expanded", "false");
      } else {
        abreCapa(i);
      }
    });
  });

  /* Quién manda sobre el maniquí depende del ancho, y hay que decidirlo
     otra vez si cambia: en móvil el acordeón, y en escritorio el
     desplazamiento. Si no se separan, los cinco disparadores de la
     columna (que en móvil caben casi en una pantalla) se disparan
     seguidos y le pasan por encima al acordeón. */
  const anchoAcordeon = window.matchMedia("(max-width: 900px)");
  let disparadoresLook = [];

  function ajustaModoLook() {
    disparadoresLook.forEach((t) => t.kill());
    disparadoresLook = [];
    if (!capas.length || !maniquiLook) return;

    if (anchoAcordeon.matches) {
      /* acordeón: la primera capa abierta y puesta, para que nadie se
         encuentre un maniquí desnudo y sin saber qué tocar */
      abreCapa(0);
      return;
    }
    if (!motion) {
      /* sin movimiento sale el look entero: no hay scroll que lo monte */
      vistePrendas(ORDEN_CAPAS.length);
      capas.forEach((c) => c.setAttribute("data-activa", ""));
      return;
    }
    vistePrendas(0);
    capas.forEach((capa, i) => {
      disparadoresLook.push(ScrollTrigger.create({
        trigger: capa,
        start: "top 62%",
        end: "bottom 38%",
        onEnter: () => vistePrendas(i + 1),
        onEnterBack: () => vistePrendas(i + 1)
      }));
    });
    /* pasado el bloque entero, el look se queda completo */
    disparadoresLook.push(ScrollTrigger.create({
      trigger: ".look-capas",
      start: "bottom 60%",
      onEnter: () => vistePrendas(ORDEN_CAPAS.length)
    }));
  }

  ajustaModoLook();
  if (typeof anchoAcordeon.addEventListener === "function") {
    anchoAcordeon.addEventListener("change", ajustaModoLook);
  }

  /* ================================================================
     RECIÉN LLEGADO · novedades desde una hoja de Google
     ----------------------------------------------------------------
     Las 6 prendas de ejemplo ya están pintadas en el HTML. Aquí sólo
     se intenta sustituirlas. Si la hoja no está configurada, no
     responde, viene vacía o viene rota, NO se toca nada y NO se enseña
     ningún error: se queda lo pintado. Una tienda no puede tener un
     hueco roto en pantalla.

     Cómo se rellena la hoja: ver el comentario grande de index.html.
     ================================================================ */
  const ENLACE_IG = "https://www.instagram.com/asaiadacarolinastore/";
  let revisaPista = function () {};
  let preparaTarjetas = function () {};

  function pintarNovedades(filas) {
    const lista = $("#lista-novedades");
    if (!lista || !filas.length) return false;

    const alfiler =
      '<svg class="alfiler" viewBox="0 0 26 40" width="26" height="40">' +
      '<path d="M13,7 V33" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M13,33 l0,5" stroke="currentColor" stroke-width="1" fill="none"/>' +
      '<circle cx="13" cy="5" r="4.2" fill="currentColor"/></svg>';

    /* Un enlace de Drive copiado a mano (".../file/d/ID/view") no sirve
       como src de una imagen: hay que pedirle la miniatura. Se hace aquí
       para que la tienda pueda pegar el enlace tal cual lo copia. */
    const aImagen = (url) => {
      const m = String(url || "").match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?[^#]*id=)([-\w]{20,})/);
      return m ? "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1200" : url;
    };

    const esc = (t) => String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    const silueta = '<img class="prenda-silueta" src="assets/img/brand/maniqui.svg" alt="" aria-hidden="true" ' +
      'width="120" height="362" loading="lazy" decoding="async">';

    lista.innerHTML = filas.map((p, i) => {
      const enlace = p.instagram || ENLACE_IG;
      const foto = p.foto
        ? '<span class="prenda-foto">' + silueta +
          '<img src="' + esc(aImagen(p.foto)) + '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async"></span>'
        : '<span class="prenda-foto" data-sin-foto>' + silueta +
          '<span class="prenda-vacio">[FOTO PENDIENTE]</span></span>';
      const precio = p.precio
        ? '<span class="precio" aria-hidden="true">' + alfiler + "<b>" + esc(p.precio) + "</b></span>" +
          '<span class="sr">Precio: ' + esc(p.precio) + "</span>"
        : "";
      return (
        '<li class="prenda-card" style="--n:' + i + '">' +
          '<a class="prenda-caja" href="' + esc(enlace) + '" target="_blank" rel="noopener">' +
            foto +
            '<span class="prenda-datos">' +
              '<span class="prenda-cat">' + esc(p.categoria || "") + "</span>" +
              '<span class="prenda-nombre">' + esc(p.nombre || "") + "</span>" +
              '<span class="prenda-tallas">' + esc(p.tallas || "") + "</span>" +
            "</span>" +
            precio +
          "</a>" +
        "</li>"
      );
    }).join("");

    /* fuera el aviso de "son de ejemplo": ya no lo son */
    const aviso = $("[data-aviso-ejemplo]");
    if (aviso) aviso.remove();
    return true;
  }

  (function novedades() {
    const cfg = window.SAIA_NOVEDADES || {};
    /* mientras el ID siga sin poner, ni se pide nada */
    if (!cfg.id || /PENDIENTE/i.test(cfg.id)) return;

    const url = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(cfg.id) +
      "/gviz/tq?tqx=out:json&sheet=" + encodeURIComponent(cfg.hoja || "Novedades");

    const limpia = (t) => String(t || "").trim().toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "");

    /* credentials "omit": la respuesta de Google trae un Set-Cookie y
       sin esto se guardaría una cookie de terceros, que es justo lo que
       el aviso de la web promete que no pasa. */
    fetch(url, { cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" })
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((txt) => {
        /* la respuesta de gviz viene envuelta en una llamada JS */
        const i = txt.indexOf("{");
        const j = txt.lastIndexOf("}");
        if (i < 0 || j < 0) throw new Error("respuesta inesperada");
        const datos = JSON.parse(txt.slice(i, j + 1));
        const tabla = datos.table || {};
        const cols = (tabla.cols || []).map((c) => limpia(c.label || c.id));
        const filas = (tabla.rows || []).map((fila) => {
          const p = {};
          (fila.c || []).forEach((celda, n) => {
            const clave = cols[n];
            if (!clave) return;
            p[clave] = celda ? (celda.f != null ? celda.f : celda.v) : "";
          });
          return p;
        }).filter((p) => p.nombre);

        if (!filas.length) return;
        if (pintarNovedades(filas)) {
          revisaPista();
          preparaTarjetas();
          if (gsapReady) ScrollTrigger.refresh();
        }
      })
      .catch(() => { /* silencio: se quedan los ejemplos ya pintados */ });
  })();

  /* ================================================================
     Carrusel de novedades: arrastre + scroll-snap nativo
     Es arrastre y snap nativo a propósito. Un pinned horizontal con
     scrub arrastra el retraso de Lenis y se ve como si el contenido
     tirase hacia el lado contrario.
     ================================================================ */
  (function carrusel() {
    const lista = $("#lista-novedades");
    const colgador = lista && lista.closest(".colgador");
    if (!lista || !colgador) return;

    let arrastrando = false, xInicio = 0, scrollInicio = 0, movido = 0;

    lista.addEventListener("pointerdown", (e) => {
      if (colgador.dataset.vistaActual !== "carrusel") return;
      if (e.pointerType === "touch") return;   /* el táctil ya arrastra solo */
      arrastrando = true;
      movido = 0;
      xInicio = e.clientX;
      scrollInicio = lista.scrollLeft;
      lista.setPointerCapture(e.pointerId);
      lista.classList.add("arrastrando");
    });
    lista.addEventListener("pointermove", (e) => {
      if (!arrastrando) return;
      const dx = e.clientX - xInicio;
      movido = Math.max(movido, Math.abs(dx));
      lista.scrollLeft = scrollInicio - dx;
    });
    const soltar = (e) => {
      if (!arrastrando) return;
      arrastrando = false;
      lista.classList.remove("arrastrando");
      try { lista.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    lista.addEventListener("pointerup", soltar);
    lista.addEventListener("pointercancel", soltar);
    /* Sin esto no hay arrastre: al apretar sobre la foto el navegador
       empieza SU arrastre nativo de imagen/enlace y se come todos los
       pointermove siguientes. La tarjeta se queda clavada. */
    lista.addEventListener("dragstart", (e) => e.preventDefault());
    /* un arrastre no debe acabar abriendo Instagram */
    lista.addEventListener("click", (e) => { if (movido > 6) { e.preventDefault(); movido = 0; } }, true);

    const pista = $("[data-pista-arrastre]");
    revisaPista = function () {
      if (!pista) return;
      const hayMas = lista.scrollWidth - lista.clientWidth > 8;
      pista.style.visibility = hayMas && colgador.dataset.vistaActual === "carrusel" ? "visible" : "hidden";
    };
    lista.addEventListener("scroll", revisaPista, { passive: true });
    window.addEventListener("resize", revisaPista);
    revisaPista();

    $$(".vista-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const vista = btn.dataset.vista;
        colgador.dataset.vistaActual = vista;
        $$(".vista-btn").forEach((b) => {
          const activa = b === btn;
          b.classList.toggle("activa", activa);
          b.setAttribute("aria-pressed", String(activa));
        });
        if (vista === "rejilla") lista.scrollLeft = 0;
        revisaPista();
        if (gsapReady) ScrollTrigger.refresh();
      });
    });
  })();

  /* ================================================================
     A partir de aquí, sólo movimiento.
     ================================================================ */
  if (!motion) return;

  /* ---------- Lenis ----------
     lerp alto a propósito (0.16): esta página tiene una galería que se
     arrastra en horizontal, y el retraso de asentamiento de Lenis, que
     no se nota en vertical, ahí se lee como "el contenido se va para
     el otro lado durante un segundo". */
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.15, lerp: 0.16, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const destino = document.querySelector(a.getAttribute("href"));
        if (!destino) return;
        e.preventDefault();
        const nav = parseFloat(getComputedStyle(html).getPropertyValue("--nav-h")) *
          (parseFloat(getComputedStyle(html).fontSize) || 16);
        lenis.scrollTo(destino, { offset: -(nav || 74) - 10 });
      });
    });
  }

  /* ---------- División en caracteres (accesible) ----------
     El texto se sustituye por spans, así que la frase entera se
     conserva en aria-label y los spans quedan ocultos al lector.
     La palabra va en inline-block + nowrap: si no, con las letras en
     inline-block el navegador parte las palabras por la mitad. */
  function partirEnLetras(el) {
    const texto = el.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", texto);
    el.textContent = "";
    const letras = [];
    texto.split(" ").forEach((palabra, i, todas) => {
      const ws = document.createElement("span");
      ws.className = "split-word";
      ws.setAttribute("aria-hidden", "true");
      Array.from(palabra).forEach((ch) => {
        const cs = document.createElement("span");
        cs.className = "split-char";
        cs.textContent = ch;
        ws.appendChild(cs);
        letras.push(cs);
      });
      el.appendChild(ws);
      if (i < todas.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return letras;
  }

  /* Lento a propósito: una serif ligera que aparece deprisa parece un
     parpadeo. Casi un segundo y las letras casi sin desplazamiento. */
  $$("[data-split-char]").forEach((el) => {
    const letras = partirEnLetras(el);
    const esTitular = el.classList.contains("titular");
    gsap.set(letras, { yPercent: 40, opacity: 0 });
    const anima = () => gsap.to(letras, {
      yPercent: 0, opacity: 1,
      duration: 0.95, ease: "power3.out", stagger: 0.026
    });
    if (esTitular) gsap.delayedCall(0.15, anima);
    else ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: anima });
  });

  /* ---------- HERO: vestir el maniquí ----------
     Las prendas llegan de los lados y se posan por capas: translate +
     escala 0.96 -> 1, media larga cada una, escalonadas, sin rebote.
     Como son grupos de un SVG, el desplazamiento va en unidades del
     viewBox (460 de ancho), no en píxeles. */
  (function vistePrimerLook() {
    const svg = $(".maniqui-hero");
    if (!svg) return;
    const entradas = [
      { clave: "top",     desde: -520 },
      { clave: "falda",   desde:  520 },
      { clave: "calzado", desde: -520 },
      { clave: "bolso",   desde:  520 }
    ];
    const tl = gsap.timeline({ delay: 0.45 });
    entradas.forEach((e, i) => {
      const g = $(".prenda-" + e.clave, svg);
      if (!g) return;
      gsap.set(g, { x: e.desde, scale: 0.96, opacity: 0, transformOrigin: "50% 50%" });
      tl.to(g, {
        x: 0, scale: 1, opacity: 1,
        duration: 0.62, ease: "power3.out"
      }, i * 0.16);
    });
    const etiqueta = $(".etiqueta-look");
    if (etiqueta) tl.to(etiqueta, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.15");
  })();

  /* ---------- El resto del hero ---------- */
  (function heroTexto() {
    const partes = [
      $(".antetitulo"), $(".probador-linea"), $(".insignia"),
      $(".probador-botones"), $(".probador-pie")
    ].filter(Boolean);
    if (!partes.length) return;
    /* immediateRender false: si no, GSAP pinta el estado "from" al
       crear el tween y el hero se apaga antes de tiempo. */
    gsap.from(partes, {
      y: 18, opacity: 0, duration: 1, ease: "power3.out",
      stagger: 0.1, delay: 0.55, immediateRender: false
    });
  })();

  /* ---------- Las tarjetas de novedad entran con un giro mínimo ----------
     Envuelto en función porque hay que volver a llamarlo si la hoja
     sustituye las tarjetas. */
  preparaTarjetas = function () {
    const tarjetas = $$("#lista-novedades .prenda-card");
    if (!tarjetas.length) return;
    gsap.killTweensOf(tarjetas);
    gsap.set(tarjetas, { y: 26, opacity: 0, rotation: 1 });
    ScrollTrigger.create({
      trigger: "#lista-novedades",
      start: "top 84%",
      once: true,
      onEnter: () => gsap.to(tarjetas, {
        y: 0, opacity: 1, rotation: 0,
        duration: 0.6, ease: "power3.out", stagger: 0.075
      })
    });
  };
  preparaTarjetas();

  /* ---------- Lo que sube al entrar ---------- */
  $$(".familia, .tejidos-lista figure, .resena, .insta-hueco, .saia-foto, .saia-quien").forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (i % 4) * 0.05
      })
    });
  });

  /* ---------- Las barras del horario crecen desde arriba ----------
     Crecen hacia abajo, como el día. Marcas y barras comparten escala:
     lo que se anima es sólo la escala en Y, nunca la posición. */
  $$(".franjas-dias .dia").forEach((dia, i) => {
    const barras = $$(".tramo, .tramo-cerrado", dia);
    if (!barras.length) return;
    ScrollTrigger.create({
      trigger: ".franjas", start: "top 82%", once: true,
      onEnter: () => gsap.to(barras, {
        scaleY: 1, duration: 0.75, ease: "power3.out", stagger: 0.05, delay: i * 0.06
      })
    });
  });

  /* ---------- Marquesina: lenta y continua ----------
     La pista lleva el texto 4 veces; moverla un cuarto y repetir es un
     bucle sin costura y sin recalcular nada por frame. */
  (function marquesina() {
    const pista = $(".marquesina-pista");
    if (!pista) return;
    gsap.to(pista, { xPercent: -25, duration: 46, ease: "none", repeat: -1 });
  })();

  /* ---------- Botones magnéticos ---------- */
  $$(".magnetico").forEach((el) => {
    const fuerza = 0.26;
    el.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * fuerza,
        y: (e.clientY - (r.top + r.height / 2)) * fuerza,
        duration: 0.5, ease: "power3.out"
      });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "power2.out" });
    });
  });

  /* ---------- El rótulo se retira al bajar ---------- */
  (function cabecera() {
    const nav = $("#rotulo");
    if (!nav) return;
    let ultimo = 0;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const menu = $("#nav-movil");
        if (y < 140 || (menu && !menu.hidden)) {
          gsap.to(nav, { yPercent: 0, duration: 0.35, overwrite: true });
        } else if (y > ultimo + 6) {
          gsap.to(nav, { yPercent: -100, duration: 0.4, overwrite: true });
        } else if (y < ultimo - 6) {
          gsap.to(nav, { yPercent: 0, duration: 0.35, overwrite: true });
        }
        ultimo = y;
      }
    });
  })();

  /* Las fuentes cambian el alto de casi todo: hasta que están, las
     medidas de ScrollTrigger son las de la fuente de respaldo. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

})();
