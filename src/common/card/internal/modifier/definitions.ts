import { ExtendedScorer } from "../../../score/extended-scorer.js"
import { Card } from "../../card.js"


/**
 * returns whether the current card should be skipped in being added to the hand
 * (i.e: a modified copy was but into the backlog and thus the current card should be skipped)
 */
export type ScoreCallback = (scorer: ExtendedScorer, card: Card, backlog: Card[]) => boolean;


export type ModifierDefinition = {
    modifier: Card.Modifier,
    modifierValueType: string;
    scoreCallback?: ScoreCallback
}


export namespace Definitions {
    export const modifiers: Card.Modifier[] = [];
    export const modifierValueTypes: Record<Card.Modifier, string> = {};

    export const scoreCallbacks: Record<Card.Modifier, ScoreCallback> = {};
}


export function registerModifier(definition: ModifierDefinition) {
    Definitions.modifiers.push(definition.modifier);

    Definitions.modifierValueTypes[definition.modifier] = definition.modifierValueType;
    
    if (definition.scoreCallback) Definitions.scoreCallbacks[definition.modifier] = definition.scoreCallback;
}