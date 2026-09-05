import type { User } from 'discord.js';
import { getUserData, setUserData } from '../../db.js';


export async function getLuck(user: User): Promise<number> {
    let luck = await getUserData<number>(user.id, "luck", 0);

// TODO: fix luck
// const guild = await discord.getGuild(Constants.SERVER_ID);
//   const member = await guild?.getMember(userId);
//   if (member && member.roles.includes(Constants.WEALTHY_ROLE_ID)) {
//     luck += 0.5;
//   }
    return luck;
}


export async function addLuck(user: User, delta: number) {
    let luck = await getUserData<number>(user.id, "luck", 0);
    luck += delta;
    await setUserData<number>(user.id, "luck", 0);
}


/**
 * positive luck skews towards smaller numbers
 */
export function rand(luck: number = 0) {
    if (luck >= 0) return Math.pow(Math.random(), luck + 1);
    else return Math.pow(Math.random(), 1 / (1 - luck));
}