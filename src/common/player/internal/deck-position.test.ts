import { expect, test } from 'vitest'
import { parseCard } from "../../score/tests/parse-card.js";
import { getAndMove } from "./deck-position.js";
import { Card } from "../../card/card.js";


// export const SUIT_SYMBOLS = '♠♥♣♦? ';
const deck = [
    ...("A23456789Q".split("").map(e => parseCard(e + "♠"))),
    ...("22567".split("").map(e => parseCard(e + "♥"))),
    // no clubs
    ...("7".split("").map(e => parseCard(e + "♦"))),
    ...("JJQQQQ".split("").map(e => parseCard(e + "?")))
];


// these tests are ass but whatever
// good enough for tdd

// MoveRank
test("position is moved to next rank", () => {
    const position = { card: parseCard("3♠"), dupeNumber: 0 };
    getAndMove(deck, position, "right")

    expect(position.card.suit).toBe(Card.Suit.SPADES);
    expect(position.card.rank).toBe("4");
});


test("rank wraps around right", () => {
    const position = { card: parseCard("7♥"), dupeNumber: 0 };
    getAndMove(deck, position, "right")

    expect(position.card.suit).toBe(Card.Suit.HEARTS);
    expect(position.card.rank).toBe("2");
});


test("rank wraps around left", () => {
    const position = { card: parseCard("A♠"), dupeNumber: 0 };
    getAndMove(deck, position, "left")

    expect(position.card.suit).toBe(Card.Suit.SPADES);
    expect(position.card.rank).toBe("Q");
});


test("dupeNumber is maintained with rank", () => {
    const position = { card: parseCard("Q?"), dupeNumber: 1 };
    getAndMove(deck, position, "right")

    expect(position.card.suit).toBe(Card.Suit.WILD);
    expect(position.card.rank).toBe("Q");
    expect(position.dupeNumber).toBe(2);
});


// MoveSuit
test("position is moved to next suit", () => {
    const position = { card: parseCard("3♠"), dupeNumber: 0 };
    getAndMove(deck, position, "down")

    expect(position.card.suit).toBe(Card.Suit.HEARTS);
    expect(position.card.rank).toBe("5");
});


test("suit wraps around top", () => {
    const position = { card: parseCard("3♠"), dupeNumber: 0 };
    getAndMove(deck, position, "up")

    expect(position.card.suit).toBe(Card.Suit.WILD);
    expect(position.card.rank).toBe("Q");
});


test("suit wraps around bottom", () => {
    const position = { card: parseCard("J?"), dupeNumber: 0 };
    getAndMove(deck, position, "down")

    expect(position.card.suit).toBe(Card.Suit.SPADES);
    expect(position.card.rank).toBe("A");
});


test("missing suit is skipped", () => {
    const position = { card: parseCard("2♥"), dupeNumber: 0 };
    getAndMove(deck, position, "down")

    expect(position.card.suit).toBe(Card.Suit.DIAMONDS);
    expect(position.card.rank).toBe("7");
});


test("moving suits clamps left", () => {
    const position = { card: parseCard("Q♠"), dupeNumber: 0 };
    getAndMove(deck, position, "down")

    expect(position.card.suit).toBe(Card.Suit.HEARTS);
    expect(position.card.rank).toBe("7");
});


test("dupeNumber is maintained with suits", () => {
    const position = { card: parseCard("6♠"), dupeNumber: 0 };
    getAndMove(deck, position, "up")

    expect(position.card.suit).toBe(Card.Suit.WILD);
    expect(position.card.rank).toBe("Q");
    expect(position.dupeNumber).toBe(3);
});


test("once problematic test case works", () => {
    const position = { card: parseCard("7♥"), dupeNumber: 0 };
    getAndMove(deck, position, "down");

    expect(position.card.suit).toBe(Card.Suit.DIAMONDS);
    expect(position.card.rank).toBe("7");
    // expect(position.dupeNumber).toBe(3);
});


test("failsafe is triggered when starting from a position outside of the deck", () => {
    const position1 = { card: parseCard("J♥"), dupeNumber: 0 };
    getAndMove(deck, position1, "down");

    expect(position1.card.suit).toBe(Card.Suit.SPADES);
    expect(position1.card.rank).toBe("A");

    const position2 = { card: parseCard("J♥"), dupeNumber: 0 };
    getAndMove(deck, position2, "right");

    expect(position2.card.suit).toBe(Card.Suit.SPADES);
    expect(position2.card.rank).toBe("A");
});