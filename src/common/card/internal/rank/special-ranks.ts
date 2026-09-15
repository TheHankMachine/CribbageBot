import { stripVTControlCharacters } from "node:util";
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
    ],
    special: true
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
    ],
    special: true
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
    special: true,
    preScoringCallback: (scorer_, card, backlog) => {
        // 🤮🤮🤮
        const scorer = scorer_ as (ExtendedScorer & { rightwardCopies: number });
        scorer.rightwardCopies = scorer.rightwardCopies ?? 0;

        if (card.rank == ">>" || scorer.rightwardCopies == 0) {
            return false;
        }
        
        const copies = scorer.rightwardCopies + 1;
        scorer.rightwardCopies = 0;
        
        backlog.unshift(...new Array(copies).fill(card));

        return true;
    },
    scoreCallback: (scorer_, card, backlog) => {
        // 🤮🤮🤮
        const scorer = scorer_ as (ExtendedScorer & { rightwardCopies: number });;
        scorer.rightwardCopies = scorer.rightwardCopies ?? 0;

        scorer.rightwardCopies += 1;
        return true;

        // const result = scorer.processModifiers(card).flat() as Card[];
        // const newCards = result.filter(card => card.rank != ">>");
        // scorer.rightwardCopies += result.length - newCards.length;
        // return newCards;
    }
});


registerRank({
    rank: "#",
    value: -1,
    face:  [
        "#      ", 
        "       ", 
        "   x   ", 
        "       ", 
        "      #"
    ],
    special: true,
    scoreCallback: (scorer, card, backlog) => {
        const length =  scorer.hand.length + scorer.cut.length;
        scorer.bonus += length + 1;

        return false;
    }
});