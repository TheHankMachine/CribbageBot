// TODO: clean the fuck up
export const today = () =>
    new Date().toLocaleDateString('nl', {
        timeZone: 'Etc/GMT+4',
    });

export const CURRENCY_NAME = '🐒';

export const STANDARD_RANK_SYMBOLS = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];


export const HAND_SIZE = 6;
export const DISCARD_COUNT = 2;


export const MAX_ANSI_WIDTH = 40;