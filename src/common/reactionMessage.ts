import type { User, TextChannel, Message } from "discord.js"
import { getUserData, setUserData } from "./db.js";
import { sendImpersonatedMessage, sendLocationMessage } from "./impersonate.js";


export type ReactionMessageDBType = {[key: string]: string};


// TODO: this shit needs to be renamed BADLY
async function addReactionAndStore(
    user: User, 
    key: string, 
    message: Message, 
    reactions: string[]
): Promise<Message> {
    const data = await getUserData<ReactionMessageDBType>(user.id, "message", {});
    data[key] = message.id;
    await setUserData<ReactionMessageDBType>(user.id, "message", data);
    reactions.forEach(reaction => message.react(reaction));
    return message;
}


export async function clearMessage(
    user: User, 
    key: string, 
    message: Message, 
    clearReactions: boolean = true
) {
    const data = await getUserData<ReactionMessageDBType>(user.id, "message", {});
    delete data[key];
    await setUserData<ReactionMessageDBType>(user.id, "message", data);
    if (clearReactions) await message.reactions.removeAll();
}


export async function sendReactionMessage(
    user: User,
    key: string,
    textChannel: TextChannel,
    content: string,
    reactions: string[]
): Promise<Message> {
    return await addReactionAndStore(user, key, await textChannel.send(content), reactions);
}


export async function sendImpersonatedReactionMessage(
    user: User,
    key: string,
    textChannel: TextChannel,
    content: string,
    username: string, 
    avatarURL: string,
    reactions: string[]
): Promise<Message> {
    return await addReactionAndStore(user, key, await sendImpersonatedMessage(textChannel, content, username, avatarURL), reactions);
}


export async function sendLocationReactionMessage(
    user: User,
    key: string,
    textChannel: TextChannel,
    location: string,
    content: string,
    reactions: string[]
) {
    await addReactionAndStore(user, key, await sendLocationMessage(user, textChannel, location, content), reactions);
}