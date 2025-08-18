import { CLIcommand } from "./state.js";
import { Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";
import { State } from './state.js';


export async function commandCatch(state: State, args: string[]): Promise<void> {
  const pokemonName = args[0];
  if (!pokemonName) {
    console.log("Please provide a Pokémon name.");
    return;
  }
  console.log(`Throwing a Pokeball at ${pokemonName}...`);
  const response = await state.pokeapi.fetchPokemon(pokemonName);
  const caughtRate = Math.random() * 150;
  if (response && caughtRate > response.catchRate) {
    state.pokedex[pokemonName] = response;
    console.log(`${pokemonName} was caught!`);
  } else {
    console.log(`${pokemonName} escaped!`);
  }
}