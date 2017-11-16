import React from "react";
import docker from "docker-browser-console";
import websocket from "websocket-stream";

export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: "0", height: "0" };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    // create a stream for any docker image
    // use docker({style:false}) to disable default styling
    // all other options are forwarded to the term.js instance
    let terminal = docker();
    // connect to a docker-browser-console server
    terminal.pipe(websocket("ws://localhost:8080")).pipe(terminal);

    // append the terminal to a DOM element
    terminal.appendTo(this.refs.container);

    let event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
  }

  render() {
    return (
      <div>
        <style global jsx>{`
          .terminal-cursor {
            background-color: white;
          }

          .docker-browser-console {
            font-family: monospace;
            background-color: black;
          }
        `}</style>
        <div
          style={{ height: this.state.height - 48 }}
          className={"docker-browser-console"}
          ref="container"
        />
      </div>
    );
  }
}
