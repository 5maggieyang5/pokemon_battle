# Pokemon_Battle Project

Use Pokéapi (https://pokeapi.co/) to evaluate the type advantages of two Pokémon.
It takes two Pokémon and determine which one has the favourable type advantage.
- In the case of no type advantage the “winner” will be the Pokémon with the highest base stats.
- In the case of a tie the “winner” will be the first Pokémon passed to it.

## Dependencies

- "node-fetch": "^2.2.0"

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the app using the `node pokemon_battle.js pokemon1_name pokemon2_name` command. (Example: `node pokemon_battle.js bulbasaur charmander`)

## Thought Process

1. Check user input see whether two Pokémon name provided.
2. Use Pokémon name do API call to get Pokémon infor:
   Name & Types & Stats.
3. Use Pokémon type url do API call to get damage relations:
   double_damage_to & half_damage_to & no_damage_to
4. Use damage relations to find which Pokémon has the favourable
   type advantage:
   - initial               : damage = 1
   - if in double_damage_to: damage * 2
   - if in half_damage_to  : damage * 0.5
   - if in no_damage_to    : damage * 0
5. If no type advantage, check Pokémon total stats. “Winner” will
   be the Pokémon with the highest base stats.
6. In the case of a tie the “winner” will be the first Pokémon passed to it.
