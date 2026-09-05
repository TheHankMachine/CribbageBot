import { Card, Suit } from "../card.js";

const SPECIAL_RANKS = '0F';
const STANDARD_RANKS = "A23456789XJQK"

const MULT_COST_MULT = 5;
const WILD_COST_MULT = 1.5;

const BASE_COST = 10;
const RANK_COST_MULT: Record<string, number> = {
    "0": 2.1,
    "3": 1.1,
    "5": 1.4,
    "F": 1.8,
};

const SPECIAL_RANK_CHANCE = 0.0525;
const WILD_SUIT_CHANCE = 0.075;

const INITIAL_OPTION_CHANCE = 0.15;
const ADDITIONAL_OPTION_CHANCE = 0.1;

const INITIAL_MULT_CHANCE = 0.10;
const ADDITIONAL_MULT_CHANCE = 0.35;


// based on the cdf of the geometric distribution. code by slopgpt
function geoCDFApprox(p: number, initial: number = 1): number {
    if (Math.random() >= initial) {
        return 1;
    }

    if (p <= 0) return 2;
    if (p >= 1) return Infinity;

    return 2 + Math.floor(Math.log(Math.random()) / Math.log(p));
}


export function generateRandomCard(): Card {
    const STANDARD_SUITS = [Suit.SPADES, Suit.HEARTS, Suit.CLUBS, Suit.DIAMONDS];
    const numOptions = geoCDFApprox(ADDITIONAL_OPTION_CHANCE, INITIAL_OPTION_CHANCE);
        
    const options = [];
    for (let i = 0; i < numOptions; i++) {
        const rankOptions = Math.random() < SPECIAL_RANK_CHANCE ? SPECIAL_RANKS: STANDARD_RANKS;
        const rank = rankOptions[Math.floor(Math.random() * rankOptions.length)];
        
        const mult = geoCDFApprox(ADDITIONAL_MULT_CHANCE, INITIAL_MULT_CHANCE);
        
        if (mult == 1) {
            options.push(rank);
        } else {
            options.push(`${rank}*${mult}`);
        }
    }

    const suit = Math.random() < WILD_SUIT_CHANCE ? Suit.WILD : STANDARD_SUITS[Math.floor(Math.random() * STANDARD_SUITS.length)];
    
    return { rank: options.join('/'), suit: suit }
}


export function getCardCost(card: Card): bigint {
    let total_cost = 0;

    const options = card.rank.split('/');

    for (const option of options) {
        let cost = BASE_COST;

        const rank = option[0];
        let mult = 1;
        if (option.length != 1 && option[1] == '*') {
            mult = parseInt(option.slice(2));
        }

        if (rank in RANK_COST_MULT) {
            cost *= RANK_COST_MULT[rank];
        }

        cost *= Math.pow(MULT_COST_MULT, mult - 1);

        total_cost += cost;
    }

    if (card.suit == Suit.WILD) {
        total_cost *= WILD_COST_MULT;
    }

    total_cost = total_cost / options.length;

    return BigInt(Math.floor(total_cost));
}