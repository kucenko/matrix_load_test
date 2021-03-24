const isAverageEnable = false;
const requests = [0]
const failedRequests = [0]

function sum(values) {
  return values.reduce((acc, val) => acc + val, 0)
}

setInterval(() => {
  if (requests[0] === 0) {
    return;
  }

  console.log("requests per second:", `${requests[0]}/sec`, "failed:", `${failedRequests[0]}/sec`);

  if (isAverageEnable) {
    const filledRequests = requests.filter((req) => req !== 0)
    const filledRequestsCount = filledRequests.length || 1
    const filledFailedRequests = failedRequests.filter((req) => req !== 0)
    const filledFailedRequestsCount = failedRequests.length || 1

    console.log("average requests:", `${(sum(filledRequests) / filledRequestsCount).toFixed(2)}/sec`, "failed:", `${(sum(filledFailedRequests) / filledFailedRequestsCount).toFixed(2)}/sec`);

    requests.unshift(0);
    failedRequests.unshift(0);
  } else {
    requests[0] = 0;
    failedRequests[0] = 0;
  }
}, 1000);

function rpcMeterInterceptor() {
  return {
    logOptions() {
      requests[0] += 1;
    },
    onResponseError(options, reason) {
      failedRequests[0] += 1;
      return Promise.reject(reason);
    }
  }
}

function addRequest() {
  requests[0] += 1;
}

function addFailedRequest() {
  failedRequests[0] += 1;
}

module.exports = {
  addRequest,
  addFailedRequest
};
