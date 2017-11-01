const docker = require('docker-browser-console')
const websocket = require('websocket-stream')

// create a stream for any docker image
// use docker({style:false}) to disable default styling
// all other options are forwarded to the term.js instance
let terminal = docker()

// connect to a docker-browser-console server
terminal.pipe(websocket('ws://147.222.165.197:8080')).pipe(terminal)

// append the terminal to a DOM element
terminal.appendTo(document.body)
