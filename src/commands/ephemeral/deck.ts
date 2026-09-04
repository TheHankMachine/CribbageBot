import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { registerSlashCommand } from '../../bot.js';
import { getBalance } from '../../common/user/balance.js';
import * as Constants from '../../constants.js';
import { getDeck, getAndSortDeck } from '../../common/user/deck.js';
import { getSmallCardDisplay } from '../../common/card/display.js';
import { asniWrap } from '../../common/impersonate.js';
import { Card, Suit } from '../../common/card/card.js';


registerSlashCommand(
    new SlashCommandBuilder().setName("deck")
        .setDescription("shows you, and only you, your deck"),
    async (interaction) => {
        
        const deck = await getAndSortDeck(interaction.user);  
        const suitBuckets: Card[][] = new Array(Suit.length).fill(null).map(() => []);

        deck.forEach(card => suitBuckets[card.suit].push(card));        

        const content = suitBuckets.map((cards) => getSmallCardDisplay(cards)).join("\n");

        await interaction.reply({
            content: asniWrap(content),
            flags: MessageFlags.Ephemeral
        });        

    }
);
