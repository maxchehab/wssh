const ws = require("ws");
const websocket = require("websocket-stream");
const docker = require("docker-browser-console");
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = dev ? 3000 : 80;

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:" + port);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

let dockerServer = new ws.Server({ port: 8080 });

dockerServer.on("connection", function(socket) {
  socket = websocket(socket);
  // this will spawn the container and forward the output to the browser
  socket.pipe(docker("wssh")).pipe(socket);
});
