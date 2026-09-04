import { TextChannel, Message, User, Webhook } from "discord.js"
import { getNick } from "./nick.js";


export function asniWrap(content: string): string {
    return "```ansi\n" + content + "\n```";
}


export async function sendLocationMessage(user: User, channel: TextChannel, location: string, content: string): Promise<Message> {
    return await sendImpersonatedMessage(
        channel, 
        asniWrap(content), 
        `${getNick(user)} walks into ${location}`,
        user.avatarURL() ?? ""  
    );
}



// I hate that gemini wrote this code
const webhookCache = new Map<string, Webhook>();

export async function getWebhook(channel: TextChannel): Promise<Webhook> {
    const cachedWebhook = webhookCache.get(channel.id);
    if (cachedWebhook) return cachedWebhook;

    const webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(wh => wh.owner?.id === channel.client.user?.id);

    if (!webhook) {
        webhook = await channel.createWebhook({ name: `Webhook ${channel.id}` });
    }

    webhookCache.set(channel.id, webhook);
    return webhook;
}



// TODO: consider leaving a webhook cached
export async function sendImpersonatedMessage(channel: TextChannel, content: string, username: string, avatarURL: string): Promise<Message> {
    const webhook = await getWebhook(channel);
    // webhook = await channel.createWebhook({ name: (Math.random() * 0xffff).toFixed(0) });
    const message = await webhook.send({ content: content, username: username, avatarURL: avatarURL });
    // await webhook.delete();
    return message;
}


export async function editImpersonatedMessage(message: Message, content: string) {
    const webhook = await getWebhook(message.channel as TextChannel);
    await webhook.editMessage(message, content);
}


// export function getUserAvatarURL(user: User) {
//     // return `cdn.discordapp.com/avatars/${user.id}}/${user.ava}`
// }