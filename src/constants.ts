// TODO: clean the fuck up
export const today = () =>
    new Date().toLocaleDateString('nl', {
        timeZone: 'Etc/GMT+4',
    });

export const CURRENCY_NAME = '🐒';

export const STANDARD_RANK_SYMBOLS = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];


export const HAND_SIZE = 6;
export const DISCARD_COUNT = 2;


export const CARD_VALUES: Record<string, number> = {
    '0': 0,
    'A': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    '15': 15,
    'B': 20,
};


export namespace DisplayConstants {
    export const SUIT_SYMBOLS = '♠♥♣♦? ';

    export const MAX_TERMINAL_WIDTH = 40;
    export const ANSI_SUITS = [
        '[30m', //'[30m',
        '[31m',
        '[34m', //'[34m',
        '[33m', //'[33m'
        '[35m',
        '[30m',
    ];
    export const ANSI_CARD_BACKGROUND = '[47m'; 
    export const ANSI_CLEAR = '[0m';
    export const CARD_FACES: Record<string, string[]> = {
        '0':  ['0      ', '       ', '       ', '       ', '      0'],
        'A':  ['A      ', '       ', '   x   ', '       ', '      ∀'],
        '2':  ['2      ', '   x   ', '       ', '   x   ', '      Z'],
        '3':  ['3      ', '   x   ', '   x   ', '   x   ', '      E'],
        '4':  ['4      ', '  x x  ', '       ', '  x x  ', '      h'],
        '5':  ['5      ', '  x x  ', '   x   ', '  x x  ', '      S'],
        '6':  ['6      ', '  x x  ', '  x x  ', '  x x  ', '      9'],
        '7':  ['7      ', '  x x  ', ' x x x ', '  x x  ', '      L'],
        '8':  ['8      ', ' x x x ', '  x x  ', ' x x x ', '      8'],
        '9':  ['9      ', ' x x x ', ' x x x ', ' x x x ', '      6'],
        '10': ['10     ', ' x x x ', ' x x x ', ' x x x ', ' x   0I'],
        'J':  ['J      ', ' x {)  ', ' |/%/| ', '  (} x ', '      ſ'],
        'Q':  ['Q      ', ' x/(}, ', ' /\\%\\/ ', " '{)/x ", '      O'],
        'K':  ['K   W  ', ' x {)| ', ' |/%/| ', ' |(} x ', '  M   >'],
        '15': ['15     ', ' xxxxx ', ' xxxxx ', ' xxxxx ', '     SI'],
        'B':  ['       ', '       ', '       ', '       ', '       '],
    };
    export const CARD_BORDER_HEIGHT = 7;
    export const CARD_BORDER_REPLACE_CHAR = "x";
    export const CARD_BORDER: Record<string, string> = {
        top: '╭───────╮',
        side: '│',
        bottom: '╰───────╯',
    };
}