# A Saia da Carolina Store · Carballo

Web de una tienda de ropa de mujer en **Rúa Igrexa, 28, bajo · 15102 Carballo (A Coruña)**.
Sitio estático: HTML, CSS y un JavaScript. Sin framework, sin build, sin dependencias
que instalar. GSAP, ScrollTrigger y Lenis llegan de un CDN y la página funciona entera
aunque no lleguen.

- **Teléfono:** 611 88 77 61
- **Instagram:** [@asaiadacarolinastore](https://www.instagram.com/asaiadacarolinastore/)
- **Facebook:** [A saia da Carolina](https://www.facebook.com/p/A-saia-da-Carolina-61557484723591/)
- **Google:** 5,0 ★ con 49 reseñas
- **Horario:** lunes cerrado · martes a viernes 10:30–13:30 y 17:00–20:00 · sábado y
  domingo 11:00–13:30

---

## El concepto: el maniquí

El logo de la tienda es un vestido sobre maniquí dibujado con **una sola línea negra**.
De ahí sale toda la web:

- El **hero** es un probador: una franja vertical más clara hace de espejo, y dentro el
  maniquí del logo a gran tamaño. Al cargar, las prendas llegan de los lados y se le van
  poniendo por capas hasta completar el Look 01.
- Los **separadores** son una cinta métrica de modista: marcas finas cada 10 px y una más
  larga cada 50. La misma cinta recorre el lateral izquierdo marcando lo que llevas leído.
- Las **etiquetas de precio** van colgadas de un alfiler dibujado.
- En **«Un look completo»** el mismo maniquí se queda fijo y recibe una prenda por tarjeta:
  top → falda → abrigo → calzado → complementos.
- Los **huecos vacíos** (Instagram, fotos pendientes) llevan la silueta del maniquí de fondo.

El logo **no se anima dibujándose**. Aparece entero y lo que se mueve son las prendas que
lo visten.

---

## Cambiar el color de temporada

Todo el color de la web sale de **una sola variable**. Se cambia en `css/style.css`, arriba
del todo:

```css
:root{
  --acento: #9A7BB0;   /* malva · cambiar por temporada */
}
```

Con eso cambian de golpe: los precios, la etiqueta de «nuevo», los botones principales, el
domingo del horario, las estrellas, la cinta de recorrido y los textos pendientes. El resto
de la paleta (marfil, negro de línea, gris cálido) no se toca: es la identidad.

| Variable        | Valor     | Para qué                          |
|-----------------|-----------|-----------------------------------|
| `--marfil`      | `#F4EFE6` | fondo de todo                     |
| `--marfil-alto` | `#FBF8F2` | la franja del espejo, tarjetas    |
| `--tinta`       | `#151515` | texto, silueta y detalles         |
| `--gris`        | `#D9D2C7` | fondos de tarjeta y tela dibujada |
| `--acento`      | `#9A7BB0` | precio, etiquetas y CTA           |

---

## Novedades: «Recién llegado» desde una hoja de cálculo

Es la única parte de la web pensada para cambiar cada semana, y se cambia **sin tocar
código**: se edita una hoja de Google y la web la lee sola.

### 1. Crear la hoja

Una hoja de Google con una pestaña llamada **`Novedades`** y esta primera fila de
cabeceras, en este orden exacto:

| nombre | categoria | precio | tallas | foto | instagram |
|--------|-----------|--------|--------|------|-----------|
| Vestido midi plisado | vestidos | 49 € | S · M · L | https://… | https://instagram.com/p/… |

- **nombre** — el nombre de la prenda, tal cual quieras que salga.
- **categoria** — en minúsculas: `vestidos`, `faldas`, `tops`, `pantalones`, `abrigos`,
  `calzado`, `complementos`.
- **precio** — texto libre, se pinta tal cual (`49 €`, `desde 25 €`…). Si lo dejas vacío,
  no sale etiqueta.
- **tallas** — texto libre (`S · M · L`, `36 al 42`…).
- **foto** — URL pública de la foto, **alojada fuera de la web** (Drive compartido con
  «cualquiera con el enlace», Instagram, Imgur…). Un enlace de Drive pegado tal cual
  (`.../file/d/ID/view`) también vale: la web lo convierte solo a miniatura. Si la dejas
  vacía, la tarjeta sale con `[FOTO PENDIENTE]` y la silueta del maniquí de fondo.
- **instagram** — URL del post de esa prenda. Si la dejas vacía, la tarjeta lleva al perfil.

### 2. Publicarla

**Archivo → Compartir → Publicar en la web.**

### 3. Pegar el ID

El ID está en la URL de la hoja:

```
docs.google.com/spreadsheets/d/  ESTO_ES_EL_ID  /edit
```

Se pega en `index.html`, cerca del final del `<head>`:

```html
<script>
  window.SAIA_NOVEDADES = {
    id: "ID-DE-LA-HOJA-PENDIENTE",   // <- aquí
    hoja: "Novedades"
  };
</script>
```

### Qué pasa si algo falla

Mientras el `id` siga con el valor `PENDIENTE`, **la web no hace ninguna petición** y se
queda con las 6 prendas de ejemplo ya pintadas en el HTML. Si la hoja no responde, está mal
compartida, viene vacía o viene rota, pasa exactamente lo mismo y **no se enseña ningún
error**: una tienda no puede quedarse con un hueco roto en pantalla. El aviso de «son de
ejemplo» desaparece solo en cuanto entren las prendas de verdad.

Está probado: con la petición a Google cortada a propósito, las seis tarjetas de ejemplo
siguen en pantalla, visibles y sin errores en consola.

---

## Los seis huecos de Instagram

El feed de Instagram no se puede leer sin API, así que no hay muro automático: hay **seis
huecos** que se rellenan a mano. En `index.html`, sección `#instagram`, cada hueco es:

```html
<li class="insta-hueco" data-pendiente>
  <img class="insta-silueta" src="assets/img/brand/maniqui.svg" alt="" aria-hidden="true" …>
  <span class="insta-etiqueta">[FOTO DEL FEED 1]</span>
</li>
```

Para poner una foto de verdad, se sustituye el `<li>` entero por:

```html
<li>
  <a href="https://www.instagram.com/p/EL-POST/" target="_blank" rel="noopener">
    <img src="assets/img/photos/insta-1.jpg" alt="Descripción de la foto" width="600" height="600">
  </a>
</li>
```

---

## Lo que falta por confirmar

Nada de esta lista está inventado en la web: todo sale marcado entre corchetes, a la vista,
para que se note que falta.

| Marcador en la web | Qué hace falta |
|---|---|
| `[CONFIRMAR NOMBRE DE LA PROPIETARIA]` | El nombre de quien lleva la tienda. «Carolina» sale del rótulo, pero nadie lo ha confirmado. |
| `[AÑO DE APERTURA PENDIENTE]` | Desde cuándo está abierta. |
| `[CONFIRMAR CATEGORÍAS Y MARCAS]` | Qué familias vende de verdad y con qué marcas. Sale tres veces en «Qué encontrarás» y una en «Recién llegado». |
| `[EJEMPLO — SUSTITUIR]` | Las 6 prendas de muestra, con fotos de archivo. Se van solas al conectar la hoja. |
| `[PRECIO]` / `[TALLAS]` | En las prendas de ejemplo. |
| `[TEXTO DE RESEÑA PENDIENTE]` | Tres reseñas reales de Google, copiadas tal cual y con el nombre de quien las escribió. Son 49 y ninguna está copiada aquí. |
| `[WHATSAPP PENDIENTE]` | Si el 611 88 77 61 tiene WhatsApp. Hasta saberlo, el botón abre un diálogo que lo explica y ofrece el teléfono. |
| `[EMAIL PENDIENTE]` | Un correo de contacto, si lo hay. |
| `[CONFIRMAR CAMBIOS Y DEVOLUCIONES]` | Plazos y condiciones. |
| `[FOTO DEL FEED 1…6]` | Seis fotos del Instagram elegidas por la tienda. |
| `[PRENDAS DE EJEMPLO]` | La etiqueta del hero: qué prendas reales monta el Look 01. |

**No se ha publicado:** ninguna marca, ningún precio, «envíos a toda España», tienda
online, biografía de la propietaria ni texto de reseña. La valoración 5,0 ★ y las 49
reseñas sí son reales (ficha de Google).

---

## Fotografía y logo

- **El logo** es el de la tienda, recreado en SVG limpio a partir del original (un JPG de
  150 × 150 px). Se trazó con potrace sobre una ampliación y se separó en tres piezas:
  `maniqui.svg` (sólo la silueta, la que se usa a gran tamaño y como icono),
  `saia-script.svg` (sólo el texto manuscrito, el rótulo de la cabecera) y
  `saia-marca.svg` (las dos juntas, como el original).
- **Las fotos son de archivo**, no de la tienda, y así se dice en la propia web («Foto de
  archivo · ambiente», «Fotografía de archivo, etalonada para esta web»). Están todas
  pasadas por el mismo etalonaje —mismo punto de negro suave y mismo blanco marfil— para
  que fotos de orígenes distintos parezcan una sola sesión. Ninguna tiene caras
  reconocibles ni marcas legibles.
- **Las prendas del maniquí están dibujadas**, no fotografiadas: son SVG en el mismo
  sistema de coordenadas que el logo, pintadas debajo de la línea negra como en un figurín
  coloreado a mano. En la sección del look se dice explícitamente que son una ilustración.

Cuando lleguen fotos reales de la tienda, sustituyen a las de archivo en
`assets/img/photos/` conservando los nombres y los tamaños (`-560`, `-900`, `-1200`…).

---

## Estructura

```
index.html                    todo el contenido, en una página
404.html                      "Esta percha está vacía"
manifest.json
css/style.css
js/main.js
assets/img/brand/             logo en SVG + iconos PNG
assets/img/photos/            fotos etalonadas, en dos o tres anchos
assets/img/og-saia.jpg        imagen para redes (1200 × 630)
screenshots/                  cómo queda, en escritorio y en móvil
```

Secciones: hero-probador · «A saia» (el nombre) · Recién llegado · Un look completo ·
Qué encontrarás · Cuándo venir · Reseñas · Instagram · Contacto.

---

## Decisiones técnicas

- **Modo claro siempre.** No hay versión oscura y no se ofrece: una tienda de ropa se
  enseña con luz de escaparate.
- **Sin cookies de terceros.** El mapa de Google **no existe** hasta que se pulsa el botón:
  el `<iframe>` se crea en ese momento. Es lo único coherente con lo que promete el aviso.
  Comprobado: antes de pulsar no sale ni una petición a `google.com/maps`.
- **El aviso de cookies se cierra de verdad.** El `display:flex` va en
  `.aviso-cookies:not([hidden])`, no en la clase: si va en la clase, le gana a `[hidden]`
  y el botón deja de funcionar.
- **Movimiento reducido respetado.** Con `prefers-reduced-motion: reduce` el maniquí sale
  ya vestido, las tarjetas ya colocadas y el contador de reseñas con el 49 puesto. Lo que
  es contenido (qué capas lleva el maniquí, el número de reseñas, el estado «abierto
  ahora») sigue cambiando; lo que es adorno, no.
- **Sin canvas y sin blur por frame.** Nada se dibuja por fotograma.
- **El carrusel es arrastre y `scroll-snap` nativo**, no un pinned horizontal con scrub: el
  retraso de asentamiento de Lenis, que no se nota en vertical, en horizontal se lee como
  «el contenido se va para el otro lado durante un segundo».
- **El horario y sus marcas de hora salen de la misma escala** (10:00 a 20:30), calculada
  una sola vez al generar el HTML. Comprobado al píxel: el martes abre a las 10:30 justo
  por encima de la marca de las 11, y el sábado y el domingo justo en ella.
- **En móvil el sticky-stack pasa a acordeón.** Por debajo de 900 px mandan los botones, no
  el scroll, y se apagan los disparadores de la columna para que no se pisen.
- **Si GSAP no carga**, la página sale entera y quieta: los estados vacíos viven bajo
  `html.has-motion`, que sólo se enciende desde `main.js`.

---

## Publicar

Es un sitio estático: vale cualquier hosting. Para GitHub Pages:

1. Subir la carpeta a un repositorio.
2. *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
3. Actualizar en `index.html` el `<link rel="canonical">`, los `og:url` y `og:image` con la
   URL definitiva.

El `.nojekyll` ya está puesto para que GitHub no se coma nada.

Para verlo en local hace falta **servirlo por HTTP**, no abrir el archivo directamente
(el `fetch` de la hoja y algunos detalles no funcionan bajo `file://`):

```
python -m http.server 8000
```

y abrir `http://127.0.0.1:8000/`.
