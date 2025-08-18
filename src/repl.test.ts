import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as repl from './repl';
import { State } from './state';
import * as readline from 'readline';
import * as commandsModule from './commands';
import * as pokecache from './pokecache';
import { PokeAPI } from './pokeapi';

// Mock readline interface
function createMockReadline() {
    return {
        prompt: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
    } as unknown as readline.Interface;
}

describe('cleanInput', () => {
    it('should split and clean input string', () => {
        expect(repl.cleanInput('  hello   world  ')).toEqual(['hello', 'world']);
        expect(repl.cleanInput('TEST   input')).toEqual(['test', 'input']);
        expect(repl.cleanInput('   ')).toEqual([]);
        expect(repl.cleanInput('poke  dex  ')).toEqual(['poke', 'dex']);
    });
});

describe('startREPL', () => {
    let state: State;
    let mockReadline: readline.Interface;
    let mockCallback: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockReadline = createMockReadline();
        mockCallback = vi.fn();
        state = {
            readline: mockReadline,
            commands: {
                help: { callback: mockCallback },
                exit: { callback: mockCallback },
            },
        } as unknown as State;
    });

    it('should call prompt on start', () => {
        repl.startREPL(state);
        expect(mockReadline.prompt).toHaveBeenCalled();
    });

    it('should call command callback if input matches command', () => {
        let lineHandler: ((input: string) => void) | undefined;
        (mockReadline.on as unknown as Mock).mockImplementation((event, cb) => {
            if (event === 'line') lineHandler = cb;
        });

        repl.startREPL(state);
        lineHandler && lineHandler('help');
        expect(mockCallback).toHaveBeenCalledWith(state);
        expect(mockReadline.prompt).toHaveBeenCalledTimes(2);
    });

    it('should print unknown command for invalid input', () => {
        let lineHandler: ((input: string) => void) | undefined;
        (mockReadline.on as unknown as Mock).mockImplementation((event, cb) => {
            if (event === 'line') lineHandler = cb;
        });
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        repl.startREPL(state);
        lineHandler && lineHandler('invalidcmd');
        expect(logSpy).toHaveBeenCalledWith('Unknown command');
        expect(mockReadline.prompt).toHaveBeenCalledTimes(2);

        logSpy.mockRestore();
    });
});

describe('commandExit', () => {
    it('should log and exit process', () => {
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });

        expect(() => repl.commandExit()).toThrow('exit');
        expect(logSpy).toHaveBeenCalledWith('Closing the Pokedex... Goodbye!');
        expect(exitSpy).toHaveBeenCalledWith(0);

        logSpy.mockRestore();
        exitSpy.mockRestore();
    });
});

// Caching mechanism test
describe('pokecache', () => {
    it('should cache and retrieve values', () => {
        const cache = new pokecache.Cache(10000);
        expect(cache.get('pikachu')).toBeUndefined();
        cache.add('pikachu', { name: 'pikachu', id: 25 });
        expect(cache.get('pikachu')).toEqual({ name: 'pikachu', id: 25 });
        cache.stopReapLoop();
    });

    it('should return undefined for missing keys', () => {
        const cache = new pokecache.Cache(10000);
        expect(cache.get('missing')).toBeUndefined();
        cache.stopReapLoop();
    });

    it('should remove expired entries after interval', async () => {
        const cache = new pokecache.Cache(10); // 10ms interval
        cache.add('bulbasaur', { name: 'bulbasaur', id: 1 });
        expect(cache.get('bulbasaur')).toEqual({ name: 'bulbasaur', id: 1 });
        await new Promise(res => setTimeout(res, 30));
        expect(cache.get('bulbasaur')).toBeUndefined();
        cache.stopReapLoop();
    });

    it('should not remove entries before interval', async () => {
        const cache = new pokecache.Cache(100);
        cache.add('charmander', { name: 'charmander', id: 4 });
        expect(cache.get('charmander')).toEqual({ name: 'charmander', id: 4 });
        await new Promise(res => setTimeout(res, 50));
        expect(cache.get('charmander')).toEqual({ name: 'charmander', id: 4 });
        cache.stopReapLoop();
    });

    it('should allow multiple keys and types', () => {
        const cache = new pokecache.Cache(10000);
        cache.add('number', 123);
        cache.add('string', 'abc');
        cache.add('object', { foo: 'bar' });
        expect(cache.get<number>('number')).toBe(123);
        expect(cache.get<string>('string')).toBe('abc');
        expect(cache.get<{ foo: string }>('object')).toEqual({ foo: 'bar' });
        cache.stopReapLoop();
    });

    it('should stop reaping loop', () => {
        const cache = new pokecache.Cache(10);
        cache.stopReapLoop();
        // Should not throw or error
        expect(() => cache.stopReapLoop()).not.toThrow();
    });
});

describe('PokeAPI caching and fetching', () => {
    let pokeapi: PokeAPI;

    beforeEach(() => {
        pokeapi = new PokeAPI();
    });

    it('should fetch and cache locations', async () => {
        // Mock fetch
        const mockData = { count: 1, next: null, previous: null, results: [{ name: 'test', url: 'url' }] };
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockData)
        } as any);

        // First call: fetches and caches
        const data1 = await pokeapi.fetchLocations();
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(data1).toEqual(mockData);

        // Second call: uses cache, no fetch
        fetchSpy.mockClear();
        const data2 = await pokeapi.fetchLocations();
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(data2).toEqual(mockData);
        fetchSpy.mockRestore();
    });

    it('should fetch and cache a single location', async () => {
        const mockLocation = { name: 'test-location', location: { name: 'test', url: 'url' }, encounter_method_rates: [], game_indes: 1, names: [], pokemon_encounters: [] };
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            json: vi.fn().mockResolvedValue(mockLocation)
        } as any);

        // First call: fetches and caches
        const data1 = await pokeapi.fetchLocation('test-location');
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(data1).toEqual(mockLocation);

        // Second call: uses cache, no fetch
        fetchSpy.mockClear();
        const data2 = await pokeapi.fetchLocation('test-location');
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(data2).toEqual(mockLocation);

        fetchSpy.mockRestore();
    });
});