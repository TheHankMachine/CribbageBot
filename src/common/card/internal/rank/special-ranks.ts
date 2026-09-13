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
    runConnections: {
        successor: "A"
    }
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
    processCallback: (scorer, card) => {
        // 🤮🤮🤮
        const result = scorer.processModifiers(card).flat();
        const newCards = result.filter(card => card.rank != ">>");
        scorer.rightwardCopies += result.length - newCards.length;
        return newCards;
    }
});