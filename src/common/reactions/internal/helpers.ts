import { MessageReaction } from "discord.js";
import { Emojis } from "./emoji.js";
import { Card } from "../../card/card.js";


const INDEX_TO_WORDS: string[] = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];
// zwart (black), red, blue, orange, pink
const SUIT_COLOR_PREFIX = [ "z", "r", "b", "o", "p" ];


export function isConfirmation(reaction: MessageReaction): boolean {
    return reaction.emoji.name == Emojis.CONFIRM;
}


export function isDenial(reaction: MessageReaction): boolean {
    return reaction.emoji.name == Emojis.DENY;
}


/**
 * @returns -1 if emoji is not number
 */
export function getNumber(reaction: MessageReaction): number {
    if (!reaction.emoji.name) return -1;
    let emojiIndex = Emojis.Numbers.indexOf(reaction.emoji.name);
    if (emojiIndex != -1) return emojiIndex;

    const word = reaction.emoji.name.slice(1);
    const customIndex = INDEX_TO_WORDS.indexOf(word);
    if (customIndex != -1) return customIndex;

    return -1;
}


export function getSuit(reaction: MessageReaction): Card.Suit | undefined {
    const prefix = reaction.emoji.name?.[0];
    if (!prefix) return undefined;

    const suit = SUIT_COLOR_PREFIX.indexOf(prefix);
    if (suit == -1) return undefined

    return suit;
}


export function getEmojiFromNumber(num: number, suit?: Card.Suit): string {
    if (suit == undefined) return Emojis.Numbers[num];

    const name = SUIT_COLOR_PREFIX[suit] + INDEX_TO_WORDS[num];

    return `:${name}:${Emojis.CUSTOM_NAME_TO_ID[name]}`;
}