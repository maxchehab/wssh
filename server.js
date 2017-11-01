const ws = require('ws')
const websocket = require('websocket-stream')
const docker = require('docker-browser-console')
const path = require('path')
const http = require('http')
const fs = require('fs')

let dockerServer = new ws.Server({port:8080})

dockerServer.on('connection', function(socket) {
  socket = websocket(socket)
  // this will spawn the container and forward the output to the browser
  socket.pipe(docker('ubuntu')).pipe(socket)
});

let webServer = http.createServer();

webServer.on('request', function(req, res) {
  fs.createReadStream(path.join(__dirname, req.url === '/bundle.js' ? 'dist/bundle.js' : 'dist/index.html')).pipe(res)
})

webServer.on('listening', function() {
  console.log('> Listening at http://localhost:'+webServer.address().port);
})

webServer.listen(3000)



