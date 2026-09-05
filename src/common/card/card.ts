import * as Util from "./internal/util.js"
import * as Shop from "./internal/shop.js"
import * as Scoring from "./internal/scoring.js"
import * as Display from "./internal/display.js"


export type Rank = string;

export type Suit = number;
export namespace Suit {
    export const SPADES     = 0;
    export const HEARTS     = 1;
    export const CLUBS      = 2;
    export const DIAMONDS   = 3;
    export const WILD       = 4;
    export const NONE       = 5;

    export const entries = () => [SPADES, HEARTS, CLUBS, DIAMONDS, WILD, NONE];
    export const length = 6;
}

export type Card = { rank: Rank, suit: Suit };
export type Hand = Card[];
export type Deck = Card[];

// acts like a namespace
export const Card = {
    ...Util,
    ...Shop,
    ...Scoring,
    ...Display
};