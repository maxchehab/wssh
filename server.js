const url = require('url');
const ws = require("ws");
const websocket = require("websocket-stream");
const docker = require("docker-browser-console");
const express = require("express");
const next = require("next");


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = dev ? 3000 : 3000; // TODO use port 80 for production
const host = dev ? "localhost" : "147.222.165.6";
const dockerfile = dev ? "wssh-dev" : "wssh";

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log("> Ready on http://" + host + ":" + port);
    });
  })
  .catch(ex => {
    process.exit(1);
  });


let containers = {};
let dockerServer = new ws.Server({ port: 8080 });
dockerServer.on("connection", (socket, request) => {
  let query = url.parse(request.url, true).query;
  socket = websocket(socket);
  // this will spawn the container and forward the output to the browser
  let container = docker(dockerfile);
  if (!containers[query.session]) containers[query.session] = [];
  containers[query.session].push(container);
  socket.pipe(container).pipe(socket);
});

let echoServer = new ws.Server({ port: 8081 });
echoServer.on("connection", (socket, request) => {
  let query = url.parse(request.url, true).query;

  let timeout = null;

  let destroy = () => {
    clearInterval(interval);
    console.log(query.session + " has left");
    for (let c of containers[query.session]) {
      c.destroy();
    }
  }

  let interval = setInterval(() => {
    socket.send(query.session, (error) => { })

    timeout = setTimeout(destroy, 1000);
  }, 5000);

  socket.on('message', function incoming(message) {
    clearTimeout(timeout);
  });

});
