const axios = require("axios");
const fs = require("fs");
const { addRequest, addFailedRequest } = require("../utils/rpc_meter");
const constants = require("../constants");

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
      addRequest();
      return response.data;
    }
    addFailedRequest();
    return {};
  } catch (e) {
    addFailedRequest();
  }
}

async function registerMany(count, start) {
  console.log(`User creation started`);
  const arr = Array.from(new Array(count));
  const startTime = new Date().getTime();

  const result = await Promise.all(arr.map((_, i) => registerUser(i + start)));

  const endTime = new Date().getTime();
  console.log(`User creation time: ${endTime - startTime}ms`);

  return new Promise((resolve) => {
    fs.writeFile("./matrixUsers.json", JSON.stringify(result), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Logs File has been created");
      resolve();
    });
  });
}

module.exports = registerMany;

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

// getToken("testloadbot0001", "testloadbot0001");
