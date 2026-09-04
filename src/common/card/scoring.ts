import { Card } from "./card.js";


export function spreadCardOptions(card: Card): Card[] {
    const options = card.rank.split('/');
    const rank = options[Math.floor(Math.random() * options.length)];

    if (rank == 'B') {
        return [];
    }

    if (rank.length == 1) {
        return [card];
    }

    if (rank[1] == '*') {
        return new Array(Number(rank.slice(2))).fill({rank: rank[0], suit: card.suit});
    }
    
    return [];
}