import { DisplayConstants } from "../../../constants.js";
import * as Constants from "../../../constants.js"
import { getPip } from "./util.js";
import { Card } from "../card.js";


export function getSmallCardDisplay(cards: Card[]): string {
    let result = DisplayConstants.ANSI_CARD_BACKGROUND;
    let currentSuit: Card.Suit = -1;
    for (const card of cards) {
        if (card.suit != currentSuit) {
            result += DisplayConstants.ANSI_SUITS[card.suit];
        }
        result += "[" + getPip(card) + DisplayConstants.SUIT_SYMBOLS[card.suit] + "]";
    }
    return result;
}


export function getSmallHandDisplay(hand: Card[], cut: Card[] = []): string {
    return getSmallCardDisplay(hand) + " " + getSmallCardDisplay(cut);
}



// TODO: refactor and fix
// TODO: split into multiple functions
export function getLargeHandDisplay(hand: Card[], cut: Card[] = []): string {
    const cardWidth = DisplayConstants.CARD_BORDER.top.length;
    const cutSplitWidth = 3;

    let requiredLength = 0;
    if (hand.length > 0) {
        requiredLength += cardWidth;
    }
    if (cut.length > 0) { 
        requiredLength += cutSplitWidth;
        requiredLength += cardWidth; 
    }

    let overlapVisiblePartLength = Math.floor((DisplayConstants.MAX_TERMINAL_WIDTH - cardWidth) / (hand.length + cut.length - 1));

    // cannot display with big cards, default to small display
    if (overlapVisiblePartLength == 0) {
        return getSmallHandDisplay(hand, cut);
    }
    
    if (isNaN(overlapVisiblePartLength)) {
        overlapVisiblePartLength = 0;
    }

    const rows = new Array(DisplayConstants.CARD_BORDER_HEIGHT).fill("");
    let currentSuit = -1;

    function addCard(card: Card, isOverlapped: boolean) {
        const cardWidth = isOverlapped ? overlapVisiblePartLength : DisplayConstants.CARD_BORDER.top.length;

        // add ansi suit 
        if (card.suit != currentSuit) {
            for (let i in rows) rows[i] += DisplayConstants.ANSI_SUITS[card.suit];
            currentSuit = card.suit;
        }

        // add card face
        rows[0] += DisplayConstants.CARD_BORDER.top.slice(0, cardWidth);
        rows[rows.length - 1] += DisplayConstants.CARD_BORDER.bottom.slice(0, cardWidth);

        const pip = getPip(card);        
        const face: string[] = DisplayConstants.CARD_FACES[card.rank];

        for (let i = 0; i < face.length; i++) {
            const side = DisplayConstants.CARD_BORDER.side;
            let slice = face[i].replaceAll('x', DisplayConstants.SUIT_SYMBOLS[card.suit])
            if (i == 0) {
                slice = pip.slice(0, face[i].length) + slice.slice(pip.length);
            }
            rows[i + 1] += (side + slice + side).slice(0, cardWidth);
        }
    }

    hand.forEach((card, i) => addCard(card, i != hand.length - 1));
    if (cut.length > 0) {
        for (let i in rows) rows[i] += " ".repeat(cutSplitWidth);
    }
    cut.forEach((card, i) => addCard(card, i != cut.length - 1));

    return "=".repeat(DisplayConstants.MAX_TERMINAL_WIDTH) + "\n" + DisplayConstants.ANSI_CARD_BACKGROUND + rows.join("\n") + DisplayConstants.ANSI_CLEAR;


    // // HUH?!
    // const nCards = hand.length + cut.length * 1.5;
    // const overBudget = (DisplayConstants.CARD_BORDER.top.length * nCards - DisplayConstants.MAX_TERMINAL_WIDTH) / nCards;
    // const overlap = Math.min(
    //     Math.max(0, Math.ceil(overBudget)),
    //     DisplayConstants.CARD_BORDER.top.length - 2
    // );

    // function addCard(card: Card) {
    //     for (let i = 0; i < rows.length; i++) {
    //         if (rows[i].length > 0 && overlap > 0) {
    //             rows[i] = rows[i].slice(0, -overlap);
    //         }
    //     }

    //     const cardFace = DisplayConstants.CARD_FACES[card.rank[0]];
    //     const esc = DisplayConstants.DISCORD_ESCAPE_SUITS[card.suit];
    //     const pip = getPip(card);

    //     rows[0] += esc + DisplayConstants.CARD_BORDER.top;
    //     for (let i = 0; i < cardFace.length; i++) {
    //         let c = DisplayConstants.CARD_BORDER.middle.replace(
    //             'x',
    //             cardFace[i].replaceAll('x', DisplayConstants.SUIT_SYMBOLS[card.suit])
    //         );

    //         if (i == 0) {
    //             c = c.slice(0, 1) + pip + c.slice(pip.length + 1);
    //         }

    //         rows[i + 1] += esc + c;
    //     }
    //     rows[DisplayConstants.CARD_BORDER_HEIGHT - 1] +=
    //     esc + DisplayConstants.CARD_BORDER.bottom;
    // }

    // for (const card of hand) {
    //     addCard(card);
    // }

    // if (cut.length > 0) {
    //     for (let i = 0; i < rows.length; i++) {
    //         rows[i] += ' '.repeat(overlap + 2);
    //     }

    //     for (const card of cut) {
    //         addCard(card);
    //     }
    // }

    // return rows.map(e => DisplayConstants.DISCORD_ESCAPE_BACKGROUND + e.trimEnd() + DisplayConstants.DISCORD_ESCAPE_CLEAR).join('\n');
}