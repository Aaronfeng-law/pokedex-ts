import {type CLIcommand} from "./state.js";
import type { Interface } from 'readline';
import { State } from './state.js';
export function commandHelp(state: State){
    console.log('Welcome to the Pokedex!')
    console.log('Usage:');
    for (const command of Object.values(state.commands)){
        console.log(` - ${command.name}: ${command.description}`);
    }
}