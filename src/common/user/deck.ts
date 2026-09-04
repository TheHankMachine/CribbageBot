// import { getCardCost } from './shop.js';
// import { Card, suit, rank } from '../classes/card.js';
import { User } from 'discord.js';
import * as Constants from '../../constants.js';
import { Card, Deck, Rank, Suit } from "../card/card.js";
import { getUserData, setUserData } from '../db.js';


export function initDeck(): Deck {
    const deck: Deck = [];
    for (const suit of [Suit.SPADES, Suit.HEARTS, Suit.CLUBS, Suit.DIAMONDS]) {
        for (const rank of Constants.STANDARD_RANK_SYMBOLS) {
            deck.push({rank: rank, suit: suit});
        }
    }
    return deck;
}


export async function getDeck(user: User, shuffled = false): Promise<Deck> {
    let deck = await getUserData<Deck>(user.id, "deck", []);
    if (deck.length == 0) {
        deck = initDeck();
        await setUserData<Deck>(user.id, "deck", deck);
    }
    if (shuffled) shuffle(deck);
    return deck;
}


export async function giveCard(user: User, card: Card) {
    const deck = await getUserData<Deck>(user.id, "deck", []);
    deck.push(card);
    await setUserData<Deck>(user.id, "deck", deck);
}


//removes a single instance of a card
export async function removeCard(user: User, card: Card) {
    const deck = await getUserData<Deck>(user.id, "deck", []);
    let i = deck.findIndex((e: Card) => e.rank == card.rank && e.suit == card.suit);
    if (i == -1) return;
    deck.splice(i, 1);
    await setUserData<Deck>(user.id, "deck", deck);
}


const BASE_CARD_COST = 10;
const DECK_WORTH_MULT = 2.5;


const RANK_ORDER: Record<Rank, number> = {};
'0A23456789XJQKFB'.split("").forEach((rank, i) => RANK_ORDER[rank] = i);


export async function getAndSortDeck(user: User): Promise<Deck> {
    const deck = await getDeck(user, false);
    deck.sort((a, b) => {
        if (a.suit != b.suit) {
            return a.suit - b.suit;
        }
        return RANK_ORDER[a.rank[0]] - RANK_ORDER[b.rank[0]];
    });
    await setUserData<Deck>(user.id, "deck", deck);
    return deck;
}


/**
 * shuffles an array in place
 */
export function shuffle<T>(array: T[]) {
    const copy: [T, number][] = new Array(array.length);
    //pack
    for (let i = 0; i < array.length; i++) {
        copy[i] = [array[i], Math.random()];
    }

    copy.sort((a, b) => a[1] - b[1]);

    //unpack
    for (let i = 0; i < array.length; i++) {
        array[i] = copy[i][0];
    }
}


// export function deal(deck: Deck, handSize: number = 6): Hand {
//   const hand: Hand = [];

//   if (handSize > deck.length) {
//     throw new Error(`deck does not have enough cards to deal`);
//   }

//   for (let i = 0; i < handSize; i++) {
//     hand.push(deck.pop()!);
//   }

//   return hand;
// }


