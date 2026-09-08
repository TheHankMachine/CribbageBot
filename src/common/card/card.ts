import * as Util from "./internal/util.js"
import * as Shop from "./internal/shop.js"
// import * as Scoring from "./internal/scoring.js"
import * as Display from "./internal/display.js"
import * as Suits from "./internal/suit.js"


export type Card = {
    rank: Card.Rank,
    suit: Suits.Suit,
    modifier?: Card.Modifier | undefined,
    modifierValue?: Card.ModifierValue | undefined
};


export type Hand = Card[];
export type Deck = Card[];


export namespace Card {
    export type Rank = string;
    export type Suit = Suits.Suit;
    
    export type Modifier = string;
    export type ModifierValue = number | Rank | undefined;
}

// acts like a namespace
export const Card = {
    ...Util,
    ...Shop,
    ...Display,
    ...Suits
};