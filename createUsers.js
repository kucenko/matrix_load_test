const axios = require("axios");

const fs = require("fs");

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

async function registerUser(i) {
  try {
    await delay();
    const response = await axios.post(
      `http://localhost:8008/_matrix/client/r0/register`,
      {
        auth: {
          type: "m.login.dummy",
        },
        password: "101010As!",
        username: `loadtestuser${i}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      return response.data;
    }

    return {};
  } catch (e) {
    console.log("Err", e);
  }
}

async function registerMany(count, start) {
  const arr = Array.from(new Array(count));

  const result = await Promise.all(
    arr.map((element, i) => registerUser(i + start))
  );

  fs.readFile("./matrixUsers.json", (err, data) => {
    if (err) console.log("No file");
    let prewUserData = JSON.parse(data);
    const newData = prewUserData.concat(result);
    fs.writeFile("./matrixUsers.json", JSON.stringify(newData), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Logs File has been created");
    });
  });
}

registerMany(100, 1000);
