import { registerSlashCommand, shutdown } from '../../bot.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { getBalance } from '../../common/user/balance.js';
import * as Constants from '../../constants.js';


registerSlashCommand(
    new SlashCommandBuilder().setName("kill")
        .setDescription("kills the bot")
        .addStringOption(option => option.setName('action')
            .setDescription('kill action')
            .setRequired(true)
            .addChoices(
                // name: What the user sees in Discord UI
                // value: The actual string sent to your bot code
                { name: 'restart', value: 'restart' },
                { name: 'terminate', value: 'terminate' },
            )
        ),
    async (interaction) => {

        if (interaction.user.id != process.env.ADMIN_USER_ID) {
            interaction.reply({
                content: "this is an admin only command",
                flags: MessageFlags.Ephemeral
            });
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