import { Message, MessageFlags, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js";
import { registerOnAddReactionHandler, registerOnRemoveReactionHandler, registerSlashCommand } from "../bot.js";
import { getUserData, setUserData } from "../common/db.js";
import { Card } from "../common/card/card.js";
import { clearMessage, sendImpersonatedReactionMessage, sendLocationReactionMessage } from "../common/reactionMessage.js";
import { Score } from "../common/score.js";
import * as Constants from "../constants.js";
import { Player } from "../common/player/player.js"
import { sendImpersonatedMessage, sendLocationMessage } from "../common/impersonate.js";


// function dealRigged(
//   deck: Card[],
//   luck: number = 0,
//   noptions: number = 2,
//   nfixed: number = 3
// ): Card[] {
//   function getScore(cards: Card[]): number {
//     const score = new Score();
//     // console.log(cards);
//     cards.forEach((e) => score.addCard(new Card(e.rank, e.suit)));
//     return Number(score.get());
//   }

//   const ndynamic = Constants.HAND_SIZE + 1 - nfixed;
//   // const hand: Card[] = deck.splice(0, nfixed);
//   const hand: Card[] = [];

//   hand.push(...deck.splice(0, nfixed));

//   for (let i = 0; i < ndynamic; i++) {
//     const options = deck
//       .splice(0, noptions)
//       .map((e): [Card, number] => [e, getScore([e, ...hand])])
//       .sort((a, b) => b[1] - a[1])
//       .map((e) => e[0]);

//     hand.push(options.splice(Math.floor(rand(luck) * options.length), 1)[0]);
//     deck.push(...options);
//   }

//   shuffle(hand);

//   return hand;
// }


const INDEX_TO_WORDS: string[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];


registerSlashCommand(
    new SlashCommandBuilder().setName("cribbage")
        .setDescription("daily cribbage gamble"),
    async (interaction) => {

        const today = Constants.today();
        const lastPlayed = await getUserData<string>(interaction.user.id, "date", "");

        if (
            today == lastPlayed 
            // && interaction.user.id != Constants.SERVER_OWNER_ID
            && false
        ) {
            interaction.reply({ 
                content: "you've already played today\ncome back tomorrow",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        await setUserData<string>(interaction.user.id, "date", today);

        const response = await interaction.reply('shuffling cards');
        response.delete();

        const deck = await Player.getDeck(interaction.user, true);
        let hand = deck.slice(0, Constants.HAND_SIZE + 1);

        // hand = dealRigged(deck, await getLuck(interaction.member.user.id), 3, 4);

        const suitColorPrefixes = ['z', 'r', 'b', 'o', 'p', 'z'];
        const indexToWords = ['one', 'two', 'three', 'four', 'five', 'six'];
        const emojis = hand.slice(0, Constants.HAND_SIZE).map((e, i) => suitColorPrefixes[e.suit] + indexToWords[i]).map((e) => `:${e}:${Constants.CUSTOM_EMOJI_IDS[e]}`);

        await setUserData<Card[]>(interaction.user.id, "deal", hand);
        await setUserData<number[]>(interaction.user.id, "discard", []);

        await sendLocationReactionMessage(
            interaction.user,
            "cribbage",
            interaction.channel! as TextChannel,
            "The Casino",
            "The Dealer deals you:\n" + Card.getLargeHandDisplay(hand.slice(0, Constants.HAND_SIZE)),
            emojis,
        );
  }
);


// this callback is ugly as fuck
registerOnAddReactionHandler(
    'cribbage',
    async (user: User, reaction: MessageReaction) => {
        const discardSelection = await getUserData<number[]>(user.id, "discard", []);
        const emojiNumber = reaction.emoji?.name?.slice(1);
        if (!emojiNumber) return;

        const discardIndex = INDEX_TO_WORDS.indexOf(emojiNumber);
        if (discardIndex == -1 || discardIndex >= Constants.HAND_SIZE || discardSelection.includes(discardIndex)) return;

        discardSelection.push(discardIndex);

        await setUserData<number[]>(user.id, "discard", discardSelection);

        if (discardSelection.length < Constants.DISCARD_COUNT) return;

        const cards = await getUserData<Card[]>(user.id, "deal", []);

        const cut = cards.splice(-1, 1)[0]; // last dealt card is cut. remove it
        const hand = cards.filter((_, i) => !discardSelection.includes(i));
        // const discard = cards.filter((_, i) => !discardSelection.includes(i));

        const score = new Score(hand, [cut]);

        
        const [explaination, scoreTotal] = score.getExplaination();
        
        clearMessage(user, 'cribbage', reaction.message as Message, false);
        
        await Player.giveMoney(user, scoreTotal);
        // await reportIncome(userId, Number(scoreTotal));
        // await updateStats(userId, Number(scoreTotal));

        await sendLocationMessage(
            user,
            reaction.message.channel as TextChannel,
            "The Casino",
            `You score\n${Card.getLargeHandDisplay(score.hand, score.cut)}\n${explaination}`,
        );
  }
);


registerOnRemoveReactionHandler(
    'cribbage',
    async (user: User, reaction: MessageReaction) => {

        const discardSelection = await getUserData<number[]>(user.id, "discard", []);

        const emojiNumber = reaction.emoji?.name?.slice(1);
        if (!emojiNumber) return;

        const discardIndex = INDEX_TO_WORDS.indexOf(emojiNumber);

        if (discardIndex == -1 || discardIndex >= Constants.HAND_SIZE || !discardSelection.includes(discardIndex)) return;

        const selectionIndex = discardSelection.indexOf(discardIndex);
        
        discardSelection.splice(selectionIndex, 1);

        await setUserData<number[]>(user.id, "discard", discardSelection);
    }
);