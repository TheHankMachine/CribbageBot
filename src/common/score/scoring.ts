// import { Card, Rank } from "../card.js";
// import { ScoreVoucher } from "../../score.js"

import { Card, Hand } from "../card/card.js";
import { BasicScorer } from "./basicScorer.js";
import { ScoringComponent } from "./scoringComponents.js";
import * as Constants from "../../constants.js"


const SCORING_COMPONENT_TO_NAME: Record<ScoringComponent, string> = {
    [ScoringComponent.FIFTEEN]: "fifteens",
    [ScoringComponent.PAIR]:    "pairs",
    [ScoringComponent.RUN]:     "runs",
    [ScoringComponent.FLUSH]:   "flush",
    [ScoringComponent.NIB]:     "nibs",
    [ScoringComponent.NOB]:     "nobs",
    [ScoringComponent.BONUS]:   "bonus"
};


export class ModifierScorer extends BasicScorer {


    private scoreMults: Record<ScoringComponent, number> = ScoringComponent.entries().map(_ => 1);
    private bonus: number = 0;

    public hand: Hand = [];
    public cut: Card[] = [];


    constructor(hand: Hand, cut: Card[] = []) {
        super();

        hand.forEach(card => this.processModifiers(card, card => { 
            this.addHandCard(card);
            this.hand.push(card);
        }));

        cut.forEach(card => this.processModifiers(card, card => {
            this.addCutCard(card);
            this.cut.push(card);
        }));
    }


    private processModifiers(card: Card, add: (card: Card) => void) {

        if (card.modifier == "*") {
            const n = card.modifierValue as number;
            for (let i = 0; i < n; i++) {
                add(card);
            }
            return;
        }

        if (card.modifier == "+") {
            this.bonus += card.modifierValue as number;
        }

        if (card.modifier == "&") {
            const copy = { ...card };
            copy.rank = card.modifierValue as Card.Rank;
            add(copy);
        }

        add(card);

    }

    public getExplainationAndScore(): [string, bigint] {
		const halfWidth = Math.floor(Constants.DisplayConstants.MAX_TERMINAL_WIDTH / 2);

        const scores: Record<ScoringComponent, bigint> = {
            [ScoringComponent.FIFTEEN]: this.getFifteensScore(),
            [ScoringComponent.PAIR]:    this.getPairScore(),
            [ScoringComponent.RUN]:     this.getRunScore(),
            [ScoringComponent.FLUSH]:   this.getFlushScore(),
            [ScoringComponent.NIB]:     this.getNibsScore(),
            [ScoringComponent.NOB]:     this.getNobsScore(),
            [ScoringComponent.BONUS]:   BigInt(this.bonus)
        };

        for (const component of ScoringComponent.entries()) {
            scores[component] *= BigInt(this.scoreMults[component]);
        } 

        const total: bigint = Object.values(scores).reduce((a, b) => a + b);

        let explaination = "";
        let explainationRow = "";
        for (const component of ScoringComponent.entries()) {
            if (scores[component] == 0n) continue;

            explainationRow += `${SCORING_COMPONENT_TO_NAME[component]}: ${scores[component].toString()}`;

            if (explainationRow.length > halfWidth) {
                explaination += "\n" + explainationRow;
                explainationRow = "";
            } else {
                explainationRow = explainationRow.padEnd(halfWidth, " ");
            }
        }
        if (explainationRow) {
            explaination += "\n" + explainationRow;
        }
        explaination += `\ntotal ${total.toString()}`;

        return [explaination.trimStart(), total];
    }

        // let explaination = '';



        // for (const component in ScoringComponent.entries) {

        // }

		// function addExplaination(component: ScoringComponent, force: boolean = false) {
		// 	if (!force && score == 0n) {
		// 		return;
		// 	}

// 			let s = `${key}: ${value}`;

// 			if (width - s.length < 0) {
// 				s += '\n';
// 			} else {
// 				s += ' '.repeat(width - s.length);
// 			}
// 			result += s;

// 			if (i % 2 == 1) {
// 				result += '\n';
// 			}

// 			i += 1;
// 		}

// 		const fifteens = this.getFifteensScore();
// 		const pairs = this.getPairScore();
// 		const runs = this.getRunScore();
// 		const flush = this.getFlushScore();
// 		const nobs = this.getNobsScore();

// 		add('fifteens', fifteens);
// 		add('pairs', pairs);
// 		add('runs', runs);
// 		add('flush', flush);
// 		add('nobs', nobs);

// 		const total = fifteens + pairs + runs + flush + nobs;
// 		result = result.trimEnd();
// 		add('\ntotal', total, true);

// 		return [result, total];
// 	}
}






// function multModifier(card: Card, value: number): Card[] {
//     // it is fine that they are all the same reference here here
//     return new Array(value).fill(card);
// }


// const MODIFIER_TO_CALLBACK: Record<Modifier, (card: Card, value: ModifierValue) => ScoringComponent[]> = {
//     "*": (card, value) => multModifier(card, value as number),
//     "+": (card, value) => [value as ScoreVoucher],
// };


// export function spreadCardOptions(card: Card): ScoringComponent[] {

//     if (!card.modifier) {
//         return [card];
//     }

//     if (card.modifier in MODIFIER_TO_CALLBACK) {
//         return MODIFIER_TO_CALLBACK[card.modifier](card, card.modifierValue);
//     }

//     return [];
    
//     // const options = card.rank.split('/');
//     // const rank = options[Math.floor(Math.random() * options.length)];

//     // if (rank == 'B') {
//     //     return [];
//     // }

//     // if (rank.length == 1) {
//     //     return [card];
//     // }

//     // if (rank[1] == '*') {
//     //     return new Array(Number(rank.slice(2))).fill({rank: rank[0], suit: card.suit});
//     // }
    
//     return [];
// }