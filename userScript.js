// Define the list of words or phrases to detect
const targetWords = ["bowl", "raptor"];

// Define the list of member numbers to listen for
const targetMemberNumbers = [181599, 57941]; // Place these in the global or shared scope

// Register the message handler
ChatRoomRegisterMessageHandler({
    Description: "Warn specific members mentioning restricted words and remove item",
    Priority: 0,
    Callback: (data, sender, msg, metadata) => {
        console.log("Handler triggered", { data, sender, msg, metadata });

        // Debug each key part individually
        if (!msg) console.log("Message object is missing or null:", msg);
        if (!data || !data.Sender) console.log("Data or Sender in Data is missing:", data);
        if (!metadata || !metadata.senderName) console.log("Metadata or senderName is missing:", metadata);

        // Return early if anything is invalid
        if (!msg || !data || !data.Sender || !metadata || !metadata.senderName) {
            console.log("One of the required components is missing or invalid.");
            return;
        }

        // Check if the sender's MemberNumber is in the target list
        if (targetMemberNumbers.includes(data.Sender)) {
            console.log(`Sender ${metadata.senderName} is in the target list.`);

            // Check if the message contains any of the target words
            for (const word of targetWords) {
                if (msg.toLowerCase().includes(word.toLowerCase())) {
                    console.log(`Target word "${word}" found in message.`);
                    
                    // Send the warning response via ChatRoomSendLocal
                    const response = `${metadata.senderName}, you know you're not allowed to feed yourself! Ask someone else to help you!`;
                    ChatRoomSendLocal(response);

                    // Remove the item from the sender's inventory
                    InventoryRemove(sender, "ItemDevices");

                    break; // Stop after the first match
                }
            }
        } else {
            console.log(`Sender ${metadata.senderName} is NOT in the target list.`);
        }
    }
});
