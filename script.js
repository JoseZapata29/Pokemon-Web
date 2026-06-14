let pokemonList = [];

const fallbackImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

const pokemonAliases = {
  "mimikyu": "mimikyu-disguised",
  "giratina": "giratina-altered",
  "shaymin": "shaymin-land",
  "wormadam": "wormadam-plant"
};

// Guarda datos ya consultados para no repetir llamadas a la API
const pokemonCache = {};

const typeCache = {};

const typeNamesES = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  electric: "Eléctrico",
  grass: "Planta",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  dragon: "Dragón",
  dark: "Siniestro",
  steel: "Acero",
  fairy: "Hada"
};

const allTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy"
];

async function cargarListaPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
    const data = await response.json();

    pokemonList = data.results.map((pokemon) => {
      const id = obtenerIdDesdeUrl(pokemon.url);

      return {
        name: pokemon.name,
        displayName: limpiarNombre(pokemon.name),
        id: id,
        url: pokemon.url
      };
    });

    console.log("Lista de Pokémon cargada:", pokemonList.length);

  } catch (error) {
    console.log("Error cargando lista de Pokémon:", error);
  }
}

function obtenerIdDesdeUrl(url) {
  const partes = url.split("/").filter(Boolean);
  return partes[partes.length - 1];
}

