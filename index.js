const registerMany = require("./scripts/createUsers");
const loadTest = require("./scripts/chatBotLoad");
const createChatBotAcc = require("./scripts/createChatBotAcc");
const { spawn } = require("child_process");

const countOfUsers = 1000;
const firstUserIndex = 0;

async function run() {
  await createChatBotAcc();

  const chatBot = spawn("node", ["chatBot.js"]);

  await registerMany(countOfUsers, firstUserIndex);

  await loadTest();

  chatBot.kill();
}

run();
