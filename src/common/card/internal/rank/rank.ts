import "./standard-ranks.js"
import "./special-ranks.js"
import { Definitions, ScoreCallback } from "./definitions.js";


export type Rank = string;

export namespace Rank {

    export function all(): Rank[] {
        return Definitions.names;
    }

    export function getValue(rank: Rank) {
        return Definitions.values[rank];
    }

    export function getFace(rank: Rank) {
        return Definitions.faces[rank];
    }

    export function getScoreCallback(rank: Rank): ScoreCallback | undefined {
        return Definitions.scoreCallbacks[rank];
    }

}