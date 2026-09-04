import * as Constants from "../../constants.js"
import { DisplayConstants } from "../../constants.js";


export type Rank = string;
export type Suit = number;

export namespace Suit {
    export const SPADES = 0;
    export const HEARTS = 1;
    export const CLUBS = 2;
    export const DIAMONDS = 3;
    export const WILD = 4;
    export const NONE = 5;

    export const entries = () => [SPADES, HEARTS, CLUBS, DIAMONDS, WILD, NONE];
    export const length = 6;
}

export type Card = { rank: Rank, suit: Suit };
export type Hand = Card[];
export type Deck = Card[];


// export namespace Card {

// }




//     // export function getHandDisplayString(hand: Card[], cut: Card[] = []): string {
//     //     const rows: string[] = new Array(DisplayConstants.CARD_BORDER_HEIGHT).fill("");

//     //     const nCards = hand.length + cut.length * 1.5;
//     //     const overBudget = (DisplayConstants.CARD_BORDER.top.length * nCards - DisplayConstants.MAX_TERMINAL_WIDTH) / nCards;
//     //     const overlap = Math.min(
//     //         Math.max(0, Math.ceil(overBudget)),
//     //         DisplayConstants.CARD_BORDER.top.length - 2
//     //     );

//     //     function addCard(card: Card) {
//     //         for (let i = 0; i < rows.length; i++) {
//     //             if (rows[i].length > 0 && overlap > 0) {
//     //                 rows[i] = rows[i].slice(0, -overlap);
//     //             }
//     //         }

//     //         const cardFace = DisplayConstants.CARD_FACES[card.rank[0]];
//     //         const esc = DisplayConstants.DISCORD_ESCAPE_SUITS[card.suit];
//     //         const pip = card.rank.split('').map((e) => Constants.RANK_NAMES[e] ?? e).join('');

//     //         rows[0] += esc + DisplayConstants.CARD_BORDER.top;
//     //         for (let i = 0; i < cardFace.length; i++) {
//     //             let c = DisplayConstants.CARD_BORDER.middle.replace(
//     //                 'x',
//     //                 cardFace[i].replaceAll('x', DisplayConstants.SUIT_SYMBOLS[card.suit])
//     //             );

//     //             if (i == 0) {
//     //                 c = c.slice(0, 1) + pip + c.slice(pip.length + 1);
//     //             }

//     //             rows[i + 1] += esc + c;
//     //         }
//     //         rows[DisplayConstants.CARD_BORDER_HEIGHT - 1] +=
//     //         esc + DisplayConstants.CARD_BORDER.bottom;
//     //     }

//     //     for (const card of hand) {
//     //         addCard(card);
//     //     }

//     //     if (cut.length > 0) {
//     //         for (let i = 0; i < rows.length; i++) {
//     //             rows[i] += ' '.repeat(overlap + 2);
//     //         }

//     //         for (const card of cut) {
//     //             addCard(card);
//     //         }
//     //     }

//     //     return rows.map(e => DisplayConstants.DISCORD_ESCAPE_BACKGROUND + e.trimEnd() + DisplayConstants.DISCORD_ESCAPE_CLEAR).join('\n');
//     // }

//     export function getRankName(rank: Rank) {
//         return Constants.RANK_NAMES[rank] ?? rank;
//     }

//     export function getCardPip(card: Card): string {
//         return (
//             card.rank.split('').map(getRankName).join('') +
//             Constants.DisplayConstants.SUIT_SYMBOLS[card.suit]
//         );
//     }

//     export function getCardDescription(card: Card): string {
//         let description = getCardPip(card);
        
//         description += ' (';
//         const options = card.rank.split('/');

//         if (options.length > 1) {
//             description += 'nondeterministically ';
//         }
//         description += 'scored as ';

//         for (let i = 0; i < options.length; i++) {
//             const option = options[i];

//             if (option.length > 1) {
//                 description += `${option.slice(2)} ${getRankName(option[0])}'s`;
//             } else {
//                 description += `a ${getRankName(option[0])}`;
//             }

//             if (i == options.length - 2) {
//                 description += ' or ';
//             } else if (i < options.length - 1) {
//                 description += ', ';
//             } else {
//                 description += ' ';
//             }
//         }

//         if (card.suit == Suit.WILD) {
//             description += 'of wild suit)';
//         } else {
//             description += `of ${Constants.DisplayConstants.SUIT_SYMBOLS[card.suit]})`;
//         }

//         return description;
//     }


//     // export function generateRandCard(): Card {
//     //     const SPECIAL_RANK_CHANCE = 0.0525;
//     //     const WILD_SUIT_CHANCE = 0.075;

//     //     const INITIAL_OPTION_CHANCE = 0.15;
//     //     const ADDITIONAL_OPTION_CHANCE = 0.1;

//     //     const INITIAL_MULT_CHANCE = 0.15;
//     //     const ADDITIONAL_MULT_CHANCE = 0.35;

//     //     const suit =
//     //         Math.random() < WILD_SUIT_CHANCE
//     //         ? Constants.WILD_SUIT
//     //         : Math.floor(Math.random() * Constants.NUM_SUITS);

//     //     const numOptions = randGeo(ADDITIONAL_OPTION_CHANCE, INITIAL_OPTION_CHANCE);

//     //     const options = [];
//     //     for (let i = 0; i < numOptions; i++) {
//     //         const rankOptions =
//     //         Math.random() < SPECIAL_RANK_CHANCE
//     //             ? SPECIAL_RANKS
//     //             : Constants.STANDARD_RANK_SYMBOLS;
//     //         const rank = rankOptions[Math.floor(Math.random() * rankOptions.length)];

//     //         const mult = randGeo(ADDITIONAL_MULT_CHANCE, INITIAL_MULT_CHANCE);

//     //         if (mult == 1) {
//     //         options.push(rank);
//     //         } else {
//     //         options.push(`${rank}*${mult}`);
//     //         }
//     //     }

//     //     return new Card(options.join('/'), suit);
//     // }

// }



































// export class Card {
    
    
//     public rank: Rank;
//     public suit: Suit;


//     constructor(rank: Rank, suit: Suit) {
//         this.rank = rank;
//         this.suit = suit;
//     }


//     public isSuit(suit: Suit): boolean {
//         if (this.suit == Suit.WILD) {
//             return true;
//         }
//         return this.suit == suit;
//     }

//     public get(): Card[] {
//         const options = this.rank.split('/');
//         const rank = options[Math.floor(Math.random() * options.length)];

//         if (rank == 'B') {
//             return [];
//         }

//         if (rank.length == 1) {
//             return [new Card(rank, this.suit)];
//         }

//     if (rank[1] == '*') {
//       return new Array(parseInt(rank.slice(2))).fill(
//         new Card(rank[0], this.suit)
//       );
//     }
//     return [];
//   }

//   public toString(): string {
//     const whiteBackground = '\x1b[48;5;255m';

//     const suitColors = [
//       '\x1b[38;5;64m',
//       '\x1b[38;5;196m',
//       '\x1b[38;5;69m',
//       '\x1b[38;5;172m',
//     ];
//     const reset = '\x1b[0m';

//     return (
//       whiteBackground +
//       ' ' +
//       suitColors[this.suit] +
//       Constants.SUIT_SYMBOLS[this.suit] +
//       this.rank +
//       ' ' +
//       reset
//     );
//   }
// }
