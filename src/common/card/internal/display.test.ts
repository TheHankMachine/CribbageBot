import { assert, expect, test } from 'vitest'
import * as Display from "./display.js"
import { DISCARD_COUNT, DisplayConstants } from '../../../constants.js';
import { Constants } from 'discord.js';


const ACE_OF_SPADES = { rank: "A", suit: 0 };


function removeAnsi(str: string): string {
    return str.replaceAll(/\[\d+m/g, "");
}


test("large hand display is not longer than max terminal width", () => {
    const display = Display.getLargeHandDisplay(
        // [ACE_OF_SPADES]
        new Array(7).fill(ACE_OF_SPADES),
        new Array(3).fill(ACE_OF_SPADES)
    );

    const rawDisplay = removeAnsi(display);

    rawDisplay.split("\n").forEach(row => expect(row.length).toBeLessThanOrEqual(DisplayConstants.MAX_TERMINAL_WIDTH));
});



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