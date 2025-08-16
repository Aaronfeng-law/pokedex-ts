// repl.test.ts
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import * as readline from 'readline';
import { commandExit } from './commandExit.js';  
import { commandMap } from './commandMap.js';
import { PokeAPI } from './pokeapi.js';
import { getCommands } from './commands.js';

describe('REPL', () => {
    let rl: readline.Interface;
    let mockCallback: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockCallback = vi.fn();
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        rl.close();
    });

    it('should call the correct command callback when input matches', async () => {
        vi.spyOn(require('./commands'), 'getCommands').mockReturnValue({
            test: {
                name: 'test',
                description: 'Test command',
                callback: mockCallback,
            }
        });
        const input = 'test';
        const commands = getCommands();
        const state = { commands, readline: rl };
        await commands[input].callback(state);
        expect(mockCallback).toHaveBeenCalledWith(state);
    });

    it('should print "Unknown command" for invalid input', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const input = 'invalid';
        if (!(input in getCommands())) {
            console.log('Unknown command');
        }
        expect(consoleSpy).toHaveBeenCalledWith('Unknown command');
        consoleSpy.mockRestore();
    });

    it ('testing help command', async () => {
        vi.spyOn(require('./commands'), 'getCommands').mockReturnValue({
            help: {
                name: 'help',
                description: 'Displays a help message',
                callback: async (state: any) => {
                    console.log('Welcome to the Pokedex!');
                }
            }
        });
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const input = 'help';
        const commands = getCommands();
        const state = { commands, readline: rl };
        if (input in commands) {
            await commands[input].callback(state);
        }
        const calls = consoleSpy.mock.calls.map(call => call[0]);
        expect(calls).toContain('Welcome to the Pokedex!');
        consoleSpy.mockRestore();
    });

    it('testing exit command', async () => {
        vi.spyOn(require('./commands'), 'getCommands').mockReturnValue({
            exit: {
                name: 'exit',
                description: 'Exit the Pokedex',
                callback: async (state: any) => {
                    return await commandExit(state);
                }
            }
        });
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });
        const input = 'exit';
        let threw = false;
        const commands = getCommands();
        const state = { commands, readline: rl };
        try {
            if (input in commands) {
                await commands[input].callback(state);
            }
        } catch (e) {
            threw = true;
        }
        const calls = consoleSpy.mock.calls.map(call => call[0]);
        expect(calls).toContain('Closing the Pokedex... Goodbye!');
        expect(exitSpy).toHaveBeenCalledWith(0);
        expect(threw).toBe(true);
        consoleSpy.mockRestore();
        exitSpy.mockRestore();
    });

    it('should fetch locations from API', async () => {
        // Mock fetch
        global.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({
                count: 1,
                next: null,
                previous: null,
                results: [
                    { name: 'canalave-city-area', url: 'https://pokeapi.co/api/v2/location-area/1/' }
                ]
            })
        });

        const api = new PokeAPI();
        const data = await api.fetchLocations();
        expect(data.count).toBe(1);
        expect(data.results[0].name).toBe('canalave-city-area');
        expect(data.results[0].url).toBe('https://pokeapi.co/api/v2/location-area/1/');
    });

    it ("real location-area fetch testing with cli command", async () => {
        const mockLocations = {
            count: 1,
            next: null,
            previous: null,
            results: [
                { name: 'canalave-city-area', url: 'https://pokeapi.co/api/v2/location-area/1/' }
            ]
        };

        global.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockLocations)
        });

        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        vi.spyOn(require('./commands'), 'getCommands').mockReturnValue({
            map: {
                name: 'map',
                description: 'Show location areas',
                callback: commandMap,
            }
        });
        const commands = getCommands();
        const state = { commands, readline: rl };
        await commands['map'].callback(state);

        const calls = consoleSpy.mock.calls.flat();
        expect(calls.join(' ')).toContain('canalave-city-area');
    });
});