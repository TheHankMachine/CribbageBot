import { Card, Hand } from "../card/card.js";
import { BaseScorer } from "./base-scorer.js";
import { ScoringComponent } from "./scoring-component.js";
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


export class ExtendedScorer extends BaseScorer {


    public scoreMults: Record<ScoringComponent, number> = ScoringComponent.entries().map(_ => 1);
    public bonus: number = 0;

    public hand: Hand = [];
    public cut: Card[] = [];


    constructor(hand: Hand, cut: Card[] = []) {
        super();

        this.hand = hand.flatMap(card => this.process(card));
        this.cut = cut.flatMap(card => this.process(card));
        
        this.hand.forEach(card => this.addHandCard(card));
        this.cut.forEach(card => this.addCutCard(card));
    }


    public process(card: Card): Card[] {
        return this.processRanks(card).flatMap(card => this.processModifiers(card));
    }


    // TODO: stragety pattern or something
    public processRanks(card: Card): Card[] {
        return Card.Rank.process(this, card);
    }


    // TODO: stragety pattern or something
    public processModifiers(card: Card): Card[] {

        return Card.Modifier.process(this, card);

        // if (card.modifier == "*") {
        //     const n = Number(card.modifierValue); // FAUK ME 
        //     // it does not matter that this is all the same reference
        //     return new Array(n).fill(card);
        // }
        
        // if (card.modifier == ",") {
        //     const copy = { ...card };
        //     copy.rank = card.modifierValue as Card.Rank;
        //     // strip card of union modifier so we don't get extra cards
        //     copy.modifier = undefined;
        //     return [card, ...this.processRanks(copy)];
        // }

        // if (card.modifier == "+") {
        //     this.bonus += Number(card.modifierValue);
        // }

        // return [card];
    }
    

    public getExplainationAndScore(): [string, bigint] {
		const halfWidth = Math.floor(Constants.MAX_ANSI_WIDTH / 2);

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

    
    // this is dumb
    public getTotal() {
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

        return Object.values(scores).reduce((a, b) => a + b);
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