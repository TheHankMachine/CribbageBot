import "./simple-modifiers.js"
import { Definitions } from "./definitions.js";

export type Modifier = string;

export namespace Modifier {

    export function all(): Modifier[] {
        return Definitions.modifiers;
    }

    export function getValueType(modifier: Modifier) {
        return Definitions.modifierValueTypes[modifier];
    }

}