let pokemonList = [];

const pokemonAliases = {
  "mimikyu": "mimikyu-disguised",
  "giratina": "giratina-altered",
  "shaymin": "shaymin-land",
  "wormadam": "wormadam-plant"
};

async function cargarListaPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
    const data = await response.json();

    pokemonList = data.results.map((pokemon, index) => {
      const id = index + 1;

      return {
        name: pokemon.name,
        displayName: limpiarNombre(pokemon.name),
        id: id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      };
    });

    console.log("Lista de Pokémon cargada:", pokemonList.length);

  } catch (error) {
    console.log("Error cargando lista de Pokémon:", error);
  }
}

function limpiarNombre(name) {
  const baseName = name.split("-")[0];

  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

function mostrarSugerencias() {
  const input = document.getElementById("pokemonInput");
  const suggestions = document.getElementById("suggestions");

  const texto = input.value.toLowerCase().trim();

  if (texto.length === 0) {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    return;
  }

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
    suggestions.style.display = "block";
    return;
  }

  suggestions.innerHTML = resultados.map(pokemon => `
    <div class="suggestion-item" onclick="seleccionarPokemon('${pokemon.name}')">
      <img src="${pokemon.image}" alt="${pokemon.displayName}">
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
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      pokemonCard.innerHTML = "<p>Pokémon no encontrado.</p>";
      return;
    }

    const data = await response.json();

    let name = limpiarNombre(data.name);

    const id = data.id;

    const image =
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default;

    const abilities = data.abilities
      .map(ability => ability.ability.name)
      .join(", ");

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

          <img class="pokemon-img" src="${image}" alt="${name}">

          <div class="type-container">
            ${data.types.map(type => `
              <span class="type-badge ${type.type.name}">
                ${type.type.name}
              </span>
            `).join("")}
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
    pokemonCard.innerHTML = "<p>Error al conectar con la API.</p>";
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
