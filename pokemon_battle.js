const fetch           = require("node-fetch");
const choosedPokemons = process.argv.slice(2);
const pokemon1        = choosedPokemons[0];
const pokemon2        = choosedPokemons[1];
const initialUrl      = "https://pokeapi.co/api/v2/";

  // ------------------------------------------------ //
 //       Check user input of choosed pokemons       //
// ------------------------------------------------ //

const checkInput = choosedPokemons => {
  if (choosedPokemons[0] && choosedPokemons[1]) {
    console.log(`Battle: ${choosedPokemons[0]} V.S. ${choosedPokemons[1]}`);
  } else {
    console.log("Please provide two Pokemons to start the battle.");
  }
};

  // ------------------------------------------------ //
 //            Get pokemon's basic infor             //
// ------------------------------------------------ //

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

  // ------------------------------------------------ //
 //          Get pokemons damage relations           //
// ------------------------------------------------ //

async function getPokemonsDamageRelations(typeURL) {

  let response         = await fetch(typeURL);
  let json             = await response.json();
  let damageRelation   = json.damage_relations;
  let double_damage_to = damageRelation.double_damage_to;
  let half_damage_to   = damageRelation.half_damage_to;
  let no_damage_to     = damageRelation.no_damage_to;

  let damageX2 = [];
  for(let damageType of double_damage_to) {
    damageX2.push(damageType.name)
  };

  let damageXhalf = [];
  for(let damageType of half_damage_to) {
    damageXhalf.push(damageType.name)
  };

  let damageXzero = [];
  for(let damageType of no_damage_to) {
    damageXzero.push(damageType.name)
  };

  return {
    damageX2: damageX2,
    damageXhalf: damageXhalf,
    damageXzero: damageXzero
  }
}

  // ------------------------------------------------ //
 //              Check pokemon stats                 //
// ------------------------------------------------ //

const checkTotalStats = stats => {
  let totalStats = 0;
  stats.forEach(stat => {
    totalStats += stat.base_stat;
  })
  return totalStats;
}

  // ------------------------------------------------ //
 //             Check type of advantage              //
// ------------------------------------------------ //

const typeOfAdvantage = (pokemon1Types, pokemon2Types) => {
  let p1 = 1;
  let p2 = 1;

  pokemon1Types.forEach( p1Type => {
    pokemon2Types.forEach( p2Type => {
      let p1damageX2    = p1Type.damageRelations.damageX2;
      let p1damageXhalf = p1Type.damageRelations.damageXhalf;
      let p1damageXzero = p1Type.damageRelations.damageXzero;

      let p2damageX2    = p2Type.damageRelations.damageX2;
      let p2damageXhalf = p2Type.damageRelations.damageXhalf;
      let p2damageXzero = p2Type.damageRelations.damageXzero;

      if(p1damageX2.indexOf(p2Type.name) !== -1) {
        p1 *= 2;
      }
      if(p1damageXhalf.indexOf(p2Type.name) !== -1) {
        p1 *= 0.5;
      }
      if(p1damageXzero.indexOf(p2Type.name) !== -1) {
        p1 *= 1;
      }
      if(p2damageX2.indexOf(p1Type.name) !== -1) {
        p2 *= 2;
      }
      if(p2damageXhalf.indexOf(p1Type.name) !== -1) {
        p2 *= 0.5;
      }
      if(p2damageXzero.indexOf(p1Type.name) !== -1) {
        p2 *= 1;
      }
    })
  })

  return p1 === p2 ? "no type advantage"
       : p1 > p2 ? "p1 win" : "p2 win";
}

  // ------------------------------------------------ //
 //             Initial data function                //
// ------------------------------------------------ //

async function init(){

  let pokemon1Infor = await getPokemonsInfor(pokemon1);
  let pokemon2Infor = await getPokemonsInfor(pokemon2);
  let pokemon1Totalstats = checkTotalStats(pokemon1Infor.pokemon.stats);
  let pokemon2Totalstats = checkTotalStats(pokemon2Infor.pokemon.stats);

  let pokemon1Types = [];
  for(let pokemon1Type of pokemon1Infor.pokemon.types) {
    pokemon1Types.push(pokemon1Type.type)
  };

  let pokemon2Types = [];
  for(let pokemon2Type of pokemon2Infor.pokemon.types) {
    pokemon2Types.push(pokemon2Type.type)
  };

  for (let poke1Type of pokemon1Types) {
    let pokemon1DamageRelations = await getPokemonsDamageRelations(poke1Type.url);
    poke1Type.damageRelations = pokemon1DamageRelations;
  }

  for (let poke2Type of pokemon2Types) {
    let pokemon2DamageRelations = await getPokemonsDamageRelations(poke2Type.url);
    poke2Type.damageRelations = pokemon2DamageRelations;
  }

  return {
    pokemon1Infor: pokemon1Infor,
    pokemon2Infor: pokemon2Infor,
    pokemon1Totalstats: pokemon1Totalstats,
    pokemon2Totalstats: pokemon2Totalstats,
    pokemon1Types: pokemon1Types,
    pokemon2Types: pokemon2Types
  }
}

  // ------------------------------------------------ //
 //                  RUN FUNCTION                    //
// ------------------------------------------------ //

const run = () => {
  console.log('Welcome to the Pokemon Battle!');
  checkInput(choosedPokemons);
  init()
  .then(results => {
    return typeOfAdvantage(results.pokemon1Types, results.pokemon2Types);
  })
  .then(results => {
    if (results === "p1 win") {
      console.log(`${pokemon1} has the favourable type advantage`)
    } else if (results === "p2 win"){
      console.log(`${pokemon2} has the favourable type advantage`)
    } else {
      init().then(results => {
        if (results.pokemon1Totalstats === results.pokemon2Totalstats) {
          console.log(`${pokemon1} is the first pokemon`);
        } else if (results.pokemon1Totalstats > results.pokemon2Totalstats) {
          console.log(`${pokemon1} has the highest base stats`)
        } else {
          console.log(`${pokemon2} has the highest base stats`)
        }
      })
    }
  })
  .catch( error => console.error(error))
}

run();
