const url = require("url");
const path = require("path");
const { execSync } = require("child_process");
const ws = require("ws");
const websocket = require("websocket-stream");
const dockerStream = require("docker-browser-console");
const express = require("express");
const fileUpload = require("express-fileupload");
const next = require("next");
const { StringDecoder } = require("string_decoder");
const UUID = require("uuid/v4");
const SFTPClient = require("ssh2-sftp-client");
const AsyncLock = require("async-lock");

let lock = new AsyncLock();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const dockerfile = "wssh";

let containers = {};
let sftpClients = {};

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
      if (!req.files) {
        console.log("no files");
        return res.status(400).send("No files were uploaded.");
      }
      let status = 200;
      let message = "Success.";
      const session = url.parse(req.url, true).query.session;
      const data = JSON.parse(req.body.data);
      const user = data.user;
      let fullPath = data.fullPath;
      if (fullPath.charAt(0) == "~") {
        fullPath = "/home/" + user + fullPath.substring(1);
      }
      if (containers[session]) {
        for (let c of containers[session]) {
          const credentials = extractCredentials(c.id);
          if (!credentials.error && credentials.username == user) {
            const key = credentials.username + credentials.password;
            lock
              .acquire(key, function(done) {
                console.log("lock has been opened");
                if (sftpClients[key]) {
                  upload(sftpClients[key], req.files, fullPath, done);
                } else {
                  let client = new SFTPClient();
                  client
                    .connect({
                      host: credentials.address,
                      port: "22",
                      username: credentials.username,
                      password: credentials.password
                    })
                    .then(() => {
                      console.log("Created sftp client");
                      setTimeout(() => {
                        lock.acquire(key, function(done) {
                          sftpClients[key]
                            .end()
                            .then(() => {
                              sftpClients[key] = undefined;
                              console.log("successfuly ended sftp client");
                              done();
                            })
                            .catch(() => {
                              sftpClients[key] = undefined;
                              console.log("error ending sftp client");
                              done();
                            });
                        });
                      }, 10000);
                      sftpClients[key] = client;
                      upload(sftpClients[key], req.files, fullPath, done);
                    })
                    .catch(e => {
                      sftpClients[key] = undefined;
                      done();
                    });
                }
              })
              .then((err, ret) => {
                if (err) {
                  status = 500;
                  message = "Internal server error.";
                  console.log(err);
                }
                console.log("lock has been free'd");
              });
          } else {
            console.log("invalid credentials");
            return res.status(400).send("Invalid credentials.");
          }
        }
      } else {
        console.log("session: " + session + " not created.");
        return res.status(400).send("Invalid session.");
      }

      return res.status(status).send(message);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log(
        "> Ready on http://" + dev
          ? "localhost"
          : "adaweb.gonzaga.edu" + ":" + 3000
      );
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
    socket.send(query.session, error => {});

    timeout = setTimeout(destroy, 1000);
  }, 3600000);

  socket.on("message", function incoming(message) {
    clearTimeout(timeout);
  });
});

function extractCredentials(id) {
  try {
    let username = execSync(
      "docker exec " + id + " bash -c '[ -f username ] && cat username'"
    );
    let password = execSync(
      "docker exec " + id + " bash -c '[ -f password ] && cat password'"
    );
    let address = execSync(
      "docker exec " + id + " bash -c '[ -f address ] && cat address'"
    );
    return {
      username: username.toString("utf8"),
      password: password.toString("utf8"),
      address: address.toString("utf8")
    };
  } catch (error) {
    console.log(error);
    return { error };
  }

  return { error: true };
}

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function upload(sftp, files, fullPath, done) {
  console.log("uploading to " + fullPath);
  const directory = path.dirname(fullPath);
  if (Object.size(files)) {
    for (let f in files) {
      if (files.hasOwnProperty(f)) {
        sftp
          .mkdir(directory, true)
          .then(() => {
            sftp.put(files[f].data, fullPath, false).then(() => {
              done();
            });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      }
    }
  } else {
    sftp
      .mkdir(directory, true)
      .then(() => {
        sftp.put(new Buffer(0), fullPath, false).then(() => {
          done();
        });
      })
      .catch(err => {
        console.log(err);
        done();
      });
  }
}
