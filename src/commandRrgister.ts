import { commandExit } from "./commandExit.js";

export type CLIcommand ={
    name: string;
    description: string;
    callback: (
        commands: Record<string, CLIcommand>) => void;
};

export function getCommands(): Record<string, CLIcommand> {
    return {
        exit:{
            name: 'exit',
            description: 'Exit the application',
            callback: commandExit,
            },
        help: {
            name: 'help',
            description: 'List all available commands',
            callback: (commands) => {
                console.log('Available commands:');
                for (const command of Object.values(commands)) {
                    console.log(` - ${command.name}: ${command.description}`);
                }
            },
        },
        }
    };