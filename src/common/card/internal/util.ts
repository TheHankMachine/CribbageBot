import { Card, Rank, Suit } from "../card.js";
import * as Constants from "../../../constants.js"


export function isSuit(card: Card, suit: Suit) {
    if (card.suit == Suit.WILD) {
        return true;
    }
    return card.suit == suit;
}


export function getRankValue(card: Card) {
    return Constants.CARD_VALUES[card.rank];
}


export function getRankName(rank: Rank) {
    return Constants.RANK_NAMES[rank] ?? rank;
}


export function getCardPip(card: Card): string {
    return card.rank.split('').map(getRankName).join('') + Constants.DisplayConstants.SUIT_SYMBOLS[card.suit];
}


export function getCardDescription(card: Card): string {
    let description = getCardPip(card);
    description += ' (';
    
    const options = card.rank.split('/');
    if (options.length > 1) {
        description += 'nondeterministically ';
    }
    description += 'scored as ';

    for (let i = 0; i < options.length; i++) {
        const option = options[i];

        if (option.length > 1) {
            description += `${option.slice(2)} ${getRankName(option[0])}'s`;
        } else {
            description += `a ${getRankName(option[0])}`;
        }

        if (i == options.length - 2) {
            description += ' or ';
        } else if (i < options.length - 1) {
            description += ', ';
        } else {
            description += ' ';
        }
    }

    if (card.suit == Suit.WILD) {
        description += 'of wild suit)';
    } else {
        description += `of ${Constants.DisplayConstants.SUIT_SYMBOLS[card.suit]})`;
    }
    return description;
}