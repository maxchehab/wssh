const url = require("url");
const ws = require("ws");
const websocket = require("websocket-stream");
const docker = require("docker-browser-console");
const express = require("express");
const fileUpload = require("express-fileupload");
const next = require("next");
const { StringDecoder } = require("string_decoder");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const host = dev ? "localhost" : "adaweb.gonzaga.edu";
const dockerfile = "wssh";

let containers = {};

const echoPort = dev ? 8081 : 8083;
const dockerPort = dev ? 8080 : 8082;
app
  .prepare()
  .then(() => {
    const server = express();
    server.use(fileUpload());
    server.get("*", (req, res) => {
      return app.render(req, res, "/index");
    });

    server.post("/upload", (req, res) => {
      if (!req.files) return res.status(400).send("No files were uploaded.");
      console.log(req.files);
      res.status(200).send("success");
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://" + host + ":" + 3000);
    });
  })
  .catch(ex => {
    process.exit(1);
  });

let dockerServer = new ws.Server({ port: dockerPort });
dockerServer.on("connection", (s, request) => {
  let query = url.parse(request.url, true).query;
  let input = "";
  s.on("message", message => {
    // const decoder = new StringDecoder("utf8");
    // const buffer = Buffer.from(message);
    // const data = JSON.parse(decoder.write(buffer)).data;
    // if (data && (input += data)) console.log(input);
  });
  socket = websocket(s);
  // this will spawn the container and forward the output to the browser
  let container = docker(dockerfile, child => {
    container.id = child.id;
    if (!containers[query.session]) containers[query.session] = [];
    containers[query.session].push(container);
  });

  socket.pipe(container).pipe(socket);
});

let echoServer = new ws.Server({ port: echoPort });
echoServer.on("connection", (socket, request) => {
  let query = url.parse(request.url, true).query;

  let timeout = null;

  let destroy = () => {
    clearInterval(interval);
    console.log(query.session + " has left");
    if (containers[query.session]) {
      for (let c of containers[query.session]) {
        c.destroy();
      }
    }
  };

  let interval = setInterval(() => {
    socket.send(query.session, error => {});

    timeout = setTimeout(destroy, 1000);
  }, 3600000);

  socket.on("message", function incoming(message) {
    clearTimeout(timeout);
  });
});
