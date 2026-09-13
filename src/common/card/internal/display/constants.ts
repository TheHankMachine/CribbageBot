import { Suit } from "../suit.js";

export const SUIT_SYMBOLS = Suit.symbols();

export const ANSI_CARD_BACKGROUND = '[47m'; 
export const ANSI_CLEAR = '[0m';

export const ANSI_SUITS = [ '[30m', '[31m', '[34m', '[33m', '[35m', '[30m' ];

export const CARD_BORDER_HEIGHT = 7;
export const CARD_BORDER_REPLACE_CHAR = "x";
export const CARD_BORDER: Record<string, string> = {
    top: '╭───────╮',
    side: '│',
    bottom: '╰───────╯',
};