export type CacheEntry<T> = {
    createdAt: number,
    val: T
}

export class Cache{
    #cache: Map<string, CacheEntry<any>>  = new Map();
    #reapIntervalID: NodeJS.Timeout | undefined;
    #interval: number;

    constructor(interval: number){
        this.#interval = interval
        this.#startReaping();
    }

    add<T>(key: string, val: T): void{
        console.log(`Cache add: ${key}`);
        this.#cache.set(key, {
            createdAt: Date.now(),
            val: val
        })
    };

    get<T>(key: string): T | undefined {
        console.log(`Cache get: ${key}`);
        const entry = this.#cache.get(key);
        if (entry) {
            return entry.val as T
        } else{
            return undefined
        }
    }

    #reap(){
        const now = Date.now();
        if (this.#interval){
            for (const [key, val] of this.#cache){
                if (now - val.createdAt > this.#interval){
                    this.#cache.delete(key);
                }
            }
        }
    }
    #startReaping(): void{
        this.#reapIntervalID = setInterval(() => this.#reap(), this.#interval);
    }

    stopReapLoop(): void{
        if (this.#reapIntervalID){
            clearInterval(this.#reapIntervalID);
            this.#reapIntervalID = undefined;
        }
    }
}

