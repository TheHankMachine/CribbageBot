import fs from "node:fs/promises"
import path from "path"
import { Client, REST, Routes, TextChannel } from "discord.js";
import { SlashCommand } from "./bot.js";
import { setNicks } from "./common/nick.js";
import { channel } from "node:diagnostics_channel";
import { ansiWrap } from "./common/impersonate.js";


// this is dumb
const LOGS_DIR = path.join(__dirname, "../logs");


export function getCommandLineOptions(): Record<string, string> {
    const options: Record<string, string> = {};
    const splittingRegex = /--([^=]+)=(.+)$/;
    for (const unparsedOption of process.argv.slice(2)) {
        const split = splittingRegex.exec(unparsedOption.toLowerCase());
        if (!split || split.length < 3) continue;
        options[split[1]] = split[2];
    };
    return options;
}


export async function registerCommands(client: Client<true>, slashCommands: Map<string, SlashCommand>) {
    console.log("registering commands...");
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
    // MapIterator does not have .map :/
    const commandJSON = [...slashCommands].map(([_, slashCommand]) => slashCommand.command.toJSON());
    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.SERVER_ID!), { body: commandJSON });
}


export async function cacheNicks(client: Client<true>) {
    console.log("caching nicks...");
    const nicks: Record<string, string> = {};
    const guild = client.guilds.cache.get(process.env.SERVER_ID!);
    await guild?.members.fetch();
    guild?.members.cache.forEach(member => {nicks[member.id] = member.nickname ?? member.user.globalName ?? member.user.username });
    await setNicks(nicks);
}


export async function sendLogs(client: Client<true>) {
    if (!process.env.LOG_CHANNEL_ID) return;    
    const logChannel = await client.channels.resolve(process.env.LOG_CHANNEL_ID) as TextChannel;
    if (!logChannel) return;
    
    const logNames = await fs.readdir(LOGS_DIR);
    const logPaths = logNames.map(name => path.join(LOGS_DIR, name));
    logPaths.forEach(async (logPath, i) => {
        const log = await fs.readFile(logPath);
        await logChannel.send(`## ${logNames[i]} \n` + ansiWrap(log.toString("utf-8")));
        await fs.rm(logPath);
    });
}