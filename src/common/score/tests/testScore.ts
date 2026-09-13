import { assert, expect, test } from 'vitest'
import { parseCard } from "./parse-card.js"
import { Card } from '../../card/card.js';
import { ExtendedScorer } from '../extended-scorer.js';


export function testScore(
    cardStrings: string[] | [string[], string[]], 
    expectedScore: bigint, 
    additionalInfo: string = "",
) {

    let hand: Card[], cut: Card[] = [];
    if (typeof cardStrings[0] == "string") {
        hand = (cardStrings as string[]).map(cardString => parseCard(cardString));
    } else {
        cardStrings = cardStrings as [string[], string[]]
        hand = cardStrings[0].map(cardString => parseCard(cardString));
        cut = cardStrings[1].map(cardString => parseCard(cardString));
    }

    const scorer = new ExtendedScorer(hand, cut);
    const total = scorer.getTotal();

    let text = `scores ${Card.getSmallHandDisplay(hand, cut)}` 
    text += ` as ${total}`;

    if (total != expectedScore) {
        text += ` (should be ${expectedScore})`
    }
    text += ` with ${Card.getSmallHandDisplay(scorer.hand, scorer.cut, false)}`

    // ${expectedScore.toString()}`
    // text += ` (expands to ${Card.getSmallHandDisplay(scorer.hand, scorer.cut, false)})`

    if (additionalInfo) {
        text += ` (${additionalInfo})`;
    }

    
    test(text, () => expect(total).toBe(expectedScore));
}