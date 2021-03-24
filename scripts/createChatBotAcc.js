const axios = require("axios");
const fs = require("fs");
const { addRequest, addFailedRequest } = require("../utils/rpc_meter");
const constants = require("../constants");

const url = constants.homeserverUrl;
const cbName = constants.chatBotName;

async function registerUser() {
  try {
    const response = await axios.post(
      `${url}/_matrix/client/r0/register`,
      {
        auth: {
          type: "m.login.dummy",
        },
        password: "101010As!",
        username: cbName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      addRequest();
      return response.data;
    }
    addFailedRequest();
    return {};
  } catch (e) {
    addFailedRequest();
  }
}

async function createChatBotAcc() {
  let file = fs.existsSync("./botData.json");
  if (file) {
    return;
  }
  const result = await registerUser();

  return new Promise((resolve) => {
    fs.writeFile("./botData.json", JSON.stringify(result), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Logs File has been created");
      resolve();
    });
  });
}

module.exports = createChatBotAcc;
