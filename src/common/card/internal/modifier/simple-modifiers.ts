import { Card } from "../../card.js";
import { registerModifier } from "./definitions.js";


registerModifier({
    modifier: "*",
    modifierValueType: "number",
    scoreCallback: (scorer, card) => {
        const n = Number(card.modifierValue);
        // it does not matter that this is all the same reference
        return new Array(n).fill(card);
    }
});


registerModifier({
    modifier: ",",
    modifierValueType: "rank",
    scoreCallback: (scorer, card) => {
        const copy = { ...card };
        copy.rank = card.modifierValue as Card.Rank;
        // strip card of union modifier so we don't get extra cards
        copy.modifier = undefined;
        return [card, ...scorer.processRanks(copy)];
    }
});


registerModifier({
    modifier: "+",
    modifierValueType: "number",
    scoreCallback: (scorer, card) => {
        scorer.bonus += Number(card.modifierValue);
        return [card];
    }
});