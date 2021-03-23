const MatrixClient = require("matrix-bot-sdk").MatrixClient;
const SimpleFsStorageProvider = require("matrix-bot-sdk")
  .SimpleFsStorageProvider;
const AutojoinRoomsMixin = require("matrix-bot-sdk").AutojoinRoomsMixin;
const RichReply = require("matrix-bot-sdk").RichReply;

const constants = require("./constants");
const homeserverUrl = constants.homeserverUrl;
const accessToken = constants.botToken;

// We'll want to make sure the bot doesn't have to do an initial sync every
// time it restarts, so we need to prepare a storage provider. Here we use
// a simple JSON database.
const storage = new SimpleFsStorageProvider("hello-bot.json");

// Now we can create the client and set it up to automatically join rooms.
const client = new MatrixClient(homeserverUrl, accessToken, storage);

AutojoinRoomsMixin.setupOnClient(client);

// We also want to make sure we can receive events - this is where we will
// handle our command.
client.on("room.message", handleCommand);

// Now that the client is all set up and the event handler is registered, start the
// client up. This will start it syncing.
client.start().then(() => console.log("Client started!"));

// This is our event handler for dealing with the `!hello` command.
async function handleCommand(roomId, event) {
  try {
    // Don't handle events that don't have contents (they were probably redacted)
    if (!event["content"]) return;

    // Don't handle non-text events
    if (event["content"]["msgtype"] !== "m.text") return;

    // We never send `m.text` messages so this isn't required, however this is
    // how you would filter out events sent by the bot itself.
    if (event["sender"] === (await client.getUserId())) return;

    // Make sure that the event looks like a command we're expecting
    const body = event["content"]["body"];
    if (!body || !body.startsWith("!hello")) return;

    console.log('event["content"]["body"]', event["content"]["body"]);

    // If we've reached this point, we can safely execute the command. We'll
    // send a reply to the user's command saying "Hello World!".
    const replyBody = "Hello World!"; // we don't have any special styling to do.
    const reply = RichReply.createFor(roomId, event, replyBody, replyBody);

    reply["msgtype"] = "m.notice";

    await client.sendMessage(roomId, reply);
  } catch (error) {
    console.log("!!!error", error);
  }
}
