import { CLIcommand } from "./state.js";
import { Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";
import { State } from './state.js';

export async function commandPokedex(state: State): Promise<void> {
    console.log("Your Pokedex:");
    for (const pokemon of Object.values(state.pokedex)) {
        console.log(`- ${pokemon.name}`);
    }
}