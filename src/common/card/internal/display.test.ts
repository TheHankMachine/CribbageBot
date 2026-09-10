import { assert, expect, test } from 'vitest'
import * as Display from "./display.js"


const ACE_OF_SPADES = { rank: "A", suit: 0 };


test("small card display doesn't crash when empty", () => {
    Display.getSmallHandDisplay([]);
});


test("large card display doesn't crash when empty", () => {
    Display.getLargeHandDisplay([]);
});


// division by zero is fine in this language
test("large card display doesn't crash with one card", () => {
    Display.getLargeHandDisplay([ACE_OF_SPADES]);
});


test("large display does not surpass discord character limit with many cards", () => {
    expect(
        Display.getLargeHandDisplay(new Array(100).fill(ACE_OF_SPADES)).length
    ).lessThan(2_000);
});