function limpiarNombre(name) {
  return name
    .split("-")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

async function obtenerDatosPokemon(nombre) {
  if (pokemonCache[nombre]) {
    return pokemonCache[nombre];
  }

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
  const data = await response.json();

  pokemonCache[nombre] = data;

  return data;
}

async function obtenerDatosTipo(tipo) {
  if (typeCache[tipo]) {
    return typeCache[tipo];
  }

  const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
  const data = await response.json();

  typeCache[tipo] = data;

  return data;
}

async function calcularDebilidades(pokemonTypes) {
  const multipliers = {};

  allTypes.forEach(type => {
    multipliers[type] = 1;
  });

  for (const defensiveType of pokemonTypes) {
    const typeData = await obtenerDatosTipo(defensiveType);
    const relations = typeData.damage_relations;

    relations.double_damage_from.forEach(type => {
      multipliers[type.name] *= 2;
    });

    relations.half_damage_from.forEach(type => {
      multipliers[type.name] *= 0.5;
    });

    relations.no_damage_from.forEach(type => {
      multipliers[type.name] *= 0;
    });
  }

  const weaknesses = Object.entries(multipliers)
    .filter(([type, multiplier]) => multiplier > 1)
    .map(([type, multiplier]) => {
      return {
        type: type,
        multiplier: multiplier
      };
    })
    .sort((a, b) => b.multiplier - a.multiplier);

  return weaknesses;
}

function crearHTMLDebilidades(weaknesses) {
  if (weaknesses.length === 0) {
    return `<p class="no-weakness">No tiene debilidades de tipo.</p>`;
  }

  return weaknesses.map(weakness => `
    <span class="type-badge ${weakness.type} weakness-badge">
      ${typeNamesES[weakness.type]}
      <strong>x${weakness.multiplier}</strong>
    </span>
  `).join("");
}

function obtenerImagenPokemon(data) {
  return (
    data.sprites.front_default ||
    data.sprites.other?.["official-artwork"]?.front_default ||
    data.sprites.other?.home?.front_default ||
    data.sprites.other?.dream_world?.front_default ||
    fallbackImage
  );
}

async function mostrarSugerencias() {
  const input = document.getElementById("pokemonInput");
  const suggestions = document.getElementById("suggestions");

  const texto = input.value.toLowerCase().trim();

  if (texto.length === 0) {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    return;
  }

  suggestions.innerHTML = `
    <div class="suggestion-item no-result">
      Cargando...
    </div>
  `;
  suggestions.style.display = "block";

  const resultados = pokemonList
    .filter(pokemon =>
      pokemon.name.toLowerCase().startsWith(texto) ||
      pokemon.displayName.toLowerCase().startsWith(texto)
    )
    .slice(0, 8);

  if (resultados.length === 0) {
    suggestions.innerHTML = `
      <div class="suggestion-item no-result">
        No se encontraron Pokémon
      </div>
    `;
    return;
  }

  const resultadosConImagen = await Promise.all(
    resultados.map(async (pokemon) => {
      try {
        const data = await obtenerDatosPokemon(pokemon.name);
        const image = obtenerImagenPokemon(data);

        return {
          ...pokemon,
          image: image
        };

      } catch (error) {
        return {
          ...pokemon,
          image: fallbackImage
        };
      }
    })
  );

  suggestions.innerHTML = resultadosConImagen.map(pokemon => `
    <div class="suggestion-item" onclick="seleccionarPokemon('${pokemon.name}')">
      <img 
        src="${pokemon.image}" 
        alt="${pokemon.displayName}"
        onerror="this.onerror=null; this.src='${fallbackImage}'"
      >
      <span>${pokemon.displayName}</span>
      <small>#${pokemon.id}</small>
    </div>
  `).join("");

  suggestions.style.display = "block";
}

function seleccionarPokemon(nombre) {
  const input = document.getElementById("pokemonInput");
  const suggestions = document.getElementById("suggestions");

  input.value = limpiarNombre(nombre);
  suggestions.innerHTML = "";
  suggestions.style.display = "none";

  buscarPokemon(nombre);
}

async function buscarPokemon(nombreSeleccionado = null) {
  const input = document.getElementById("pokemonInput");
  const pokemonCard = document.getElementById("pokemonCard");

  let pokemonName = nombreSeleccionado || input.value.toLowerCase().trim();

  if (pokemonName === "") {
    pokemonCard.innerHTML = "<p>Escribe el nombre de un Pokémon.</p>";
    return;
  }

  if (pokemonAliases[pokemonName]) {
    pokemonName = pokemonAliases[pokemonName];
  }

  try {
    const data = await obtenerDatosPokemon(pokemonName);

    let name = limpiarNombre(data.name);

    const id = data.id;

    const image =
      data.sprites.other?.["official-artwork"]?.front_default ||
      data.sprites.other?.home?.front_default ||
      data.sprites.front_default ||
      fallbackImage;

    const abilities = data.abilities
      .map(ability => ability.ability.name)
      .join(", ");

      const pokemonTypes = data.types.map(typeInfo => typeInfo.type.name);

const weaknesses = await calcularDebilidades(pokemonTypes);

const weaknessesHTML = crearHTMLDebilidades(weaknesses);

    const statNames = {
      hp: "HP",
      attack: "Ataque",
      defense: "Defensa",
      "special-attack": "Ataque Esp.",
      "special-defense": "Defensa Esp.",
      speed: "Velocidad"
    };

    const statIcons = {
      hp: "❤️",
      attack: "拳",
      defense: "🛡️",
      "special-attack": "✨",
      "special-defense": "🔰",
      speed: "💨"
    };

    const stats = data.stats
      .map(stat => {
        const statName = stat.stat.name;
        const statValue = stat.base_stat;

        const percent = Math.min((statValue / 150) * 100, 100);

        return `
          <div class="stat-row ${statName}">
            <div class="stat-icon">${statIcons[statName]}</div>

            <div class="stat-info">
              <div class="stat-header">
                <span>${statNames[statName]}</span>
                <strong>${statValue}</strong>
              </div>

              <div class="stat-bar">
                <div class="stat-fill" style="width: ${percent}%"></div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    pokemonCard.innerHTML = `
      <div class="pokemon-layout">
        <div class="pokemon-info">
          <h2 class="pokemon-name">${name.toUpperCase()}</h2>
          <p class="pokemon-id">#${id}</p>

          <img 
            class="pokemon-img" 
            src="${image}" 
            alt="${name}"
            onerror="this.onerror=null; this.src='${fallbackImage}'"
          >

          <div class="type-container">
            ${data.types.map(type => `
              <span class="type-badge ${type.type.name}">
                ${type.type.name}
              </span>
            `).join("")}
          </div>

          <div class="weaknesses-box">
  <h3>Debilidades</h3>
  <div class="weaknesses-list">
    ${weaknessesHTML}
  </div>
</div>

          <div class="abilities-box">
            <h3>Habilidades</h3>
            <p>${abilities}</p>
          </div>
        </div>

        <div class="pokemon-stats">
          <h3>Estadísticas</h3>
          ${stats}
        </div>
      </div>
    `;

  } catch (error) {
    pokemonCard.innerHTML = "<p>Pokémon no encontrado o error al conectar con la API.</p>";
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("pokemonInput");
  const suggestions = document.getElementById("suggestions");

  input.addEventListener("input", mostrarSugerencias);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buscarPokemon();

      suggestions.innerHTML = "";
      suggestions.style.display = "none";
    }
  });

  document.addEventListener("click", function(event) {
    const searchBox = document.querySelector(".search-box");

    if (!searchBox.contains(event.target)) {
      suggestions.innerHTML = "";
      suggestions.style.display = "none";
    }
  });

  cargarListaPokemon();
});