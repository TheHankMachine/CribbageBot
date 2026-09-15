import { Card } from "../../card.js";
import { registerModifier } from "./definitions.js";


registerModifier({
    modifier: "*",
    modifierValueType: "number",
    scoreCallback: (_, card, backlog) => {
        const copy = { ...card };
        
        // remove modifier to prevent infinite recursion
        copy.modifier = undefined;

        const n = Number(card.modifierValue);
        backlog.unshift(...new Array(n).fill(copy));

        return true;
    }
});


registerModifier({
    modifier: ",",
    modifierValueType: "rank",
    scoreCallback: (scorer, card, backlog) => {
        const leftHand = { ...card };
        const rightHand = { ...card };

        rightHand.rank = card.modifierValue as Card.Rank;

        leftHand.modifier = undefined;
        rightHand.modifier = undefined;

        backlog.unshift(leftHand, rightHand);

        return true;
    }
});


registerModifier({
    modifier: "+",
    modifierValueType: "number",
    scoreCallback: (scorer, card, _) => {
        scorer.bonus += Number(card.modifierValue);
        return false;
    }
});