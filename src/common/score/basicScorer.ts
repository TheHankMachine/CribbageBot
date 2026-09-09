import * as Constants from "../../constants.js";
import { Card, Hand } from "../card/card.js"


const MIN_RUN_LENGTH = 3;
const RUN_RANK_ORDER = [ "0", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];


/**
 * Only support base cribbage scoring rules.
 * 
 * Special ranks and modifiers are not supported, 
 * with the exception of 0 being added to the run order.
 */
export class BaseScorer {
		

	private rankCount: Record<Card.Rank, number> = {};
    private sumPossibilities: bigint[];
	
    private handSuitCount: number[] = new Array(Card.Suit.length).fill(0);
	private cutSuitsCount: number[] = new Array(Card.Suit.length).fill(0);
    private jackSuitCount: number[] = new Array(Card.Suit.length).fill(0);

	private cutJackCount: number = 0;
	private cardCount: number = 0;


    constructor(hand: Hand = [], cut: Card[] = []) {
        this.sumPossibilities = new Array(15 + 1).fill(0n);
        this.sumPossibilities[0] = 1n;

		hand.forEach(card => this.addHandCard(card));
		cut.forEach(card => this.addCutCard(card));
    }


    public addHandCard(card: Card): void {
        this.maintainRankCount(card);
        this.maintainSumPossibilities(card);
        this.maintainHandFlush(card);

		this.cardCount += 1;

        if (card.rank == 'J') {
            this.jackSuitCount[card.suit] += 1;
        }
    }


    public addCutCard(card: Card): void {
		this.maintainRankCount(card);
		this.maintainSumPossibilities(card);
		this.maintainCutFlush(card);

		if (card.rank == 'J') {
			this.cutJackCount += 1;
		}
	}


    private maintainRankCount(card: Card): void {
        this.rankCount[card.rank] = (this.rankCount[card.rank] ?? 0) + 1;
    }


    private maintainSumPossibilities(card: Card): void {
        const value = Card.getRankValue(card);
        for (let j = 15; j >= value; j--) {
        	this.sumPossibilities[j] += this.sumPossibilities[j - value];
        }
    }


	private maintainHandFlush(card: Card): void {
		for (let i = 0; i < this.handSuitCount.length; i++) {
			// +=+! is cursed
			this.handSuitCount[i] += +!Card.isSuit(card, i);
		}
	}


	private maintainCutFlush(card: Card): void {
		for (let i = 0; i < this.cutSuitsCount.length; i++) {
			this.cutSuitsCount[i] += +Card.isSuit(card, i);
		}
	}


	public getRunScore(): bigint {
		let score: bigint = 0n;
		let numPermutations: bigint = 1n;
		let runLength = 0;
		for (const rank of RUN_RANK_ORDER) {
			if (!(rank in this.rankCount)) {
				if (runLength >= MIN_RUN_LENGTH) {
					score += BigInt(runLength) * numPermutations;
				}
				numPermutations = 1n;
				runLength = 0;
			} else {
				numPermutations *= BigInt(this.rankCount[rank]);
				runLength += 1;
			}
		}
		if (runLength >= MIN_RUN_LENGTH) {
			score += BigInt(runLength) * numPermutations;
		}
		return score;
	}


	public getPairScore(): bigint {
		let score = 0;
		for (let rankIndex in this.rankCount) {
			score += (this.rankCount[rankIndex] - 1) * this.rankCount[rankIndex];
		}
		return BigInt(score);
	}


	public getFifteensScore(): bigint {
	    return 2n * this.sumPossibilities[15];
 	}


	public getFlushScore(): bigint {
		let suit: Card.Suit = -1;
		for (let i = 0; i < this.handSuitCount.length; i++) {
			if (this.handSuitCount[i] == 0) {
				suit = i;
				break;
			}
		}
		if (suit == -1) {
			return 0n;
		}
		return BigInt(this.cardCount + this.cutSuitsCount[suit]);
	}


	public getNobsScore(): bigint {
		let score = 0;
		for (let i = 0; i < this.cutSuitsCount.length; i++) {
			score += this.jackSuitCount[i] * this.cutSuitsCount[i];
		}
		score += this.jackSuitCount[Card.Suit.WILD];
		return BigInt(score);
	}


	public getNibsScore(): bigint {
		return 2n * BigInt(this.cutJackCount);
	}

}