const url = require("url");
const path = require('path');
const { execSync } = require('child_process');
const ws = require("ws");
const websocket = require("websocket-stream");
const dockerStream = require("docker-browser-console");
const express = require("express");
const fileUpload = require("express-fileupload");
const next = require("next");
const { StringDecoder } = require("string_decoder");
const UUID = require('uuid/v4');
const SFTPClient = require('ssh2-sftp-client');



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

      const session = url.parse(req.url, true).query.session;
      const data = JSON.parse(req.body.data);
      const user = data.user;
      let fullPath = data.fullPath;
      if (fullPath.charAt(0) == "~") {
        fullPath = "/home/" + user + fullPath.substring(1);
      }
      const directory = path.dirname(fullPath);

      if (containers[session]) {
        for (let c of containers[session]) {
          const credentials = extractCredentials(c.id);
          if (!credentials.error && credentials.username == user) {
            let sftp = new SFTPClient();
            sftp.connect({
              host: 'ada.gonzaga.edu',
              port: '22',
              username: credentials.username,
              password: credentials.password
            }).then(() => {
              if (Object.size(req.files)) {
                for (let f in req.files) {
                  if (req.files.hasOwnProperty(f)) {
                    sftp.mkdir(directory, true).then(() => {
                      {
                        sftp.put(req.files[f].data, fullPath, false);
                      }
                    });
                  }
                }
              } else {
                sftp.mkdir(directory, true).then(() => {
                  {
                    sftp.put(new Buffer(0), fullPath, false);
                  }
                });
              }
            }).catch(e => {
              console.log(e);
            });

          }
        }
      } else {
        console.log("error");
      }

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

  socket = websocket(s);
  // this will spawn the container and forward the output to the browser
  let container = dockerStream(dockerfile, child => {
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
    socket.send(query.session, error => { });

    timeout = setTimeout(destroy, 1000);
  }, 3600000);

  socket.on("message", function incoming(message) {
    clearTimeout(timeout);
  });
});


function extractCredentials(id) {
  try {
    let username = execSync("docker exec " + id + " bash -c '[ -f username ] && cat username'");
    let password = execSync("docker exec " + id + " bash -c '[ -f password ] && cat password'");
    return {
      username: username.toString("utf8"),
      password: password.toString("utf8")
    }
  } catch (error) {
    return { error };
  }

  return { error: true }
}

Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};