import { State } from './state.js'
import { PokeAPI } from './pokeapi.js'
export async function commandMapb(state: State){
    let response 
    if (state.prevLocationURL){
        response = await state.pokeapi.fetchLocations(state.prevLocationURL);
        for (const location of response.results) {
            console.log(location.name); 
        }
        state.prevLocationURL = response.previous ?? null;
        state.nextLocationURL = response.next ?? null; 
    } else {
        console.log("No previous location available. Already at the first page.");
    }

}