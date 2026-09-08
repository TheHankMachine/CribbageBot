export type Suit = number; // 0 | 1 | 2 | 3 | 4 | 5

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