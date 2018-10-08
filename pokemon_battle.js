const fetch           = require("node-fetch");
const choosedPokemons = process.argv.slice(2);
const initialUrl      = "https://pokeapi.co/api/v2/";

// ----- Check user input of choosed pokemons ----- //

const checkInput = choosedPokemons => {
  if (choosedPokemons[0] && choosedPokemons[1]) {
    console.log(`Battle: ${choosedPokemons[0]} V.S. ${choosedPokemons[1]}`);
  } else {
    console.log("Please provide two Pokemons to start the battle.");
  }
};

// ----- Get both pokemons basic infor ----- //

async function getPokemonsInfor(pokemonName) {

  let response  = await fetch(`${initialUrl}pokemon/${pokemonName}`);
  let json      = await response.json();
  let pokemon   = {};
  pokemon.name  = json.name;
  pokemon.types = json.types;
  pokemon.stats = json.stats;

  return {
    pokemon: pokemon
  }
}

let promises = [];
choosedPokemons.map((pokemon) => {
  promises.push(getPokemonsInfor(pokemon));
})

Promise.all(promises)
  .then((results) => {
    let pokemon = [];
    for (let i = 0; i < results.length; i++) {
      pokemon.push(results[i].pokemon)
    }
    console.log("-----Pokemons Infor: ", pokemon);
  })
  .catch(error => console.error(error));

// ----- RUN FUNCTION ----- //

const run = () => {
  console.log('Welcome to the Pokemon Battle!');
  checkInput(choosedPokemons);

}

run();
