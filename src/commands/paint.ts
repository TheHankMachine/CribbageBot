import { registerOnAddReactionHandler, registerSlashCommand } from "../bot.js";
import { type CacheType, ChatInputCommandInteraction, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js"
import { setUserData } from "../common/db.js";
import { sendLocationReactionMessage } from "../common/reactionMessage.js";
import { Card } from "../common/card/card.js";
import * as Constants from "../constants.js"
import { replyEphemeral } from "../common/ephemeral.js";
import { getDeck } from "../common/player/internal/deck.js";
import { Player } from "../common/player/player.js";
import { ansiWrap } from "../common/impersonate.js";


const PAINTABLE_SUITS = [ Card.Suit.SPADES, Card.Suit.HEARTS, Card.Suit.CLUBS, Card.Suit.DIAMONDS, Card.Suit.WILD ];
const BASE_PRICE = 6;
const WILD_PRICE = 8;


// TODO: clean up
const suitColorPrefixes = ['z', 'r', 'b', 'o', 'p', 'z'];

// TODO: make `:${e}:${Constants.CUSTOM_EMOJI_IDS[e]}` a function. DRY and all that shit
const emojis = PAINTABLE_SUITS.map(suit => suitColorPrefixes[suit] + 'one').map((e) => `:${e}:${Constants.CUSTOM_EMOJI_IDS[e]}`);



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
            [...emojis, Constants.CONFIRMATION_EMOJIES.deny]
        );
    }
);


registerOnAddReactionHandler("paint", async (user, reaction) => {

    if (reaction.emoji.name == Constants.CONFIRMATION_EMOJIES.deny) {
        await reaction.message.delete();
        return;
    }

    const targetPrefix = reaction.emoji?.name?.[0];
    if (!targetPrefix) {
        await reaction.users.remove(user.id);
        return;
    }

    const targetSuit = suitColorPrefixes.indexOf(targetPrefix);
    if (targetSuit == -1) {
        await reaction.users.remove(user.id);
        return;
    }
    
    const deck = await getDeck(user, false);
    const paintable = deck.filter(card => card.suit != targetSuit);
    if (paintable.length == 0) {
        await reaction.users.remove(user.id);
        return;
    }
    
    const price = targetSuit == Card.Suit.WILD? BASE_PRICE : WILD_PRICE;
    
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
