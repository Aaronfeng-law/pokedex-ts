import { CLIcommand } from "./state.js";
import { Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";
import { State } from './state.js';
export async function commandMap(state: State) {
    let response;

    // 決定要用哪個 URL 取得資料
    // 如果有下一頁的 URL，就用它來取得資料
    if (state.nextLocationURL){
        console.log(`Fetching locations from: ${state.nextLocationURL}`);
        const response = await state.pokeapi.fetchLocations(state.nextLocationURL);
        console.log(`=================Found ${response.results.length} locations.=================`);
        for (const location of response.results){
            console.log(location.name);
        }
        state.prevLocationURL = response.previous ?? null;
        state.nextLocationURL = response.next ?? null;


        console.log('=================Current States=================')
        console.log(`Next page URL: ${state.nextLocationURL}\nPrevious page URL: ${state.prevLocationURL}`);
        console.log('================================================')
    } else if (state.nextLocationURL === null) {
        console.log("No next location available. Already at the last page.");
        return;
    };
}