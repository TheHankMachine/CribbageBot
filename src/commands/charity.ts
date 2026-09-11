import { registerOnAddReactionHandler, registerSlashCommand } from "../bot.js";
import { type CacheType, ChatInputCommandInteraction, GuildMember, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js"
import * as Constants from "../constants.js";
import { Player } from "../common/player/player.js";
import { replyEphemeral } from "../common/ephemeral.js";
import { getNick } from "../common/nick.js";


registerSlashCommand(
    new SlashCommandBuilder().setName("charity")
        .setDescription(`give your ${Constants.CURRENCY_NAME} to someone else`)
        .addMentionableOption(option => option.setName('target')
            .setDescription(`the user you want to give ${Constants.CURRENCY_NAME}`)
            .setRequired(true)
        ).addIntegerOption(option => option.setName('amount')
            .setDescription(`how much ${Constants.CURRENCY_NAME} you want to give`)
            .setRequired(true)
        ),
    async (interaction) => {

        const target = interaction.options.getMember("target")! as GuildMember;
        const amount = interaction.options.getInteger("amount")!

        // if (member.user.id == interaction.user.id)

        if (amount <= 0) {
            await replyEphemeral(interaction, "you may not do this");
            return;
        }

        if (!(await Player.tryPurchase(interaction.user, amount))) {
            await replyEphemeral(interaction, "you cannot afford this");
            return;
        }

        await Player.giveMoney(target.user, amount);
        await interaction.reply(`${getNick(interaction.user)} give ${amount} ${Constants.CURRENCY_NAME} to ${getNick(target.user)}`);

    }
);

registerOnAddReactionHandler("misc", (user: User, reaction: MessageReaction) => {
    // (reaction.message.channel as TextChannel).send("hi");
    console.log(reaction.emoji, reaction.emoji.name);
});
