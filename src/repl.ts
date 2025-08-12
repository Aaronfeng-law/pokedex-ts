import * as readline from 'readline';
// import { commandExit as importedCommandExit } from './commandExit';
import * as commandRegister from './commandRrgister.js';

    // Create an Interface for reading input. You'll need to specify:
    //     input: a readable stream (use process.stdin)
    //     output: a writable stream (use process.stdout)
    //     prompt: a string to print to output whenever rl.prompt() is called
    // Use the interface's .prompt() method to display the prompt.
    // Use the interface's .on("line", callback) method to listen for input. The callback should:
    //     Use your cleanInput function to parse the input into an array of words
    //     If the input is empty, call .prompt() to give the user back control to type another command and exit the callback
    //     Otherwise, print the first word back to the user in this format: Your command was: <first word>
    //     Call .prompt() to give the user back control to type another command


export function cleanInput(input: string): string[]{
    if (typeof input === "string"){
        input = input.toLowerCase();
    }
    return input.split(" ").map(word => word.trim()).filter(word => word !== "");
}

export function startREPL() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });
    rl.prompt();

    rl.on('line', (input)=> {
        if (input in commandRegister.getCommands()) {
            const command = commandRegister.getCommands()[input];
            console.log(`Your command name: ${command.name}\n`);
            console.log(`Your command description: ${command.description}\n`); 
            // console.log(`Your command callback: ${command.callback}\n`);
            command.callback(commandRegister.getCommands());
            rl.prompt();
        } else {
            console.log('Unknown command')
            rl.prompt();
        }
    });

}

export function commandExit(){
    console.log('Closing the Pokedex... Goodbye!')
    process.exit(0);
};


