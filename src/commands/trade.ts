import { registerOnAddReactionHandler, registerOnRemoveReactionHandler, registerSlashCommand } from "../bot.js";
import { GuildMember, Message, MessageReaction, SlashCommandBuilder, TextChannel, User } from "discord.js"
import { replyEphemeral } from "../common/ephemeral.js";
import { getNick } from "../common/nick.js";
import { addReactionAndStore, sendImpersonatedReactionMessage, sendReactionMessage } from "../common/reactions/reaction-message.js";
import { getUserData, setUserData } from "../common/db.js";
import { ansiWrap, editImpersonatedMessage, sendImpersonatedMessage } from "../common/impersonate.js";
import { DeckPosition, Direction, getAndMove } from "../common/player/internal/deck-position.js";
import { getDeck } from "../common/player/internal/deck.js";
import { Card } from "../common/card/card.js";
import { ReactionButton } from "../common/reactions/reaction-button.js";
import { Player } from "../common/player/player.js";


type TradeRequest = {
    initiatorId: string,
    targetId: string
}

type TradeData = {
    request: TradeRequest,
    positions: Record<string, DeckPosition>,
    confirmations: Record<string, boolean>
}


registerSlashCommand(
    new SlashCommandBuilder().setName("trade")
        // TODO: change description
        .setDescription(`now you can stop asking for this`)
        .addMentionableOption(option => option.setName('target')
            .setDescription(`the user you want to trade with`)
            .setRequired(true)
        ),
    async (interaction) => {

        const response = await interaction.reply('connecting link cables...');
        response.delete();

        const target = interaction.options.getMember("target")! as GuildMember;

        if (target.user.id == interaction.user.id) {
            await replyEphemeral(interaction, "you may not do this as I assume it will break soemthing");
            return;
        }

        const request = {
            initiatorId: interaction.user.id,
            targetId: target.user.id
        };

        // store for the target so we can access from reaction response
        // otherwise we do not know the initiator
        setUserData<TradeRequest>(target.user.id, "trade-request", request);

        sendReactionMessage(
            target.user,
            "trade-request",
            interaction.channel! as TextChannel,
            `${target.toString()}, ${getNick(interaction.user)} would like to trade with you\ndo you accept?`,
            [
                ReactionButton.Emojis.CONFIRM,
                ReactionButton.Emojis.DENY
            ]
        );
    }
);


function getTradeDisplay(data: TradeData) {
    return Card.Display.renameMeLaterTransmutationDisplay(
        data.positions[data.request.initiatorId].card,
        data.positions[data.request.targetId].card,
        "<->"
    );
}


registerOnAddReactionHandler("trade-request", async (user: User, reaction: MessageReaction) => {

    if (ReactionButton.isDenial(reaction)) {
        await reaction.message.delete();
        return;
    }

    if (ReactionButton.isConfirmation(reaction)) {
        const request = await getUserData<TradeRequest>(user.id, "trade-request", {} as TradeRequest);
        if (!request.targetId) return;

        // const jankyHack = { id: request.initiatorId } as User;
        const initiator = reaction.client.users.resolve(request.initiatorId);
        if (!initiator) return;

        const tradeData: TradeData = {
            request: request,
            positions: {},
            confirmations: {}
        };

        // TODO: name this
        for (const u of [user, initiator]) {
            const deck = await getDeck(u);
            tradeData.positions[u.id] = { card: deck[0], dupeNumber: 0 };
            tradeData.confirmations[u.id] = false;
        };

        setUserData<TradeData>(user.id, "trade", tradeData);
        setUserData<TradeData>(initiator.id, "trade", tradeData);

        const display = getTradeDisplay(tradeData);

        await reaction.message.delete();
        const message = await sendImpersonatedMessage(
            reaction.message.channel as TextChannel,
            ansiWrap(display),
            `${getNick(initiator)} and ${getNick(user)}'s trade`,
            initiator.avatarURL() ?? ""
        );

        addReactionAndStore(initiator, "trade", message, []);
        addReactionAndStore(user, "trade", message, [
            ...Object.values(ReactionButton.Emojis.Directions),
            ReactionButton.Emojis.CONFIRM,
            ReactionButton.Emojis.DENY
        ]);
    }
});


