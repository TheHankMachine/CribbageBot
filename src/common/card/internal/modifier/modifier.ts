import "./simple-modifiers.js"
import { Definitions } from "./definitions.js";
import { ExtendedScorer } from "../../../score/extended-scorer.js";
import { Card } from "../../card.js";

export type Modifier = string;

export namespace Modifier {

    export function all(): Modifier[] {
        return Definitions.modifiers;
    }

    export function getValueType(modifier: Modifier) {
        return Definitions.modifierValueTypes[modifier];
    }

    export function process(scorer: ExtendedScorer, card: Card): Card[] {
        if (!card.modifier) return [card];
        return Definitions.scoreCallbacks[card.modifier](scorer, card);
    }

}