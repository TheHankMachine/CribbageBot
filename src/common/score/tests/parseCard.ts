import { Card } from "../../card/card.js";
import { DisplayConstants } from "../../../constants.js";


const RANKS = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "0", "15", ">>" ];
const MODIFIERS = [ "*", ",", "+" ];
const SUITS = DisplayConstants.SUIT_SYMBOLS.split("");

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