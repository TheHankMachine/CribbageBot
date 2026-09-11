export type Suit = number;

export namespace Suit {
    export const SPADES     = 0;
    export const HEARTS     = 1;
    export const CLUBS      = 2;
    export const DIAMONDS   = 3;
    export const WILD       = 4;
    export const NONE       = 5;

    // should probably not be named this
    export const basic = () => [ SPADES, HEARTS, CLUBS, DIAMONDS ];
    export const all = () => [ SPADES, HEARTS, CLUBS, DIAMONDS, WILD, NONE ];
    export const length = 6;
}