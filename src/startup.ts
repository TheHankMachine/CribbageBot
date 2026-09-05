import { Client, REST, Routes } from "discord.js";
import { SlashCommand } from "./bot.js";
import { setNicks } from "./common/nick.js";


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
    console.log("registering commands");
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
    // MapIterator does not have .map :/
    const commandJSON = [...slashCommands].map(([_, slashCommand]) => slashCommand.command.toJSON());
    await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.SERVER_ID!), { body: commandJSON });
}


export async function cacheNicks(client: Client<true>) {
    console.log("caching nicks");
    const nicks: Record<string, string> = {};
    const guild = client.guilds.cache.get(process.env.SERVER_ID!);
    await guild?.members.fetch();
    guild?.members.cache.forEach(member => {nicks[member.id] = member.nickname ?? member.user.globalName ?? member.user.username });
    await setNicks(nicks);
}