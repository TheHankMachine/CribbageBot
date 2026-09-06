import { registerSlashCommand, shutdown } from '../../bot.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import * as Constants from '../../constants.js';
import { replyEphemeral } from '../../common/ephemeral.js';


const EXIT_CODES: Record<string, number> = {
    restart: 0,
    terminate: 0x48414C54,  // HALT in hexidecimal
    rebuild:   0x4d414b45,  // MAKE in hexicdecimal
    gitpull:   0x50554c4c,  // PULL in hexicdecimal
}


registerSlashCommand(
    new SlashCommandBuilder().setName("shutdown")
        .setDescription("shuts down the bot")
        .addStringOption(option => option.setName('action')
            .setDescription('action')
            .setRequired(true)
            .addChoices(
                { name: 'restart',      value: 'restart' },
                { name: 'terminate',    value: 'terminate' },
                { name: 'rebuild',      value: "rebuild" },
                { name: 'pull changes', value: "gitpull" }
            )
        ),
    async (interaction) => {
        if (interaction.user.id != process.env.ADMIN_USER_ID) {
            await replyEphemeral(interaction, "this is an admin only command");
            return;
        }

        const action = interaction.options.getString('action')!;
        const exitCode = EXIT_CODES[action] ?? 0;

        let response = "shutting down...";
        if (action == "terminate") {
            response = "https://klipy.com/gifs/spy-tf2-30";
        }

        await interaction.reply(response);
        await shutdown();
        process.exit(exitCode);   
    }
);