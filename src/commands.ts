import { commandExit } from "./commandExit.js";
import { commandHelp } from "./commandHelp.js";
import { commandMap } from "./commandMap.js";
import { commandMapb} from "./commandMapb.js"
import { PokeAPI } from "./pokeapi.js";
import { type CLIcommand, State } from "./state.js";

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
        }
        // 若有其他命令 handler，請在此擴充
    }
};