registerOnAddReactionHandler("trade", async (user: User, reaction: MessageReaction) => {

    if (ReactionButton.isDenial(reaction)) {
        await reaction.message.delete();
        return;
    }

    const tradeData = await getUserData<TradeData>(user.id, "trade", {} as TradeData);
    if (!tradeData.request) return;
    const deck = await getDeck(user);
    
    
    if (ReactionButton.isConfirmation(reaction)) {
        tradeData.confirmations[user.id] = true;
        setUserData<TradeData>(tradeData.request.initiatorId, "trade", tradeData);
        setUserData<TradeData>(tradeData.request.targetId, "trade", tradeData);
        
        const confirmations = Object.values(tradeData.confirmations);
        if (confirmations.every(confirmed => confirmed)) {
            // all players confirmed, so do trade

            // there is a race condition here which could cause cards to trade twice
            // this is deemed too unlikely to happen

            // if a player changes a card while it's selected in a trade, the removal will fail
            // and they will gain a card


            // 🤮🤮🤮
            let success = await Player.removeCard({ id: tradeData.request.initiatorId} as User, tradeData.positions[tradeData.request.initiatorId].card);
            if (success) await Player.giveCard({ id: tradeData.request.initiatorId} as User, tradeData.positions[tradeData.request.targetId].card);
            
            success = await Player.removeCard({ id: tradeData.request.targetId} as User, tradeData.positions[tradeData.request.targetId].card);
            if (success) await Player.giveCard({ id: tradeData.request.targetId} as User, tradeData.positions[tradeData.request.initiatorId].card);

            await reaction.message.reactions.removeAll();
      
            await editImpersonatedMessage(
                reaction.message as Message<true>,
                ansiWrap("Traded:\n" + getTradeDisplay(tradeData))
            );
            // await reaction.message.delete();
            // remove callback 
        }

        return;
    }


    const confirmations = Object.values(tradeData.confirmations);
    if (confirmations.some(confirmed => confirmed)) {
        // at least one player has confirmed, thus neither player may change their trade
        await reaction.users.remove(user.id);
        return;
    }

    let direction = ReactionButton.getDirection(reaction);
    if (!direction) return;

    // TODO: remove any
    getAndMove(deck, tradeData.positions[user.id], direction.toLowerCase() as Direction);

    setUserData<TradeData>(tradeData.request.initiatorId, "trade", tradeData);
    setUserData<TradeData>(tradeData.request.targetId, "trade", tradeData);

    await editImpersonatedMessage(
        reaction.message as Message<true>,
        ansiWrap(getTradeDisplay(tradeData))
    );

    await reaction.users.remove(user.id);

    



    // if (reaction.emoji.name == Constants.CONFIRMATION_EMOJIES.confirm) {
    //     const request = await getUserData<TradeRequest>(user.id, "trade-request", {} as TradeRequest);
    //     if (!request.targetId) return;

    //     // const jankyHack = { id: request.initiatorId } as User;
    //     const initiator = reaction.client.users.resolve(request.initiatorId);
    //     if (!initiator) return;

    //     await reaction.message.delete();

    //     const message = await sendImpersonatedMessage(
    //         reaction.message.channel as TextChannel,
    //         "contnet",
    //         `${getNick(initiator)} and ${getNick(user)}'s trade`,
    //         initiator.avatarURL() ?? ""
    //     );

    //     addReactionAndStore(initiator, "trade", message, []);
    //     addReactionAndStore(user, "trade", message, [
    //         Constants.ARROW_EMOJIES.up,
    //         Constants.ARROW_EMOJIES.down,
    //         Constants.ARROW_EMOJIES.left,
    //         Constants.ARROW_EMOJIES.right,
    //         Constants.CONFIRMATION_EMOJIES.deny
    //     ]);
    // }
});



registerOnRemoveReactionHandler("trade", async (user, reaction) => {
    if (ReactionButton.isConfirmation(reaction)) {
        const tradeData = await getUserData<TradeData>(user.id, "trade", {} as TradeData);
        if (!tradeData.request) return;

        tradeData.confirmations[user.id] = false;
        setUserData<TradeData>(tradeData.request.initiatorId, "trade", tradeData);
        setUserData<TradeData>(tradeData.request.targetId, "trade", tradeData);
        return;
    }
});