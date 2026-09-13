import { ExtendedScorer } from "../../../score/extended-scorer.js";
import { Card } from "../../card.js";
import { registerRank } from "./definitions.js";


registerRank({
    rank: "0",
    value: 0,
    face: [
        "0      ", 
        "       ", 
        "       ", 
        "       ", 
        "      0"
    ]
});


registerRank({
    rank: "15",
    value: 15,
    face: [
        "15     ", 
        " xxxxx ", 
        " xxxxx ", 
        " xxxxx ", 
        "     SI"
    ]
});


// 🤮🤮🤮🤮🤮🤮🤮🤮🤮
registerRank({
    rank: ">>",
    value: 0,
    face:  [
        ">>     ", 
        "       ", 
        "       ", 
        "       ", 
        "     <<"
    ],
    preScoringCallback: (scorer_, card) => {
        // 🤮🤮🤮
        const scorer = scorer_ as any;
        scorer.rightwardCopies = scorer.rightwardCopies ?? 0;

        if (card.rank == ">>" || scorer.rightwardCopies == 0) {
            return undefined;
        }
        const copies = scorer.rightwardCopies + 1;
        scorer.rightwardCopies = 0;
        return new Array(copies).fill(card);
    },
    scoreCallback: (scorer_, card) => {
        // 🤮🤮🤮
        const scorer = scorer_ as any;
        scorer.rightwardCopies = scorer.rightwardCopies ?? 0;

        const result = scorer.processModifiers(card).flat() as Card[];
        const newCards = result.filter(card => card.rank != ">>");
        scorer.rightwardCopies += result.length - newCards.length;
        return newCards;
    }
});