import { testScore } from "./testScore.js"


// export const SUIT_SYMBOLS = '♠♥♣♦? ';
testScore(["3♠", "3♥"], 2n, "testing pairs");
testScore(["5♦", "K♥"], 2n, "testing fifteens");
testScore(["7♦", "7♣", "7♥"], 6n, "testing trips");
testScore(["A♠", "2♥", "3♥"], 3n, "testing runs");
testScore(["A♣", "2♥", "3♥", "3♠"], 8n, "testing double run");
testScore(["5♠", "5♣", "10♠", "10♠"], 12n, "testing 12 hand");

testScore([["2♠", "J♣"], ["7♣"]], 1n, "testing nobs");
testScore([["2♠", "J♣"], ["7♣", "4♣"]], 2n, "testing nobs with multiple cuts");
testScore([["J♣", "J♣", "6♦"], ["7♣"]], 4n, "testing nobs with multiple jacks");
testScore([["J♣", "J♣", "6♦"], ["7♣", "4♣"]], 6n, "testing nobs with many things");

testScore([["2♠", "A♦"], ["J♣"]], 2n, "testing nibs");
testScore([["2♠", "A♦"], ["J♣", "J♣"]], 6n, "testing nibs with multiple jacks");

testScore([["4♥", "10♥", "9♥", "Q♥"], ["3♣"]], 4n, "testing hand-only flush");
testScore([["4♥", "10♥", "9♥", "Q♥"], ["3♥"]], 5n, "testing full flush");