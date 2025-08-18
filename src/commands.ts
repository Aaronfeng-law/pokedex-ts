import { commandExit } from "./commandExit.js";
import { commandHelp } from "./commandHelp.js";
import { commandMap } from "./commandMap.js";
import { commandMapb} from "./commandMapb.js"
import { PokeAPI } from "./pokeapi.js";
import { type CLIcommand, State } from "./state.js";
import { commandExplore } from "./commandExplore.js";
import { commandCatch } from "./commandCatch.js";
import { commandInspect } from "./commandInspect.js";
import { commandPokedex } from "./commandPokedex.js";

export function getCommands(): Record<string, CLIcommand> {
    return {
        exit: {
            name: 'exit',
            description: 'Exit the Pokedex',
            callback: async (state: State) => {
                await commandExit(state);
            },
        },
        help: {
            name: 'help',
            description: 'Displays a help message',
            callback: async (state: State) => {
                await commandHelp(state);
            }
        }, 
        map:{
            name: 'map',
            description: 'Fetches and displays Location Areas of Pokémon',
            callback: async (state: State) => {
                await commandMap(state);
            }
            
        },
        mapb:{
            name: 'mapb',
            description: 'Fetches and displays Location Areas of Pokémon (previous)',
            callback: async (state: State) => {
                await commandMapb(state);
            }
        },
        explore:{
            name: 'explore',
            description: 'Explores a specific location',
            callback: async (state: State, args: string[]) => {
                await commandExplore(state, args);
            }
        },
        catch:{
            name: 'catch',
            description: 'Catches a Pokémon',
            callback: async (state: State, args: string[]) => {
                await commandCatch(state, args);
            }
        },
        inspect:{
            name: 'inspect',
            description: 'Inspects a specific Pokémon',
            callback: async (state: State, args: string[]) => {
                await commandInspect(state, args);
            }
        },
        pokedex:{
            name: 'pokedex',
            description: 'Displays the Pokémon you have caught',
            callback: async (state: State) => {
                await commandPokedex(state);
            }
    
        // 若有其他命令 handler，請在此擴充
    }
};
}