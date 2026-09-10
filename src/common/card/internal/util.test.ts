import { assert, expect, test } from 'vitest'
import * as Util from "./util.js"


test("card with undefined modifier ignores modifier value", () => {
    expect(Util.equals(
        {
            rank: "A",
            suit: 0
        },
        {
            rank: "A",
            suit: 0,
            modifier: undefined,
            modifierValue: 2
        }
    )).toBe(true);
});


test("card with undefined value is equal to omiting key", () => {
    expect(Util.equals(
        {
            rank: "A",
            suit: 0
        },
        {
            rank: "A",
            suit: 0,
            modifier: undefined
        }
    )).toBe(true);
});


test("cards with different rank are not equal", () => {
    expect(Util.equals(
        {
            rank: "A",
            suit: 0
        },
        {
            rank: "2",
            suit: 0,
        }
    )).toBe(false);
});


test("cards with different suit are not equal", () => {
    expect(Util.equals(
        {
            rank: "A",
            suit: 0
        },
        {
            rank: "A",
            suit: 1,
        }
    )).toBe(false);
});