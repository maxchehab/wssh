import React from "react";
import docker from "docker-browser-console";
import WebSocketStream from "websocket-stream";
import { setTimeout } from "core-js/library/web/timers";

const dev = process.env.NODE_ENV !== "production";
const host = dev ? "localhost" : "adaweb.gonzaga.edu";
const websocketProtocal = dev ? "ws://" : "wss://";

export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: "0"
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight - 48 });
  }

  componentDidMount() {
    this.setState({ height: window.innerHeight - 48 });
    this.updateWindowDimensions();

    window.addEventListener("resize", this.updateWindowDimensions);
    // create a stream for any docker image
    // use docker({style:false}) to disable default styling
    // all other options are forwarded to the term.js instance
    const terminal = docker();

    const pingWS = new WebSocket(websocketProtocal + host + ":8081?session=" + this.props.session)
    pingWS.onmessage = (event) => {
      pingWS.send(event.data);
    }

    const ws = WebSocketStream(websocketProtocal + host + ":8080?session=" + this.props.session);
    ws.socket.addEventListener("error", e => {
      this.componentDidMount();
    });

    ws.socket.addEventListener("onclose", e => {
      this.componentDidMount();
    });

    // connect to a docker-browser-console server
    terminal.pipe(ws).pipe(terminal);

    // append the terminal to a DOM element
    terminal.appendTo(this.refs.container);

    setTimeout(() => {
      let event = document.createEvent("HTMLEvents");
      event.initEvent("resize", true, false);
      window.dispatchEvent(event);
    }, 100);
  }

  render() {
    return (
      <div
        style={{
          height: this.props.currentValue == this.props.value ? "auto" : "0",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            height: this.state.height
          }}
          className={"docker-browser-console"}
          ref={"container"}
        />
      </div>
    );
  }
}
