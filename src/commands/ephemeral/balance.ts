import { registerSlashCommand } from '../../bot.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { getBalance } from '../../common/user/balance.js';
import * as Constants from '../../constants.js';


registerSlashCommand(
    new SlashCommandBuilder().setName("balance")
        .setDescription("shows you, and only you, your balance"),
    async (interaction) => {
        const balance = await getBalance(interaction.user)
        await interaction.reply({
            content: `${balance} ${Constants.CURRENCY_NAME}`,
            flags: MessageFlags.Ephemeral
        });        
    }
);