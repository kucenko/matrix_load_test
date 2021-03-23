const sdk = require("matrix-js-sdk");
const fs = require("fs");

const url = "http://localhost:8008";
const chatBotId = "@testbot0001:myserver.invalid";

async function createClient(accessToken) {
  try {
    const client = sdk.createClient({
      baseUrl: url,
      accessToken: accessToken,
    });

    return client;
  } catch (e) {
    console.log("Create Client error", e);
  }
}

async function createBotRoom(client) {
  try {
    const room = await client.createRoom({
      visibility: "private",
      invite: [chatBotId],
      name: "testroommega",
    });

    return room.room_id;
  } catch (e) {
    console.log("createBotRoom error", e);
  }
}

function req(client, testRoomId, text) {
  return new Promise((resolve) => {
    client.sendEvent(
      testRoomId,
      "m.room.message",
      {
        body: text,
        msgtype: "m.text",
      },
      ""
    );
    setTimeout(resolve, 500);
  });
}

function batchFetch(message, maxLimit, client, roomId) {
  return new Promise((resolve) => {
    var documents = [];
    var index = 0;
    function recursiveFetch() {
      if (index > message) {
        return;
      }
      index += 1;
      req(client, roomId, `!hello Hello World ${index}`).then(
        recursiveFetch,
        (error) => {
          console.log("Too many requests");
          recursiveFetch();
        }
      );
    }
    for (var i = 0; i < maxLimit; i++) {
      recursiveFetch();
    }
  });
}

async function createBotRoomAndSendMsg(client, index) {
  try {
    const roomId = await createBotRoom(client);

    return await req(client, roomId, `!hello Hello World ${index}`);
  } catch (e) {
    console.log("createBotRoomAndSendMsg error", e);
  }
}

const loadTest = async () => {
  try {
    console.log(`Script started`);
    let file = fs.readFileSync("./matrixUsers.json", "utf8");
    const users = [...JSON.parse(file)]

    const startTime = new Date().getTime();

    console.log("Start creating clients");
    const clientsArr = await Promise.all(
      users.map((element) => createClient(element.access_token))
    );
    console.log("Stop creating clients");
    users.forEach((el, index) => (el.client = clientsArr[index]));

    await Promise.allSettled(
      users.map((element, index) =>
        createBotRoomAndSendMsg(element.client, index)
      )
    );

    const endTime = new Date().getTime();
    console.log(`Script time: ${endTime - startTime}ms`);
  } catch (e) {
    console.log("loadTest", e);
  }
};

loadTest();
