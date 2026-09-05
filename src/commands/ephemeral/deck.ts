import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { registerSlashCommand } from '../../bot.js';
import { asniWrap } from '../../common/impersonate.js';
import { Card, Suit } from '../../common/card/card.js';
import { Player } from '../../common/player/player.js';


registerSlashCommand(
    new SlashCommandBuilder().setName("deck")
        .setDescription("shows you, and only you, your deck"),
    async (interaction) => {
        
        const deck = await Player.getAndSortDeck(interaction.user);  
        const suitBuckets: Card[][] = new Array(Suit.length).fill(null).map(() => []);

        deck.forEach(card => suitBuckets[card.suit].push(card));        

        const content = suitBuckets.map((cards) => Card.getSmallCardDisplay(cards)).join("\n");

        await interaction.reply({
            content: asniWrap(content),
            flags: MessageFlags.Ephemeral
        });        

    }
);
