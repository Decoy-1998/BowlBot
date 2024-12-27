let targetMemberNumbers = loadTargetList() ?? [181599,119023];

ChatRoomRegisterMessageHandler({
    Description: "Warn specific members mentioning restricted words and remove item",
    Priority: 0,
    Callback: (data, sender, msg, metadata) => {
        if (data?.Content !== 'ActionUse') return;
        if (!data?.Dictionary?.some(obj => obj.AssetName === 'PetBowl')) return;
        if (metadata?.SourceCharacter?.MemberNumber !== metadata?.TargetCharacter?.MemberNumber) return;
        if (!targetMemberNumbers.includes(data?.Sender)) return;

          const response = `(${metadata.senderName}, you know you're not allowed to feed yourself! Ask someone else to help you!)`;
          ServerSend("ChatRoomChat", { Content: response, Type: "Chat"} );
        InventoryRemove(sender, "ItemDevices");
        ChatRoomCharacterUpdate(sender);
    }
});

CommandCombine({
    Tag: 'bb-add',
    Description: ": To add member to target list.",
    Action: (args) => {
const parsed = parseInt(args);
if (isNaN(parsed)) return ChatRoomSendLocal('Passed argument is wrong. Try again.');

   targetMemberNumbers.push(parsed);
saveTargetList();
ChatRoomSendLocal(`Successfully added ${parsed} to target list!`);
    }
});

CommandCombine({
Tag: 'bb-remove',
    Description: ": To remove member from target list.",
    Action: (args) => {
const parsed = parseInt(args);
if (isNaN(parsed)) return ChatRoomSendLocal('Passed argument is wrong. Try again.');

   targetMemberNumbers.filter(target => target !== parsed);
saveTargetList();
ChatRoomSendLocal(`Successfully removed ${parsed} from target list!`);
    }
});

CommandCombine({
Tag: 'bb-list',
    Description: ": To show members on the target list",
    Action: () => {
ChatRoomSendLocal(targetMemberNumbers.join(', '));
    }
});

function saveTargetList() {
const stringifiedTargets = JSON.stringify(targetMemberNumbers);
localStorage.setItem('BowlBotTargets', stringifiedTargets);
}

function loadTargetList() {
return JSON.parse(localStorage.getItem('BowlBotTargets'));
}
