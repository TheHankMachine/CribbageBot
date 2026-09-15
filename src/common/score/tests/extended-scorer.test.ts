import { testScore } from "./testScore.js"


testScore(["2,4♥", "2♦", "4♦"], 4n, "testing union modifier");
// testScore(["5,5♠", "2♣"], 2n, "testing union modifier");

testScore(["3*3♠", "A♣"], 6n, "testing mult modifier");
testScore(["3+2♠", "A♥"], 2n, "testing bonus modifier");


testScore([">>♥", "K♣", "2♦"], 2n, "testing copy right pair");
testScore([">>♦", ">>♠"], 0n, "testing copy right blank");
testScore([">>♦", "A*2♦", "2♠"], 12n, "testing copy modifier");
testScore([">>*2♦", "A♦", "2♠"], 6n, "testing copy with modifier");
testScore([">>♦", ">>♦", "2♠", "4♣"], 6n, "testing copy modifier");
testScore([">>♦", ">>*2♦", "A♠", "4♣"], 12n, "testing multiple copy with modifier");
testScore([">>*2♦", ">>♥", "A♠", "4♣"], 12n, "testing multiple copy with modifier");
testScore([">>,4♠", "3♦", "9♦"], 2n, "testing lefthanded copy in union");
testScore(["2,>>♠", "3♦", "9♦"], 4n, "testing righthanded copy in union");
testScore([">>,>>♠", "3♦", "4♣"], 6n, "testing double copy in union");
testScore([["7♦", "A♠", ">>♣"], ["3♠"]], 2n, "testing copy cut from hand");


testScore([["#♦", "3♠"], ["2♠"]], 1n, "testing length rank with 0");
testScore([["3♠", "#♦"], ["2♥"]], 2n, "testing length rank with 1");
testScore([["3♠", "5♦", "A♣"], ["#♠"]], 4n, "testing length rank in cut");
testScore(["2*3♦", "#♠"], 10n, "testing length rank with prior mult card");

testScore(["A♠", "#*2♥"], 7n, "testing length rank with mult modifier");

testScore(["A♠", "#,3♥"], 2n, "testing length rank in left hand of union modifier");
testScore(["A♠", "3,#♥"], 3n, "testing length rank in right hand of union modifier");

testScore([">>", "#♥", "10♣"], 5n, "testing copy right of length rank 1");
testScore(["4♣", ">>", "#♥", "10♣"], 7n, "testing copy right of length rank 1");
