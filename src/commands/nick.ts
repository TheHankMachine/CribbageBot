import { registerOnAddReactionHandler, registerSlashCommand } from "../bot.js";
import { type CacheType, ChatInputCommandInteraction, GuildMember, MessageFlags, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js"
import { replyEphemeral } from "../common/ephemeral.js";
import { setNickName } from "../common/nick.js";
import { tryPurchase } from "../common/player/internal/balance.js";
import * as Consants from "../constants.js"


const MAX_NICK_LENGTH = 32;
const RENICK_COST = 10;


registerSlashCommand(
    new SlashCommandBuilder().setName("nick")
        .setDescription(`changes a target's nickname. costs ${Consants.CURRENCY_NAME}`)
        .addMentionableOption(option => option.setName('target')
            .setDescription('the user you want to target')
            .setRequired(true),
        ).addStringOption(option => option.setName('nick')
            .setDescription('the nickname you want to set')
            .setRequired(true),
        ),
    async (interaction) => {
        if (!interaction.guild) {
            await replyEphemeral(interaction, "there was an issue with discord api");
            return;
        }

        const member = interaction.options.getMember("target")! as GuildMember;

        if (!member.manageable) {
            await replyEphemeral(interaction, "member cannot be renamed");
            return;
        }

        const oldNick = member.nickname ?? member.user.globalName ?? member.user.username;
        const nick = interaction.options.getString("nick")!;

        if (nick.trim() == "" || nick.length >= MAX_NICK_LENGTH) {
            await replyEphemeral(interaction, `nickname is invalid`);
            return;
        }

        if (!(await tryPurchase(interaction.user, RENICK_COST))) {
            await replyEphemeral(interaction, `you cannot afford this`);
            return;
        }


        await member.setNickname(nick);
        await setNickName(member.user, nick);

        await interaction.reply(`set ${oldNick}'s nickname to ${nick}`);
    }
);