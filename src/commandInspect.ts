import { CLIcommand } from "./state.js";
import { Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";
import { State } from './state.js';

export async function commandInspect(state: State, args: string[]): Promise<void> {
  const pokemonName = args[0];
  if (!pokemonName) {
    console.log("Please provide a Pokémon name.");
    return;
  }
  const pokemon = state.pokedex[pokemonName];
  if (!pokemon) {
    console.log(`you have not caught that pokemon`);
    return;
  }
  console.log(`Name: ${pokemon.name}`);
  console.log(`Height: ${pokemon.height}`);
  console.log(`Weight: ${pokemon.weight}`);
  console.log(`Stats:`);
  pokemon.Stats.forEach((value, key) => {
    console.log(`  -${key}: ${value}`);
  });
  console.log(`Types:`);
  pokemon.types.forEach((type) => {
    console.log(`  -${type}`);
  });
}