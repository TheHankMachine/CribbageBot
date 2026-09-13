import { ExtendedScorer } from "../../../score/extended-scorer.js"
import { Card } from "../../card.js"


// this is overkill and stupid.
// I don't know why I ever thought this design choice would be tolerable. fuck.


export type ScoreCallback = (scorer: ExtendedScorer, card: Card) => Card[] | undefined;


export type RankDefinition = {
    rank: Card.Rank,
    value: number,
    face: string[],
    preScoringCallback?: ScoreCallback,
    scoreCallback?: ScoreCallback
}


export namespace Definitions {
    export const ranks: Card.Rank[] = [];
    export const values: Record<Card.Rank, number> = {};
    export const faces: Record<Card.Rank, string[]> = {};

    export const preScoringCallbacks: ScoreCallback[] = [];
    export const scoreCallbacks: Record<Card.Rank, ScoreCallback> = {}
}


export function registerRank(definition: RankDefinition) {
    Definitions.ranks.push(definition.rank);

    Definitions.values[definition.rank] = definition.value;
    Definitions.faces[definition.rank] = definition.face;
    
    if (definition.preScoringCallback) Definitions.preScoringCallbacks.push(definition.preScoringCallback);
    if (definition.scoreCallback) Definitions.scoreCallbacks[definition.rank] = definition.scoreCallback;
}