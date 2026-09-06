import { MessageFlags, ChatInputCommandInteraction } from "discord.js";


export async function replyEphemeral(
    interaction: ChatInputCommandInteraction,
    content: string
) {
    await interaction.reply({
        content: content,
        flags: MessageFlags.Ephemeral
    });
}