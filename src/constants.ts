
export const today = () =>
    new Date().toLocaleDateString('nl', {
        timeZone: 'Etc/GMT+4',
    });

export const CURRENCY_NAME = '🐒';
export const HALT_CODE = 0x48414C54; // HALT in hexidecimal

export const STANDARD_RANK_SYMBOLS = 'A23456789XJQK';
export const RANK_NAMES: Record<string, string> = {
    "X": '10',
    "F": '15',
    "B": ' ',
};

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
    'X': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'F': 15,
    'B': 20,
};


export const CONFIRMATION_EMOJIES = {
  confirm: '🟩',
  deny: '🟥',
};
export const NUMBER_EMOJIES = [
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
].slice(0, HAND_SIZE);

export const ARROW_EMOJIES = {
  up: '⬆️',
  right: '➡️',
  down: '⬇️',
  left: '⬅️',
  swap: '🔀',
  reroll: '🔄',
  // ⬅️ ⬆️ ➡️ ⬇️ 🔀
};


export namespace DisplayConstants {
    export const SUIT_SYMBOLS = '♠♥♣♦? ';

    export const MAX_TERMINAL_WIDTH = 36;
    export const DISCORD_ESCAPE_SUITS = [
        '[30m', //'[30m',
        '[31m',
        '[34m', //'[34m',
        '[33m', //'[33m'
        '[35m',
        '[30m',
    ];
    export const DISCORD_ESCAPE_BACKGROUND = '[47m'; 
    export const DISCORD_ESCAPE_CLEAR = '[0m';
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
        'X':  ['10     ', ' x x x ', ' x x x ', ' x x x ', ' x   0I'],
        'J':  ['J      ', ' x {)  ', ' |/%/| ', '  (} x ', '      ſ'],
        'Q':  ['Q      ', ' x/(}, ', ' /\\%\\/ ', " '{)/x ", '      O'],
        'K':  ['K   W  ', ' x {)| ', ' |/%/| ', ' |(} x ', '  M   >'],
        'F':  ['15     ', ' xxxxx ', ' xxxxx ', ' xxxxx ', '     SI'],
        'B':  ['       ', '       ', '       ', '       ', '       '],
    };
    export const CARD_BORDER_HEIGHT = 7;
    export const CARD_BORDER_REPLACE_CHAR = "x";
    export const CARD_BORDER: Record<string, string> = {
        top: '╭───────╮',
        middle: '│x│',
        bottom: '╰───────╯',
    };
}

export const CUSTOM_EMOJI_IDS: Record<string, string> = {
    zzero: "1544776281688645703",
    ztwo: "1544776280556441740",
    zthree: "1544776279423852584",
    zsix: "1544776278408830986",
    zseven: "1544776277444268184",
    zone: "1544776275934052562",
    znine: "1544776274923225148",
    zfour: "1544776273602027540",
    zfive: "1544776272465502340",
    zeight: "1544776271274180679",
    rzero: "1544776269529612418",
    rtwo: "1544776268376055939",
    rthree: "1544776267109236817",
    rsix: "1544776265909927947",
    rseven: "1544776264592916510",
    rone: "1544776263326109716",
    rnine: "1544776261434613912",
    rfour: "1544776259970662551",
    rfive: "1544776258829947050",
    reight: "1544776257164673044",
    pzero: "1544776255964975145",
    ptwo: "1544776254467735744",
    pthree: "1544776253146402816",
    psix: "1544776252089569281",
    pseven: "1544776250785013830",
    pone: "1544776249740623892",
    pnine: "1544776248595578900",
    pfour: "1544776247580827668",
    pfive: "1544776246335119402",
    peight: "1544776244791353385",
    ozero: "1544776243524804678",
    otwo: "1544776240442114089",
    othree: "1544776239074512937",
    osix: "1544776237728399431",
    oseven: "1544776236469846147",
    oone: "1544776235236724756",
    onine: "1544776234205057054",
    ofour: "1544776233118605322",
    ofive: "1544776231965302964",
    oeight: "1544776230107349055",
    bzero: "1544776228538548454",
    btwo: "1544776227154563145",
    bthree: "1544776226135216128",
    bsix: "1544776224121954375",
    bseven: "1544776222930771978",
    bone: "1544776221919805501",
    bnine: "1544776220841877645",
    bfour: "1544776219399290981",
    bfive: "1544776217583034419",
    beight: "1544776216400109729",
}