import type { User } from "discord.js";
import { getUserData, setUserData } from "../../db.js";


export async function getBalance(user: User): Promise<bigint> {
    return await getUserData<bigint>(user.id, "balance", 0n)
}


export async function giveMoney(user: User, amount: bigint | number): Promise<bigint> {
    if (typeof amount === "number") amount = BigInt(amount);
    let balance = await getBalance(user);
    balance += amount;
    setUserData<bigint>(user.id, "balance", balance);
    return amount;
}


/**
 * note: remember to await this.
 */
export async function tryPurchase(user: User, cost: bigint | number): Promise<boolean> {
    if (typeof cost === "number") cost = BigInt(cost);
    let balance = await getBalance(user);
    if (balance < cost) return false;
    balance -= cost;
    setUserData<bigint>(user.id, "balance", balance);
    return true;
}