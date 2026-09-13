import { Card, Deck } from "../../card/card.js"


export type DeckPosition = {
    card: Card,
    dupeNumber: number
};


// TODO: remove this export
function getAndMoveSuit(deck: Deck, position: DeckPosition, delta: number) {
    if (delta == 0) return;

    const suitBuckets: Record<Card.Suit, Card[]> = Card.Suit.all().map(_ => []);
    for (const card of deck) {
        suitBuckets[card.suit].push(card);
    }
    
    let suit = position.card.suit;
    // skip over suits that you don't have
    do {
        suit = (suit + delta + Card.Suit.length) % Card.Suit.length;
        // this second condition is unnecessary
    } while (suitBuckets[suit].length == 0 && suit != position.card.suit);

    // get new bucket and the index to enter that bucket, clamping to the rightmost card
    const bucket = suitBuckets[suit];
    const i = Math.min(
        position.dupeNumber + suitBuckets[position.card.suit].findIndex(card => Card.equals(card, position.card)),
        bucket.length - 1
    );
    
    const card = bucket[i];
    const dupeNum = i - bucket.findIndex(c => Card.equals(card, c));

    position.card = card;
    position.dupeNumber = dupeNum;
}


function getAndMoveRank(deck: Deck, position: DeckPosition, delta: number) {
    if (delta == 0) return;

    const suitBucket = deck.filter(card => card.suit == position.card.suit);
    const i = (
        suitBucket.findIndex(card => Card.equals(card, position.card))
        + position.dupeNumber 
        + delta
        + suitBucket.length
    ) % suitBucket.length;
    
    const card = suitBucket[i];
    const dupeNum = i - suitBucket.findIndex(c => Card.equals(card, c));

    position.card = card;
    position.dupeNumber = dupeNum;
}


/**
 * @requires deck is sorted
 */
export function getAndMove(deck: Deck, position: DeckPosition, move: "up" | "down" | "left" | "right") {
    if (move == "up") return getAndMoveSuit(deck, position, -1);
    else if (move == "down") return getAndMoveSuit(deck, position, 1);
    else if (move == "left") return getAndMoveRank(deck, position, -1);
    else if (move == "right") return getAndMoveRank(deck, position, 1);
}