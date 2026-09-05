import { Message, messageLink, SlashCommandBuilder, TextChannel, User } from "discord.js";
import { registerOnAddReactionHandler, registerSlashCommand } from "../bot.js";
import { Card } from "../common/card/card.js";
import { getUserData, setUserData } from "../common/db.js";
import * as Constants from "../constants.js"
import { getNick } from "../common/nick.js";
import { clearMessage, sendLocationReactionMessage } from "../common/reactionMessage.js";
import { tryPurchase } from "../common/user/balance.js";
import { asniWrap, editImpersonatedMessage } from "../common/impersonate.js";
import { giveCard } from "../common/user/deck.js";


const REROLL_COST = 5;
const N_SHOP_CARDS = 3;

type ShopEntry = { card: Card, cost: bigint };


async function rerollShop(user: User): Promise<ShopEntry[]> {
    const shop: ShopEntry[] = new Array(N_SHOP_CARDS).fill(null).map((_) => {
        const card = Card.generateRandomCard();
        return { card: card, cost: Card.getCardCost(card) };
    });
    await setUserData<ShopEntry[]>(user.id, "shop", shop);
    return shop;
}


async function getShopMessage(user: User, shop: ShopEntry[] | undefined = undefined) {
    if(!shop) { 
        shop = await getUserData<ShopEntry[]>(user.id, "shop", []);
        // failsafe, as a consequence, first shop is always free
        if (shop.length == 0) shop = await rerollShop(user);
    }
    const handDisplay = Card.getLargeHandDisplay(shop.map((entry) => entry.card));
    const description = shop.map(entry => `${Card.getCardDescription(entry.card)} for ${entry.cost} ${Constants.CURRENCY_NAME}`).join("\n");
    return `The Merchant presents:\n${description}\n${handDisplay}\nFancy anything?`;
}


registerSlashCommand(
    new SlashCommandBuilder().setName("shop")
        .setDescription("opens the shop"),
    async (interaction) => {

        const response = await interaction.reply('stocking shelves...');
        response.delete();

        const content = await getShopMessage(interaction.user);

        sendLocationReactionMessage(
            interaction.user, 
            "shop",
            interaction.channel as TextChannel,
            "The Shop",
            content,
            [...Constants.NUMBER_EMOJIES.slice(0, N_SHOP_CARDS), Constants.ARROW_EMOJIES.reroll, Constants.CONFIRMATION_EMOJIES.deny]
        );
    }
);

registerOnAddReactionHandler(
    'shop',
    async (user, reaction) => {
        if (reaction.emoji.name == Constants.ARROW_EMOJIES.reroll) {
            if (await tryPurchase(user, REROLL_COST)) {
                const shop = await rerollShop(user);
                const content = await getShopMessage(user, shop);

                await editImpersonatedMessage(reaction.message as Message, asniWrap(content));
            }
            await reaction.users.remove(user.id);
            return;
        } else if (reaction.emoji.name == Constants.CONFIRMATION_EMOJIES.deny) {
            await reaction.message.delete();
            return;
        }

        if (!reaction.emoji.name) return;

        const shop = await getUserData<ShopEntry[]>(user.id, "shop", []);

        const index = Constants.NUMBER_EMOJIES.indexOf(reaction.emoji.name);
        if (index == -1 || index >= shop.length) {
            return;
        }

        const entry = shop[index];
        if (!(await tryPurchase(user, entry.cost))) {
            // edit('', 'You cannot afford to pay the merchant.');
            await reaction.users.remove(user.id);
            return;
        }

        const content = `The Merchance collects ${entry.cost}\n${Card.getLargeHandDisplay([entry.card])}\nSold!`;
        await editImpersonatedMessage(reaction.message as Message, asniWrap(content));

        clearMessage(user, "shop", reaction.message as Message, true);
        await rerollShop(user);
        await giveCard(user, entry.card);


//     const content = `\`\`\`ansi\n${await getNick(
//       userId
//     )}'s shop:\nThe merchant collects ${item.cost} ${
//       Constants.CURRENCY_NAME
//     } \n${getHandDisplayString([item.card])}\nSold!\`\`\``;

//     await message.edit({ content: content });
//     await rerollShop(userId);
//     clearMessage('shop', userId, message, true);
    }
);
