import { CLIcommand } from "./state.js";
import { Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";
import { State } from './state.js';

export async function commandExplore(state: State, args: string[]): Promise<void> {
  const locationName = args[0];
  if (!locationName) {
    console.log("Please provide a location name.");
    return;
  }
  console.log(`Exploring ${locationName}...`);
  const location = await state.pokeapi.fetchLocation(locationName);
  console.log("Found Pokemon:");
  for (const pokemon of location.pokemon_encounters) {
    console.log(`- ${pokemon.pokemon.name}`);
  }
}