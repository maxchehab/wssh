import React from "react";
import docker from "docker-browser-console";
import WebSocketStream from "websocket-stream";
import { setTimeout } from "core-js/library/web/timers";
import { homedir } from "os";
import UUID from "uuid/v4";
import { toast } from "react-toastify";
import { ToastFileError, ToastFileInfo, ToastFileSuccess } from "./Toasts";

const dev = process.env.NODE_ENV !== "production";
const host = dev ? "localhost" : "adaweb.gonzaga.edu";
const websocketProtocal = dev ? "ws://" : "wss://";
const fileUploadQueue = [];

export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: "0",
      cwd: "~",
      user: "",
      address: "",
      fileHover: false
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight - 48 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.cwd != this.state.cwd ||
      prevState.user != this.state.user ||
      prevState.address != this.state.address
    ) {
      this.props.changeHeader(
        this.props.value,
        this.state.user + "@" + this.state.address + ": " + this.state.cwd
      );
    }
  }

  componentDidMount() {
    window.files = () => {
      return fileUploadQueue;
    };
    this.setState({ height: window.innerHeight - 48 });
    this.updateWindowDimensions();

    window.addEventListener("resize", this.updateWindowDimensions);
    // create a stream for any docker image

    // use docker({style:false}) to disable default styling
    // all other options are forwarded to the term.js instance
    const terminal = docker();

    const pingWS = new WebSocket(
      websocketProtocal + host + ":8081?session=" + this.props.session
    );
    pingWS.onmessage = event => {
      pingWS.send(event.data);
    };

    const ws = WebSocketStream(
      websocketProtocal + host + ":8080?session=" + this.props.session
    );
    ws.socket.addEventListener("error", e => {
      this.componentDidMount();
    });

    ws.socket.addEventListener("onclose", e => {
      this.componentDidMount();
    });

    ws.socket.addEventListener("message", e => {
      const decoder = new TextDecoder();
      const decoded = decoder.decode(e.data);
      const pathRegex = new RegExp("@(.*): (.*)\\\\u0007\\\\u001b\\[01;32m");
      const userRegex = new RegExp("\\\\u001b]0;(.*)@(.*): ");
      const path = pathRegex.exec(decoded);
      const user = userRegex.exec(decoded);

      path ? this.setState({ cwd: path[2] }) : false;
      user ? this.setState({ user: user[1] }) : false;
      user ? this.setState({ address: user[2] }) : false;
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

    let that = this;
    new Dropzone(this.refs.container, {
      url: "/upload?session=" + that.props.session,
      uploadMultiple: false,
      createImageThumbnails: false,
      previewTemplate: '<div style="display:none"></div>',

      init: function() {
        this.on("addedfile", file => {
          let time = new Date().getTime();

          let index = that.fileUploadQueueContains(time);
          let fileID = UUID();
          file["fileID"] = fileID;
          file["fileUploadQueueIndex"] =
            index >= 0 ? index : fileUploadQueue.length;
          if (index >= 0) {
            fileUploadQueue[index].files.push(fileID);
            fileUploadQueue[index].time = time;
            console.log(fileUploadQueue[index].toastID);
            setTimeout(() => {
              toast.update(fileUploadQueue[index].toastID, {
                render: (
                  <ToastFileInfo
                    count={fileUploadQueue[index].files.length}
                    path={that.state.cwd}
                  />
                )
              });
            }, 0);
          } else {
            fileUploadQueue.push({
              time: time,
              files: [fileID],
              completed: 0,
              successful: [],
              failed: [],
              toastID: toast.info(
                <ToastFileInfo count={1} path={that.state.cwd} />,
                {
                  bodyClassName: "info-notify"
                }
              ),
              progress: function() {
                return this.completed / this.files.length * 100;
              }
            });
          }
        });
        this.on("dragenter", event => {
          that.setState({ fileHover: true });
        });
        this.on("dragleave", event => {
          that.setState({ fileHover: false });
        });
        this.on("sending", (file, xhr, formData) => {
          formData.append(
            "data",
            JSON.stringify({
              user: that.state.user,
              path: that.state.cwd,
              fullPath: that.state.cwd + "/" + (file.fullPath || file.name)
            })
          );
        });

        this.on("success", (file, res) => {
          fileUploadQueue[file.fileUploadQueueIndex].completed += 1;
          fileUploadQueue[file.fileUploadQueueIndex].successful.push(
            file.fileID
          );
          if (fileUploadQueue[file.fileUploadQueueIndex].progress() == 100) {
            toast.dismiss(fileUploadQueue[file.fileUploadQueueIndex].toastID);
            toast.success(
              <ToastFileSuccess
                count={
                  fileUploadQueue[file.fileUploadQueueIndex].successful.length
                }
                path={that.state.cwd}
              />,
              { bodyClassName: "success-notify" }
            );
          }
        });

        this.on("error", (file, message, res) => {
          fileUploadQueue[file.fileUploadQueueIndex].completed += 1;
          fileUploadQueue[file.fileUploadQueueIndex].failed.push(file.fileID);
          toast.error(
            <ToastFileError name={file.name} path={that.state.cwd} />,
            { bodyClassName: "error-notify" }
          );
          if (fileUploadQueue[file.fileUploadQueueIndex].progress() == 100) {
            toast.dismiss(fileUploadQueue[file.fileUploadQueueIndex].toastID);
            toast.success(
              <ToastFileSuccess
                count={
                  fileUploadQueue[file.fileUploadQueueIndex].successful.length
                }
                path={that.state.cwd}
              />,

              { bodyClassName: "success-notify" }
            );
          }
        });
      }
    });
  }

  fileUploadQueueContains(time) {
    for (let index = 0; index < fileUploadQueue.length; index++) {
      if (time - fileUploadQueue[index].time < 300) {
        return index;
      }
    }
    return -1;
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
