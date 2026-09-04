import type { User } from "discord.js";
import { getJsonFile, setJsonFile } from "./db.js";


const userIdToNick: Record<string, string> = {};


export function getNick(user: User): string {
    return userIdToNick[user.id];
} 


export async function loadNicks() {
    const nicks = await getJsonFile<Record<string, string>>("nicks", {});
    for (const [id, nick] of Object.entries(nicks)) {
        userIdToNick[id] = nick;
    }
}


export async function setNickName(user: User, nick: string) {
    userIdToNick[user.id] = nick;
    await setJsonFile<Record<string, string>>("nicks", userIdToNick);
}


export async function setNicks(nicks: Record<string, string>) {
    for (const [id, nick] of Object.entries(nicks)) {
        userIdToNick[id] = nick;
    }
    await setJsonFile<Record<string, string>>("nicks", userIdToNick);
}


async function clearNicks() {
    for (var id in userIdToNick) delete userIdToNick[id];
}