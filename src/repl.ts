import * as readline from 'readline';
// import { commandExit as importedCommandExit } from './commandExit';
// import * as commandRegister from './commandRegister.js';
import { getCommands } from './commands.js';   
import { State } from './state.js';

export function cleanInput(input: string): string[]{
    if (typeof input === "string"){
        input = input.toLowerCase();
    }
    return input.split(" ").map(word => word.trim()).filter(word => word !== "");
};

export function startREPL(state: State ) {
    state.readline.prompt();

    state.readline.on('line', async(input)=> {
        const args = cleanInput(input);
        if (args[0] in state.commands) {
            const command = state.commands[args[0]];
            command.callback(state, args.slice(1));
            state.readline.prompt();
        } else {
            console.log('Unknown command')
            state.readline.prompt();
        }
    });

}

export function commandExit(){
    console.log('Closing the Pokedex... Goodbye!')
    process.exit(0);
};


