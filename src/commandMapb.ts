import { State } from './state.js'
import { PokeAPI } from './pokeapi.js'
export async function commandMapb(state: State){
    if (state.prevLocationURL){
        const pokeapi = new PokeAPI();
        const response = await pokeapi.fetchLocations(state.prevLocationURL);
        for (const location of response.results) {
            console.log(location.name); 
        }
        state.prevLocationURL = response.previous;
        state.nextLocationURL = response.next;
    } else {
        console.log("No previous location available. Already at the first page.");
    }

}