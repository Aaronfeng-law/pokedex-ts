import { type CacheEntry, Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor() {
    this.cache = new Cache(60000);
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    let url = pageURL ?? `${PokeAPI.baseURL}/location-area`;
    // 將 offset=0&limit=20 視為 base URL
    if (url.startsWith(`${PokeAPI.baseURL}/location-area?offset=0&limit=20`)) {
        url = `${PokeAPI.baseURL}/location-area`;
    }
    const cached = this.cache.get<ShallowLocations>(url);
    if (cached) {
      console.log("Found in cache. Using cached data.");
      return cached;
    } else {
      console.log("No cache found, fetching");
      const response = await fetch(url);
      const data = await response.json();
      this.cache.add(url, data);
      return data;
    }
  }

  async fetchLocation(locationName: string | number): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const cached = this.cache.get<Location>(url);
    if (cached) {
      console.log("Found in cache. Using cached data.");
      return cached;
    } else {
      console.log("No cache found, fetching");
      const response = await fetch(url);
      const data = await response.json();
      this.cache.add(url, data);
      return data;
    }
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon | null> {
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
    const cached = this.cache.get<Pokemon>(url);
    let catchRate: number;
    if (cached) {
      console.log("Found in cache. Using cached data.");
      return cached;
    } else {
      console.log("No cache found, fetching");
      const response = await fetch(url);
      const data = await response.json();
      this.cache.add(url, data);
      return {
        name: data.name,
        base_experience: data.base_experience,
        catchRate: data.base_experience * 0.5,
        height: data.height,
        weight: data.weight,
        Stats: new Map(
            data.stats.map((s: any) => [s.stat.name, s.base_stat])
        ),
        types: data.types.map((type: any) => type.type.name),
      };
    }
  }
}

export type Pokemon = {
  name: string;
  base_experience: number;
  catchRate: number;
  height: number;
  weight: number;
  Stats: Map<string, number>;
  types: string[];
}


export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
};

export type Location = {
  id: number;
  name: string;
  pokemon_encounters: any[];
};