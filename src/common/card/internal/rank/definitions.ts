import { ExtendedScorer } from "../../../score/extended-scorer.js"
import { Card } from "../../card.js"


export type RunConnection = {
    predecessor?: Card.Rank,
    successor?: Card.Rank
}


export type ScoreCallback = (scorer: ExtendedScorer, card: Card) => Card[];


export type RankDefinition = {
    rank: Card.Rank,
    value: number,
    face: string[],
    runConnections?: RunConnection, 
    processCallback?: ScoreCallback
}


export namespace Definitions {
    export const names: Card.Rank[] = [];
    export const values: Record<Card.Rank, number> = {};
    export const faces: Record<Card.Rank, string[]> = {};

    export const scoreCallbacks: Record<Card.Rank, ScoreCallback> = {}
    export const runOrder = [];

}
// TODO: remove export
export const runConnections: Record<Card.Rank, RunConnection> = {};


export function registerRank(definition: RankDefinition) {
    Definitions.names.push(definition.rank);

    Definitions.values[definition.rank] = definition.value;
    Definitions.faces[definition.rank] = definition.face;
    
    if (definition.runConnections) runConnections[definition.rank] = definition.runConnections;
    if (definition.processCallback) Definitions.scoreCallbacks[definition.rank] = definition.processCallback;
}
