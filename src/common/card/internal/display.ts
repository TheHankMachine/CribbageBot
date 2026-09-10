import { DisplayConstants } from "../../../constants.js";
import * as Constants from "../../../constants.js"
import { getPip } from "./util.js";
import { Card } from "../card.js";


export function getSmallCardDisplay(cards: Card[], fullPip: boolean = true): string {
    let result = DisplayConstants.ANSI_CARD_BACKGROUND;
    let currentSuit: Card.Suit = -1;
    for (const card of cards) {
        if (card.suit != currentSuit) {
            result += DisplayConstants.ANSI_SUITS[card.suit];
        }
        result += "[" + (fullPip? getPip(card) : card.rank) + DisplayConstants.SUIT_SYMBOLS[card.suit] + "]";
    }
    return result + DisplayConstants.ANSI_CLEAR;
}


export function getSmallHandDisplay(hand: Card[], cut: Card[] = [], fullPip: boolean = true): string {
    let result = getSmallCardDisplay(hand, fullPip);
    if (cut.length > 0) {
        result += "  " + getSmallCardDisplay(cut, fullPip);
    }
    return result;
    // return getSmallCardDisplay(hand) + "  " + getSmallCardDisplay(cut);
}


// TODO: refactor and fix
// TODO: split into multiple functions
export function getLargeHandDisplay(hand: Card[], cut: Card[] = [], fullPip: boolean = true): string {
    const cardWidth = DisplayConstants.CARD_BORDER.top.length;
    const cutSplitWidth = 3;

    let requiredLength = 0;
    let nOverlappedCards = 0;
    if (hand.length > 0) {
        requiredLength += cardWidth;
        nOverlappedCards += hand.length - 1;
    }
    if (cut.length > 0) { 
        requiredLength += cutSplitWidth;
        requiredLength += cardWidth; 
        nOverlappedCards += cut.length - 1;
    } 

    let overlapVisiblePartLength = Math.floor((DisplayConstants.MAX_TERMINAL_WIDTH - requiredLength) / nOverlappedCards);

    // cannot display with big cards, default to small display
    if (overlapVisiblePartLength < 2) {
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

        const pip = fullPip? getPip(card) : card.rank;        
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

    return DisplayConstants.ANSI_CARD_BACKGROUND + rows.join("\n") + DisplayConstants.ANSI_CLEAR;

}


export function renameMeLaterTransmutationDisplay(left: Card, right: Card, arrow: "->" | "<-" | "<->" = "->") {
    const leftDisplay = getLargeHandDisplay([left]).split("\n");
    const rightDisplay = getLargeHandDisplay([right]).split("\n");

    // pad arrow so it looks slightly nicer
    arrow = " " + arrow + " ";

    const height = leftDisplay.length;

    let result = ""
    for (let i = 0; i < height; i++) {
        const middleSpace = i == Math.floor(leftDisplay.length / 2) ? arrow : " ".repeat(arrow.length);
        result += leftDisplay[i]
        result += DisplayConstants.ANSI_CLEAR + middleSpace + DisplayConstants.ANSI_CARD_BACKGROUND 
        result += rightDisplay[i] + '\n';
    }

    return result;
}