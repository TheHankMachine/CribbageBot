import * as Util from "./internal/util.js"
import * as Shop from "./internal/shop.js"
import * as Ranks from "./internal/rank/rank.js"
import * as Modifiers from "./internal/modifier/modifier.js"
// import * as Scoring from "./internal/scoring.js"
import * as Display from "./internal/display/display.js"
import * as Suits from "./internal/suit.js"


export type Card = {
    rank: Card.Rank,
    suit: Card.Suit,
    modifier?: Card.Modifier | undefined,
    modifierValue?: Card.ModifierValue | undefined
};


export type Hand = Card[];
export type Deck = Card[];


export namespace Card {
    export type Suit = Suits.Suit;
    export type Rank = Ranks.Rank;
    
    export type Modifier = Modifiers.Modifier;
    export type ModifierValue = number | Rank | undefined;
}

// acts like a namespace
export const Card = {
    ...Util,
    ...Shop,
    ...Display,
    ...Suits,
    ...Ranks,
    ...Modifiers
};

