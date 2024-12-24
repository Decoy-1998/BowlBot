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
                response = `You said a key word. Are you looking for help?`;
            } else if (message.Type === "Action") {
                response = `I noticed your action involved A key word.`;
            } else if (message.Type === "Activity") {
                response = `I noticed your Activity involved A key word.`;
            } else if (message.Type === "Whisper") {
                response = `I noticed your Whisper involved A key word.`;
            } else if (message.Type === "ServerMessage") {
                response = `I noticed your ServerMessage involved A key word.`;
            } else if (message.Type === "Emote") {
                response = `I noticed your Emote involved A key word.`;
            } else if (message.Type === "Hidden") {
                response = `I noticed your Hidden involved A key word.`;
            } else if (message.Type === "Status") {
                response = `I noticed your Status involved A key word.`;
            } else {
                response = `Interesting! A key word was mentioned in a "${message.Type}" message.`;
            }
//Chat
//Activity
//Whisper
//ServerMessage
//Emote
//Hidden
//Status

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
