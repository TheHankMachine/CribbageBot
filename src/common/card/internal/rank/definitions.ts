import { ExtendedScorer } from "../../../score/extended-scorer.js"
import { Card } from "../../card.js"

/**
 * returns whether the current card should be skipped in being added to the hand
 * (i.e: a modified copy was but into the backlog and thus the current card should be skipped)
 */
export type ScoreCallback = (scorer: ExtendedScorer, card: Card, backlog: Card[]) => boolean;


export type RankDefinition = {
    rank: Card.Rank,
    value: number,
    face: string[],
    special?: boolean,
    preScoringCallback?: ScoreCallback,
    scoreCallback?: ScoreCallback
}


export namespace Definitions {
    export const ranks: Card.Rank[] = [];
    export const specialRanks: Card.Rank[] = []
    export const values: Record<Card.Rank, number> = {};
    export const faces: Record<Card.Rank, string[]> = {};

    export const preScoringCallbacks: ScoreCallback[] = [];
    export const scoreCallbacks: Record<Card.Rank, ScoreCallback> = {}
}


export function registerRank(definition: RankDefinition) {
    Definitions.ranks.push(definition.rank);

    Definitions.values[definition.rank] = definition.value;
    Definitions.faces[definition.rank] = definition.face;

    if (definition.special) Definitions.specialRanks.push(definition.rank);
    if (definition.preScoringCallback) Definitions.preScoringCallbacks.push(definition.preScoringCallback);
    if (definition.scoreCallback) Definitions.scoreCallbacks[definition.rank] = definition.scoreCallback;
}