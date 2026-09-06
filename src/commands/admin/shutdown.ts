import { registerSlashCommand, shutdown } from '../../bot.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import * as Constants from '../../constants.js';
import { replyEphemeral } from '../../common/ephemeral.js';


registerSlashCommand(
    new SlashCommandBuilder().setName("shutdown")
        .setDescription("shuts down the bot")
        .addStringOption(option => option.setName('action')
            .setDescription('action')
            .setRequired(true)
            .addChoices(
                { name: 'restart', value: 'restart' },
                { name: 'terminate', value: 'terminate' },
            )
        ),
    async (interaction) => {
        if (interaction.user.id != process.env.ADMIN_USER_ID) {
            await replyEphemeral(interaction, "this is an admin only command");
            return;
        }

        const action = interaction.options.getString('action');
        if (action == "restart") {
            await interaction.reply("restarting...");
            await shutdown();
            process.exit(0);
        }
        
        if (action == "terminate") {
            let content = "terminating...";
            if (Math.random() < 1) {
                content = "https://klipy.com/gifs/spy-tf2-30"
            }
            await interaction.reply(content);
            await shutdown();
            process.exit(Constants.HALT_CODE);
        }
        
    }
);