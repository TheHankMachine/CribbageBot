import { Card } from "../../card/card.js";


const RANKS = Card.Rank.all();
const MODIFIERS = Card.Modifier.all();
const SUITS = Card.Suit.symbols();


/**
 * @return [match, remainingString] 
 */
function extract(search: string, options: string[], part: "start" | "end"): [string | undefined, string] {
    options.sort((a, b) => b.length - a.length);
    for (const option of options) {
        if (part == "start" && search.startsWith(option)) {
            return [option, search.slice(option.length)];
        } else if (part == "end" && search.endsWith(option)) {
            return [option, search.slice(0, -option.length)];
        }
    }
    return [undefined, search];
}


export function parseCard(str: string): Card {
    let rank, modifier, modifierValue, suit;

    [rank, str] = extract(str, RANKS, "start");
    [suit, str] = extract(str, SUITS, "end");
    [modifier, str] = extract(str, MODIFIERS, "start");

    if (modifier) {
        modifierValue = str;
    } else {
        modifierValue = undefined;
    }

    return {
        rank: rank!,
        suit: suit? SUITS.indexOf(suit) : Card.Suit.SPADES,
        modifier: modifier,
        modifierValue: modifierValue
    }
}