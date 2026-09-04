import * as Constants from "../constants.js";
import { Card, Suit, Rank, Hand } from "./card/card.js"
import { spreadCardOptions } from "./card/scoring.js";
import { getRankValue, isSuit } from "./card/util.js";


const MIN_RUN_LENGTH = 3;
const RUN_RANK_ORDER = "0A23456789XJQK";


export class Score {
	
	
	private rankCount: Record<Rank, number> = {};
    private sumPossibilities: bigint[];
	
    private handSuitCount: number[] = new Array(Suit.length).fill(0);
	private cutSuitsCount: number[] = new Array(Suit.length).fill(0);
    private jackSuitCount: number[] = new Array(Suit.length).fill(0);
	
	public cardCount: number = 0;
	
	public hand: Hand;
	public cut: Card[];


    constructor(hand: Hand, cut: Card[] = []) {
        this.sumPossibilities = new Array(15 + 1).fill(0n);
        this.sumPossibilities[0] = 1n;

		this.hand = hand.flatMap(card => spreadCardOptions(card))
		this.cut = cut.flatMap(card => spreadCardOptions(card))

		this.hand.forEach(card => this.maintainHandCard(card));
		this.cut.forEach(card => this.maintainCutCard(card));
    }


    private maintainHandCard(card: Card): void {
        this.maintainRankCount(card);
        this.maintainSumPossibilities(card);
        this.maintainHandFlush(card);

		this.cardCount += 1;

        if (card.rank == 'J') {
            this.jackSuitCount[card.suit] += 1;
        }
    }


    private maintainRankCount(card: Card): void {
        this.rankCount[card.rank] = (this.rankCount[card.rank] ?? 0) + 1;
    }


	private maintainCutCard(card: Card): void {
		this.maintainRankCount(card);
		this.maintainSumPossibilities(card);
		this.maintainCutFlush(card);
	}


    private maintainSumPossibilities(card: Card): void {
        const value = getRankValue(card);
        for (let j = 15; j >= value; j--) {
        	this.sumPossibilities[j] += this.sumPossibilities[j - value];
        }
    }


	private maintainHandFlush(card: Card): void {
		for (let i = 0; i < this.handSuitCount.length; i++) {
			// +=+! is cursed
			this.handSuitCount[i] += +!isSuit(card, i);
		}
	}


	private maintainCutFlush(card: Card): void {
		for (let i = 0; i < this.cutSuitsCount.length; i++) {
			this.cutSuitsCount[i] += +isSuit(card, i);
		}
	}


	public getRunScore(): bigint {
		let score: bigint = 0n;
		let numPermutations: bigint = 1n;
		let runLength = 0n;
		for (const rank of RUN_RANK_ORDER) {
			if (!(rank in this.rankCount)) {
				if (runLength >= MIN_RUN_LENGTH) {
					score += runLength * numPermutations;
				}
				numPermutations = 1n;
				runLength = 0n;
			} else {
				numPermutations *= BigInt(this.rankCount[rank]);
				runLength += 1n;
			}
		}
		if (runLength >= MIN_RUN_LENGTH) {
			score += runLength * numPermutations;
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
		let suit: Suit = -1;
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
		score += this.jackSuitCount[Suit.WILD];
		return BigInt(score);
	}


	public get(): bigint {
		let score: bigint = 0n;
		score += this.getPairScore();
		score += this.getRunScore();
		score += this.getFifteensScore();
		score += this.getFlushScore();
		score += this.getNobsScore();
		return score;
  	}

	
	public getExplaination(): [string, bigint] {
		const width = Math.floor(Constants.DisplayConstants.MAX_TERMINAL_WIDTH / 2);

		let result = '';
		let i = 0;

		function add(key: string, value: bigint, force: boolean = false) {
			if (!force && value == 0n) {
				return;
			}

			let s = `${key}: ${value}`;

			if (width - s.length < 0) {
				s += '\n';
			} else {
				s += ' '.repeat(width - s.length);
			}
			result += s;

			if (i % 2 == 1) {
				result += '\n';
			}

			i += 1;
		}

		const fifteens = this.getFifteensScore();
		const pairs = this.getPairScore();
		const runs = this.getRunScore();
		const flush = this.getFlushScore();
		const nobs = this.getNobsScore();

		add('fifteens', fifteens);
		add('pairs', pairs);
		add('runs', runs);
		add('flush', flush);
		add('nobs', nobs);

		const total = fifteens + pairs + runs + flush + nobs;
		result = result.trimEnd();
		add('\ntotal', total, true);

		return [result, total];
	}
}