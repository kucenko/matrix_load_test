const axios = require("axios");
const fs = require("fs");
const constants = require("./constants");

const url = constants.homeserverUrl;

async function registerUser(i) {
  try {
    const response = await axios.post(
      `${url}/_matrix/client/r0/register`,
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
  console.log(`Script started`);
  const arr = Array.from(new Array(count));
  const startTime = new Date().getTime();

  const result = await Promise.all(arr.map((_, i) => registerUser(i + start)));

  const endTime = new Date().getTime();
  console.log(`Script time: ${endTime - startTime}ms`);

  fs.readFile("./matrixUsers.json", (err, data) => {
    if (err) console.log("No file");
    console.log("data", data);
    let prevUserData = data ? JSON.parse(data) : [];
    const newData = prevUserData.concat(result);
    fs.writeFile("./matrixUsers.json", JSON.stringify(newData), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Logs File has been created");
    });
  });
}

const countOfUsers = 2000;
const firstUserIndex = 6000;

registerMany(countOfUsers, firstUserIndex);

// const getToken = async (login, password) => {
//   try {
//     const response = await axios.post(
//       `${url}/_matrix/client/r0/login`,
//       {
//         type: "m.login.password",
//         identifier: {
//           type: "m.id.user",
//           user: login,
//         },
//         password: password,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (response.data && response.data.access_token) {
//       console.log("User Data", response.data);
//       return response.data;
//     }
//     return "";
//   } catch (e) {
//     console.log("Error check auth", e);
//   }
// };

// getToken();
