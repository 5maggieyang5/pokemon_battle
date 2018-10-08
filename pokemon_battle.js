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

async function getPokemonsInfor(choosedPokemons) {

  /*  pokemon#1's information  */
  let response1  = await fetch(`${initialUrl}pokemon/${choosedPokemons[0]}`);
  let json1      = await response1.json();
  let pokemon1   = {};
  pokemon1.name  = json1.name;
  pokemon1.types = json1.types;
  pokemon1.stats = json1.stats;
  console.log("-----Pokemon1 Infor: ", pokemon1);

  /*  pokemon#2's information  */
  let response2  = await fetch(`${initialUrl}pokemon/${choosedPokemons[1]}`);
  let json2      = await response2.json();
  let pokemon2   = {};
  pokemon2.name  = json2.name;
  pokemon2.types = json2.types;
  pokemon2.stats = json2.stats;
  console.log("-----Pokemon2 Infor: ", pokemon2);

  return {
    pokemon1: pokemon1,
    pokemon2: pokemon2
  }
}

getPokemonsInfor(choosedPokemons)
  .then(result => {
    let pokemons = [result.pokemon1, result.pokemon2];
    console.log("-----Pokemons Infor: ", pokemons);
  })
  .catch(error => console.error(error));

// ----- RUN FUNCTION ----- //

const run = () => {
  console.log('Welcome to the Pokemon Battle!');
  checkInput(choosedPokemons);

}

run();