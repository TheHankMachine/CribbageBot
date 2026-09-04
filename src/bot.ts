import { Client, Events, GatewayIntentBits, MessageReaction } from "discord.js";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, User } from "discord.js"
import type { ReactionMessageDBType } from "./common/reactionMessage.js"
import { getUserData } from "./common/db.js";
import { cacheNicks, getCommandLineOptions, registerCommands } from "./startup.js"
import { loadNicks } from "./common/nick.js";


export interface SlashCommand {
  command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  callback: (interaction: ChatInputCommandInteraction) => Promise<void>;
}


type ReactionCallback = (
    user: User,
    reaction: MessageReaction
) => void;


let discordClient: Client | null = null;
const slashCommands: Map<string, SlashCommand> = new Map();
const onAddReactionHandlers: Map<string, ReactionCallback> = new Map();
const onRemoveReactionHandlers: Map<string, ReactionCallback> = new Map();


export function registerOnAddReactionHandler(key: string, callback: ReactionCallback) {
    onAddReactionHandlers.set(key, callback);
}


export function registerOnRemoveReactionHandler(key: string, callback: ReactionCallback) {
    onRemoveReactionHandlers.set(key, callback);
}


export function registerSlashCommand(command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder, callback: (interaction: ChatInputCommandInteraction) => Promise<void>) {
    const entry: SlashCommand = {command: command, callback: callback};
    slashCommands.set(command.name, entry);
}


export async function shutdown() {
    await discordClient?.destroy();
}


export async function start() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMembers,
        ],
        // partials: [
        //     Partials.Message,
        //     Partials.Reaction,
        //     // Partials.User,
        // ],
    });
    const options = getCommandLineOptions();

    discordClient = client;

    client.once(Events.ClientReady, async (readyClient) => {
        if (options["startup"] == "FULL") {
            await registerCommands(readyClient, slashCommands);
            await cacheNicks(readyClient);
        } else {
            await loadNicks();
        }

        console.log('[32monline...[0m');
    });


    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        slashCommands.get(interaction.commandName)?.callback(interaction);
    });


    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (user.bot) return;
        const data = await getUserData<ReactionMessageDBType>(user.id, "message", {});        
        for (const [key, callback] of onAddReactionHandlers.entries()) {
            if (data[key] == reaction.message.id) {
                callback(user as User, reaction as MessageReaction);
                return;
            }
        }
    });

    client.on(Events.MessageReactionRemove, async (reaction, user) => {
        if (user.bot) return;
        const data = await getUserData<ReactionMessageDBType>(user.id, "message", {});        
        for (const [key, callback] of onRemoveReactionHandlers.entries()) {
            if (data[key] == reaction.message.id) {
                callback(user as User, reaction as MessageReaction);
                return;
            }
        }
    });

    await client.login(process.env.DISCORD_TOKEN!);
}