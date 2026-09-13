import { Card } from "../../card.js"
import { ANSI_CARD_BACKGROUND, ANSI_CLEAR, ANSI_SUITS, SUIT_SYMBOLS } from "./constants.js";


export function getSmallCardDisplay(cards: Card[], fullPip: boolean = true): string {
    let result = ANSI_CARD_BACKGROUND;
    let currentSuit: Card.Suit = -1;
    for (const card of cards) {
        if (card.suit != currentSuit) {
            result += ANSI_SUITS[card.suit];
        }
        result += "[" + (fullPip? Card.getPip(card) : card.rank) + SUIT_SYMBOLS[card.suit] + "]";
    }
    return result + ANSI_CLEAR;
}


export function getSmallHandDisplay(hand: Card[], cut: Card[] = [], fullPip: boolean = true): string {
    let result = getSmallCardDisplay(hand, fullPip);
    if (cut.length > 0) {
        result += "  " + getSmallCardDisplay(cut, fullPip);
    }
    return result;
}