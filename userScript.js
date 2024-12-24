// Define a list of words or phrases to look for in messages or actions
const targetWords = ["bowl", "qwerty"];

// Hook into where messages and actions are received
function CustomChatRoomMessageListener(message) {
    if (!message || !message.Content || !message.Type) return;

    // Check if the message or action contains any of the target words
    for (const word of targetWords) {
        if (message.Content.toLowerCase().includes(word.toLowerCase())) {
            // Customize the response based on the message type
            let response;
            if (message.Type === "Chat") {
                response = `You said "${word}". Are you looking for help?`;
            } else if (message.Type === "Action") {
                response = `I noticed your action involved "${word}".`;
            } else {
                response = `Interesting! "${word}" was mentioned in a "${message.Type}" message.`;
            }

            // Send the response message back to the chatroom
            ChatRoomSendLocal(response);
            ChatRoomSendMessage({ Content: response, Type: "Chat" });
            break; // Stop checking after the first match
        }
    }
}

// Attach your custom listener to the existing chat handling
const OriginalChatRoomMessageHandler = ChatRoomMessage;
ChatRoomMessage = function (data) {
    OriginalChatRoomMessageHandler(data); // Call the original handler
    CustomChatRoomMessageListener(data); // Add your custom behavior
};
