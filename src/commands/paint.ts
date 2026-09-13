import { registerOnAddReactionHandler, registerSlashCommand } from "../bot.js";
import { type CacheType, ChatInputCommandInteraction, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js"
import { sendLocationReactionMessage } from "../common/reactions/reaction-message.js";
import { Card } from "../common/card/card.js";
import * as Constants from "../constants.js"
import { replyEphemeral } from "../common/ephemeral.js";
import { getDeck } from "../common/player/internal/deck.js";
import { Player } from "../common/player/player.js";
import { ansiWrap } from "../common/impersonate.js";
import { ReactionButton } from "../common/reactions/reaction-button.js";


const PAINTABLE_SUITS = [ Card.Suit.SPADES, Card.Suit.HEARTS, Card.Suit.CLUBS, Card.Suit.DIAMONDS, Card.Suit.WILD ];
const BASE_PRICE = 6;
const WILD_PRICE = 8;


const suitPrice = (suit: Card.Suit) => suit == Card.Suit.WILD ? WILD_PRICE : BASE_PRICE;

// const emojis = PAINTABLE_SUITS.map(suit => suitColorPrefixes[suit] + 'one').map((e) => `:${e}:${Emojis.CUSTOM_NAME_TO_ID[e]}`);
const emojis = PAINTABLE_SUITS.map(suit => ReactionButton.getEmojiFromNumber(Math.floor(suitPrice(suit)), suit)!);



registerSlashCommand(
    new SlashCommandBuilder().setName("apint")
        .setDescription(`like paint, but spelled wrong`),
    async (interaction) => {
        await replyEphemeral(interaction, "🍺");
  } 
);


registerSlashCommand(
    new SlashCommandBuilder().setName("paint")
        .setDescription('paint your deck'),
    async (interaction) => {

        const response = await interaction.reply("climbing stairs...");
        response.delete();
        
        sendLocationReactionMessage(
            interaction.user, 
            "paint",
            interaction.channel as TextChannel,
            "The Attic",
            `The Painter offers to paint one of your cards\ncosts 6 ${Constants.CURRENCY_NAME}, wild costs 8${Constants.CURRENCY_NAME}`,
            [...emojis, ReactionButton.Emojis.DENY]
        );
    }
);


registerOnAddReactionHandler("paint", async (user, reaction) => {

    if (ReactionButton.isDenial(reaction)) {
        await reaction.message.delete();
        return;
    }

    const targetSuit = ReactionButton.getSuit(reaction);
    if (!targetSuit) {
        await reaction.users.remove(user.id);
        return;
    }
    
    const deck = await getDeck(user, false);
    const paintable = deck.filter(card => card.suit != targetSuit);
    if (paintable.length == 0) {
        await reaction.users.remove(user.id);
        return;
    }
    
    const price = suitPrice(targetSuit);
    
    if (!(await Player.tryPurchase(user, price))) {
        await reaction.users.remove(user.id);
        return;
    }

    const card = paintable[Math.floor(Math.random() * paintable.length)];

    const originalCopy = { ...card };

    card.suit = targetSuit;

    await Player.setDeck(user, deck);

    const channel = reaction.message.channel as TextChannel;
    await channel.send(ansiWrap(Card.renameMeLaterTransmutationDisplay(originalCopy, card)));
    await reaction.users.remove(user.id);
});
