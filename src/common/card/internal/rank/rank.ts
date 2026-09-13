import "./standard-ranks.js"
import "./special-ranks.js"
import { Definitions, ScoreCallback } from "./definitions.js";
import { ExtendedScorer } from "../../../score/extended-scorer.js";
import { Card } from "../../card.js";


export type Rank = string;

export namespace Rank {

    export const RUN_ORDER = [ "0", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];

    export function all(): Rank[] {
        return Definitions.ranks;
    }

    export function getValue(rank: Rank) {
        return Definitions.values[rank];
    }

    export function getFace(rank: Rank) {
        return Definitions.faces[rank];
    }

    export function process(scorer: ExtendedScorer, card: Card): Card[] {
        let result = preProcessRank(scorer, card);
        if (result) return result;
        result = processRank(scorer, card);
        if (result) return result;
        return [card];
    }

    function preProcessRank(scorer: ExtendedScorer, card: Card): Card[] | undefined {
        for (const cb of Definitions.preScoringCallbacks) {
            const result = cb(scorer, card);
            if (result) return result;
        }
        return undefined;
    }

    function processRank(scorer: ExtendedScorer, card: Card): Card[] | undefined {
        return Definitions.scoreCallbacks[card.rank]?.(scorer, card);
    }

}