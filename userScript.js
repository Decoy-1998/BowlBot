// Listen for messages from the server
ServerSocket.on("ChatRoomMessage", function (data) {
  ChatRoomMessageAdd(data);
});

// Ensure ChatRoomMessageAdditionDict exists
if (typeof ChatRoomMessageAdditionDict === "undefined") {
  ChatRoomMessageAdditionDict = {};
}

// Define a list of trigger messages and their responses
const TriggerMessages = [
  {
    trigger: "Zoey uses a Zoey's Bowl (pet bowl) on her body",
    response: "Zoey, you know you're not allowed to feed yourself! Ask someone else to help you!"
  },
  {
    trigger: "Zoey uses a pet bowl on her body",
    response: "Hey! No cheating by using another bowl!"
  },
  {
    trigger: "asdfgh",
    response: "Shh! Don't tell anyone about the secret word!"
  }
];

// Function to add messages to the chat
function ChatRoomMessageAdd(data) {
  // Make sure the message is valid (needs a Sender and Content)
  if (
    data != null &&
    typeof data === "object" &&
    data.Content != null &&
    typeof data.Content === "string" &&
    data.Content !== "" &&
    data.Sender != null &&
    typeof data.Sender === "number"
  ) {
    // Make sure the sender is in the room
    var SenderCharacter = null;
    for (var C = 0; C < ChatRoomCharacter.length; C++) {
      if (ChatRoomCharacter[C].MemberNumber == data.Sender) {
        SenderCharacter = ChatRoomCharacter[C];
        break;
      }
    }

    // If we found the sender
    if (SenderCharacter != null) {
      // Replace < and > characters to prevent HTML injections
      var msg = data.Content;
      while (msg.indexOf("<") > -1) msg = msg.replace("<", "&lt;");
      while (msg.indexOf(">") > -1) msg = msg.replace(">", "&gt;");

      // This part handles additional custom reactions to the message
      for (var key in ChatRoomMessageAdditionDict) {
        ChatRoomMessageAdditionDict[key](SenderCharacter, msg, data);
      }
    }
  }
}

// Add a custom handler to ChatRoomMessageAdditionDict
ChatRoomMessageAdditionDict["CustomMessageResponder"] = function (SenderCharacter, msg, data) {
  // Iterate through the trigger messages
  for (let i = 0; i < TriggerMessages.length; i++) {
    if (msg.includes(TriggerMessages[i].trigger)) {
      // Send the corresponding response to the chat room
      ServerSend("ChatRoomChat", {
        Content: TriggerMessages[i].response,
        Type: "Chat",
      });
      break; // Stop checking once a match is found
    }
  }
};

