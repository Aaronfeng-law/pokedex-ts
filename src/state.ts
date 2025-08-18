import { PokeAPI, Pokemon } from "./pokeapi.js";
import { createInterface, type Interface } from "readline";
import { getCommands } from './commands.js';
// Define the State type or import it from the appropriate module
export type State = {
    commands: Record<string, CLIcommand>;
    readline: Interface;
    pokeapi: PokeAPI;
    nextLocationURL?: string|null;
    prevLocationURL?: string|null;
    pokedex: Record<string, Pokemon>;
};

export type CLIcommand ={
    name: string;
    description: string;
    callback: (state: State, args: string[]) => Promise<void>;
    // pokeAPI?: PokeAPI;
    // nextLocationURL?: string;
    // prevLocationURL?: string;
};

export function initState(): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'pokedex > '
    });
    return {
        readline: rl,
        commands: getCommands(),
        prevLocationURL: null,
        nextLocationURL: "https://pokeapi.co/api/v2/location-area",
        pokeapi: new PokeAPI(),
        pokedex: {},
    };
}