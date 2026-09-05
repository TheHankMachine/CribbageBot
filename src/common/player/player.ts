import * as Balance from "./internal/balance.js"
import * as Deck from "./internal/deck.js"
import * as Luck from "./internal/luck.js"


export const Player = {
    ...Balance,
    ...Luck,
    ...Deck
}