import fs from "node:fs/promises"
import path from "path"


// this is dumb
const DB_PATH = path.join(__dirname, "../db");


// bigint serialization from https://stackoverflow.com/questions/65152373/serialize-bigint-in-json
function bigIntReplacer(key: string, value: any): any {
    if (typeof value === "bigint") return value.toString() + 'n';
    return value;
}


function bigIntReviver(key: string, value: any): any {
    if (typeof value === 'string' && /^\d+n$/.test(value)) return BigInt(value.slice(0, -1));
    return value;
}


// jankier hack
async function exists(filePath: string) {
    return fs.access(filePath).then(() => true).catch(() => false);
}


export async function setJsonFile<T>(fileNameNoExtension: string, value: T) {
    const tempPath = path.join(DB_PATH, `${fileNameNoExtension}-temp.json`);
    const finalPath = path.join(DB_PATH, `${fileNameNoExtension}.json`);
    await fs.writeFile(tempPath, Buffer.from(JSON.stringify(value, bigIntReplacer, 2)));
    await fs.rename(tempPath, finalPath);
}


export async function getJsonFile<T>(fileNameNoExtension: string, defaultValue: T): Promise<T> {
    const filePath = path.join(DB_PATH, `${fileNameNoExtension}.json`);
    if (!(await exists(filePath))) return defaultValue;
    const data = await fs.readFile(filePath);
    return JSON.parse(data.toString('utf8'), bigIntReviver) as T;
}


export async function setUserData<T>(userId: string, key: string, value: T) {
    await setJsonFile<T>(`${userId}-${key}`, value);
}


export async function getUserData<T>(userId: string, key: string, defaultValue: T): Promise<T>  {
    return await getJsonFile<T>(`${userId}-${key}`, defaultValue);
}