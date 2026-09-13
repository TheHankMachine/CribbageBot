import { Card } from "../card.js";
import * as Constants from "../../../constants.js"


export function isSuit(card: Card, suit: Card.Suit) {
    if (card.suit == Card.Suit.WILD) {
        return true;
    }
    return card.suit == suit;
}


export function getPip(card: Card): string {
    return card.rank + (card.modifier ?? "") + (card.modifierValue ?? "");
}


export function getRankValue(card: Card): number {
    return Card.Rank.getValue(card.rank);
}


function implies(a: boolean, b: boolean) {
    return !a || b;
}


export function equals(a: Card, b: Card) {
    return a.rank == b.rank 
        && a.suit == b.suit
        && a.modifier == b.modifier
        && implies(a.modifierValue != b.modifierValue, !a.modifier && !b.modifier);
}3


// export function getCardDescription(card: Card): string {
//     let description = getPip(card);
//     description += ' (';
    
//     const options = card.rank.split('/');
//     if (options.length > 1) {
//         description += 'nondeterministically ';
//     }
//     description += 'scored as ';

//     for (let i = 0; i < options.length; i++) {
//         const option = options[i];

//         if (option.length > 1) {
//             description += `${option.slice(2)} ${getRankName(option[0])}'s`;
//         } else {
//             description += `a ${getRankName(option[0])}`;
//         }

//         if (i == options.length - 2) {
//             description += ' or ';
//         } else if (i < options.length - 1) {
//             description += ', ';
//         } else {
//             description += ' ';
//         }
//     }

//     if (card.suit == Card.Suit.WILD) {
//         description += 'of wild suit)';
//     } else {
//         description += `of ${Constants.DisplayConstants.SUIT_SYMBOLS[card.suit]})`;
//     }
//     return description;
// }