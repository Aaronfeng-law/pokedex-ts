import { CLIcommand } from "./state.js";
import { Interface } from "readline";
import { PokeAPI } from "./pokeapi.js";
import { State } from './state.js';
export async function commandMap(state: State) {
    const pokeapi = new PokeAPI();
    let response;

    // 決定要用哪個 URL 取得資料
    if (state.nextLocationURL === null) {
        console.log("No next location available. Already at the last page.");
        return;
    } else if (state.nextLocationURL && state.nextLocationURL !== "start") {
        console.log(`Fetching locations from: ${state.nextLocationURL}`);
        response = await pokeapi.fetchLocations(state.nextLocationURL);
    } else {
        response = await pokeapi.fetchLocations();
    }

    // 顯示地點名稱
    for (const location of response.results) {
        console.log(location.name);
    }

    // 更新 State 的分頁資訊，將 null 轉成 undefined
    state.prevLocationURL = response.previous ?? undefined;
    state.nextLocationURL = response.next ?? undefined;
}