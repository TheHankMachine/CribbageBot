import { DisplayConstants } from "../../../constants.js";
import * as Constants from "../../../constants.js"
import { getCardPip } from "./util.js";
import { Card, Suit } from "../card.js";


export function getSmallCardDisplay(cards: Card[]): string {
    let result = DisplayConstants.DISCORD_ESCAPE_BACKGROUND;
    let currentSuit: Suit = -1;
    for (const card of cards) {
        if (card.suit != currentSuit) {
            result += DisplayConstants.DISCORD_ESCAPE_SUITS[card.suit];
        }
        result += "[" + getCardPip(card) + "]";
    }
    return result;
}


export function getSmallHandDisplay(hand: Card[], cut: Card[] = []): string {
    return getSmallCardDisplay(hand) + " " + getSmallCardDisplay(cut);
}


export function getLargeHandDisplay(hand: Card[], cut: Card[] = []): string {
    const rows: string[] = new Array(DisplayConstants.CARD_BORDER_HEIGHT).fill("");

    // HUH?!
    const nCards = hand.length + cut.length * 1.5;
    const overBudget = (DisplayConstants.CARD_BORDER.top.length * nCards - DisplayConstants.MAX_TERMINAL_WIDTH) / nCards;
    const overlap = Math.min(
        Math.max(0, Math.ceil(overBudget)),
        DisplayConstants.CARD_BORDER.top.length - 2
    );

    function addCard(card: Card) {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].length > 0 && overlap > 0) {
                rows[i] = rows[i].slice(0, -overlap);
            }
        }

        const cardFace = DisplayConstants.CARD_FACES[card.rank[0]];
        const esc = DisplayConstants.DISCORD_ESCAPE_SUITS[card.suit];
        const pip = card.rank.split('').map((e) => Constants.RANK_NAMES[e] ?? e).join('');

        rows[0] += esc + DisplayConstants.CARD_BORDER.top;
        for (let i = 0; i < cardFace.length; i++) {
            let c = DisplayConstants.CARD_BORDER.middle.replace(
                'x',
                cardFace[i].replaceAll('x', DisplayConstants.SUIT_SYMBOLS[card.suit])
            );

            if (i == 0) {
                c = c.slice(0, 1) + pip + c.slice(pip.length + 1);
            }

            rows[i + 1] += esc + c;
        }
        rows[DisplayConstants.CARD_BORDER_HEIGHT - 1] +=
        esc + DisplayConstants.CARD_BORDER.bottom;
    }

    for (const card of hand) {
        addCard(card);
    }

    if (cut.length > 0) {
        for (let i = 0; i < rows.length; i++) {
            rows[i] += ' '.repeat(overlap + 2);
        }

        for (const card of cut) {
            addCard(card);
        }
    }

    return rows.map(e => DisplayConstants.DISCORD_ESCAPE_BACKGROUND + e.trimEnd() + DisplayConstants.DISCORD_ESCAPE_CLEAR).join('\n');
}