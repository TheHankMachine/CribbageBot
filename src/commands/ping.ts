import { registerOnAddReactionHandler, registerSlashCommand } from "../bot.js";
import { type CacheType, ChatInputCommandInteraction, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js"
import { sendImpersonatedMessage } from "../common/impersonate.js"
import { setUserData } from "../common/db.js";
import { sendReactionMessage } from "../common/reactionMessage.js";

registerSlashCommand(
    new SlashCommandBuilder().setName("ping")
        .setDescription('responds with pong'),
    async (interaction: ChatInputCommandInteraction) => {

        interaction.reply("pong!");

        
        // await interaction.reply("pinging...");
        // await interaction.deleteReply();

        // sendReactionMessage(
        //     interaction.user,
        //     "misc",
        //     interaction.channel! as TextChannel,
        //     "chose an option: ",
        //     ["🟩"]
        // );

        // const channel = interaction.channel as TextChannel;

        // sendImpersonatedMessage(channel, "hi", "The Painter", "https://cdn.britannica.com/03/193803-050-CBC590FA/Bob-Ross.jpg");
    }
);

registerOnAddReactionHandler("misc", (user: User, reaction: MessageReaction) => {
    // (reaction.message.channel as TextChannel).send("hi");
    console.log(reaction.emoji, reaction.emoji.name);
});
