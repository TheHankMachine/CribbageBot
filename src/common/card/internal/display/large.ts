import { Card } from "../../card.js"
import { ANSI_CARD_BACKGROUND, ANSI_CLEAR, ANSI_SUITS, CARD_BORDER, CARD_BORDER_HEIGHT, SUIT_SYMBOLS } from "./constants.js";
import * as Constants from "../../../../constants.js"
import { getSmallHandDisplay } from "./small.js";


// TODO: refactor and fix
// TODO: split into multiple functions
export function getLargeHandDisplay(hand: Card[], cut: Card[] = [], fullPip: boolean = true): string {
    const cardWidth = CARD_BORDER.top.length;
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


    let overlapVisiblePartLength = 0;
    if (nOverlappedCards > 0) {
        overlapVisiblePartLength = Math.floor((Constants.MAX_ANSI_WIDTH - requiredLength) / nOverlappedCards);
        // cannot display with big cards, default to small display
        if (overlapVisiblePartLength < 2) {
            return getSmallHandDisplay(hand, cut);
        }
    }


    const rows = new Array(CARD_BORDER_HEIGHT).fill("");
    let currentSuit = -1;

    function addCard(card: Card, isOverlapped: boolean) {
        const cardWidth = isOverlapped ? overlapVisiblePartLength : CARD_BORDER.top.length;

        // add ansi suit 
        if (card.suit != currentSuit) {
            for (let i in rows) rows[i] += ANSI_SUITS[card.suit];
            currentSuit = card.suit;
        }

        // add card face
        rows[0] += CARD_BORDER.top.slice(0, cardWidth);
        rows[rows.length - 1] += CARD_BORDER.bottom.slice(0, cardWidth);

        const pip = fullPip? Card.getPip(card) : card.rank;        
        const face: string[] = Card.Rank.getFace(card.rank);


        for (let i = 0; i < face.length; i++) {
            const side = CARD_BORDER.side;
            let slice = face[i].replaceAll('x', SUIT_SYMBOLS[card.suit])
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

    return ANSI_CARD_BACKGROUND + rows.join("\n") + ANSI_CLEAR;

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
        result += ANSI_CLEAR + middleSpace + ANSI_CARD_BACKGROUND 
        result += rightDisplay[i] + '\n';
    }

    return result;
}
