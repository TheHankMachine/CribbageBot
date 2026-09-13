export type ScoringComponent = number;
export namespace ScoringComponent {
    export const FIFTEEN   = 0;
    export const PAIR      = 1;
    export const RUN       = 2;
    export const FLUSH     = 3;
    export const NIB       = 4;
    export const NOB       = 5;
    export const BONUS     = 6;

    export const length = 7;
    export const entries: () => ScoringComponent[] = () => Array.from({ length: length }, (_, i) => i);
}