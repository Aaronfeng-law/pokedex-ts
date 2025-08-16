import { PokeAPI } from "./pokeapi";
import { createInterface, type Interface } from "readline";
import { getCommands } from './commands.js';
// Define the State type or import it from the appropriate module
export type State = {
    commands: Record<string, CLIcommand>;
    readline: Interface;
    nextLocationURL?: string|null;
    prevLocationURL?: string|null;
};

export type CLIcommand ={
    name: string;
    description: string;
    callback: (state: State) => Promise<void>;
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
        nextLocationURL: "start",
    };
}