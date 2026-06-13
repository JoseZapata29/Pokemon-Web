# Pokédex Interactiva

## Descripción

**Pokédex Interactiva** es una aplicación web desarrollada con **HTML, CSS y JavaScript** que permite buscar información de Pokémon utilizando datos obtenidos desde la **PokéAPI**.

El proyecto permite al usuario escribir el nombre de un Pokémon y visualizar información como su imagen, número de Pokédex, tipos, habilidades y estadísticas base. También incluye una función de autocompletado que muestra sugerencias mientras el usuario escribe.

Este proyecto fue creado como práctica de desarrollo web, consumo de APIs, manipulación del DOM y diseño de interfaces dinámicas.

---

## Vista previa

> Agrega aquí una captura de pantalla del proyecto cuando lo subas a GitHub.

```markdown
![Vista previa del proyecto](./assets/preview.png)
```

---

## Funcionalidades

* Búsqueda de Pokémon por nombre.
* Búsqueda al presionar la tecla **Enter**.
* Botón de búsqueda manual.
* Autocompletado con sugerencias mientras se escribe.
* Selección de Pokémon desde la lista de sugerencias.
* Visualización de imagen oficial del Pokémon.
* Visualización del número de Pokédex.
* Visualización de tipos con colores.
* Visualización de habilidades.
* Barras visuales para estadísticas base.
* Manejo de nombres especiales usando alias.
* Diseño responsive adaptable a diferentes tamaños de pantalla.

---

## Tecnologías utilizadas

* **HTML5**: estructura principal de la página.
* **CSS3**: estilos, diseño visual, colores, tarjetas y responsive design.
* **JavaScript**: lógica de búsqueda, eventos, consumo de API y manipulación del DOM.
* **PokéAPI**: API pública utilizada para obtener los datos de los Pokémon.

---

## Estructura del proyecto

```text
pokedex/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### `index.html`

Contiene la estructura principal de la aplicación, incluyendo el título, el buscador, el botón de búsqueda, el contenedor de sugerencias y la tarjeta donde se muestran los datos del Pokémon.

### `style.css`

Contiene todos los estilos visuales del proyecto, como el fondo, las tarjetas, los botones, los colores por tipo, las barras de estadísticas y el diseño responsive.

### `script.js`

Contiene la lógica principal del proyecto. Se encarga de cargar la lista de Pokémon, mostrar sugerencias, buscar información en la API y actualizar dinámicamente el contenido de la página.

---

## Cómo usar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pokedex-interactiva.git
```

### 2. Entrar a la carpeta del proyecto

```bash
cd pokedex-interactiva
```

### 3. Abrir el archivo `index.html`

Puedes abrir el archivo directamente en el navegador:

```text
index.html
```

También puedes usar la extensión **Live Server** en Visual Studio Code para ejecutar el proyecto de forma local.

---

## Ejemplos de búsqueda

Puedes buscar Pokémon escribiendo nombres como:

```text
pikachu
charizard
greninja
lucario
mimikyu
gengar
rayquaza
```

También puedes escribir solo las primeras letras para activar las sugerencias.

Ejemplo:

```text
char
```

La aplicación mostrará sugerencias como:

```text
Charmander
Charmeleon
Charizard
```

---

## Uso de la PokéAPI

Este proyecto utiliza la PokéAPI para obtener la información de los Pokémon.

Endpoint principal utilizado:

```text
https://pokeapi.co/api/v2/pokemon/{pokemon-name}
```

Ejemplo:

```text
https://pokeapi.co/api/v2/pokemon/pikachu
```

También se utiliza un endpoint para cargar la lista general de Pokémon usada en el autocompletado:

```text
https://pokeapi.co/api/v2/pokemon?limit=1300
```

---

## Manejo de nombres especiales

Algunos Pokémon tienen nombres especiales dentro de la API. Por ejemplo, Mimikyu aparece como:

```text
mimikyu-disguised
```

Para mejorar la experiencia del usuario, el proyecto utiliza un sistema de alias. Esto permite escribir simplemente:

```text
mimikyu
```

Y el programa buscará automáticamente:

```text
mimikyu-disguised
```

Ejemplo de alias usados:

```js
const pokemonAliases = {
  "mimikyu": "mimikyu-disguised",
  "giratina": "giratina-altered",
  "shaymin": "shaymin-land",
  "wormadam": "wormadam-plant"
};
```

---

## Funciones principales del JavaScript

### `cargarListaPokemon()`

Carga una lista general de Pokémon desde la PokéAPI. Esta lista se utiliza para mostrar sugerencias mientras el usuario escribe en el buscador.

### `limpiarNombre(name)`

Limpia nombres especiales y los muestra de forma más simple. Por ejemplo:

```text
mimikyu-disguised
```

Se muestra como:

```text
Mimikyu
```

### `mostrarSugerencias()`

Filtra la lista de Pokémon según las letras que el usuario escribe y muestra coincidencias debajo del buscador.

### `seleccionarPokemon(nombre)`

Permite seleccionar una sugerencia con un click. Al seleccionar un Pokémon, se coloca el nombre en el buscador y se realiza la búsqueda automáticamente.

### `buscarPokemon()`

Función principal que busca un Pokémon en la API, obtiene sus datos y genera dinámicamente una tarjeta visual con su información.

---

## Estadísticas mostradas

La aplicación muestra las siguientes estadísticas base:

* HP
* Ataque
* Defensa
* Ataque Especial
* Defensa Especial
* Velocidad

Cada estadística se muestra con una barra visual de color para facilitar la lectura.

---

## Diseño visual

El diseño está inspirado en la estética clásica de Pokémon y utiliza colores llamativos como:

* Rojo para el fondo principal.
* Azul para botones y detalles.
* Amarillo para títulos y elementos destacados.
* Blanco para la tarjeta principal.
* Colores personalizados para cada tipo de Pokémon.

---

## Mejoras futuras

Algunas ideas para mejorar el proyecto son:

* Agregar filtro por tipo de Pokémon.
* Mostrar evoluciones.
* Mostrar región de origen.
* Agregar botón de Pokémon aleatorio.
* Agregar sistema de Pokémon favoritos.
* Comparar estadísticas entre dos Pokémon.
* Mostrar debilidades y fortalezas.
* Crear equipos de 6 Pokémon.
* Agregar modo oscuro.
* Traducir tipos y habilidades al español.
* Mostrar movimientos principales.
* Agregar animaciones al cargar la tarjeta.

---

## Objetivo de aprendizaje

Este proyecto ayuda a practicar conceptos importantes de desarrollo web como:

* Consumo de APIs con `fetch()`.
* Uso de `async` y `await`.
* Manipulación del DOM.
* Eventos del usuario.
* Autocompletado dinámico.
* Renderizado de datos en HTML.
* Organización de archivos web.
* Diseño responsive.
* Separación entre estructura, estilos y lógica.

---

## Autor

Desarrollado por **Jr Zapata**.

---

## Créditos

Los datos de los Pokémon son obtenidos desde la PokéAPI:

```text
https://pokeapi.co/
```

Pokémon y sus respectivos nombres, imágenes y marcas pertenecen a Nintendo, Game Freak y The Pokémon Company. Este proyecto es solo con fines educativos.

---

## Licencia

Este proyecto puede ser utilizado con fines educativos y de práctica personal.
