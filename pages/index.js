import React from "react";
import Terminal from "../components/Terminal";
import {
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  AppBar,
  Toolbar,
  FontIcon
} from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const theme = getMuiTheme({
  palette: {
    primary1Color: "#003f72",
    primary2Color: "#003f72",
    accent1Color: "#691012",
    pickerHeaderColor: "#003f72"
  },
  userAgent: (typeof navigator !== "undefined" && navigator.userAgent) || "all"
});

let tabCount = 0;
let deleting = false;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: -1,
      tabs: []
    };
  }

  removeTerminal(id) {
    deleting = true;
    let tabs = this.state.tabs.slice();
    let index = 0;
    let lastValue = -1;

    for (let tab of tabs) {
      if (tab.props.value == id) {
        break;
      }
      lastValue = tab.props.value;
      index++;
    }

    tabs.splice(index, 1);
    this.setState({
      tabs: tabs,
      value: lastValue
    });
  }

  newTerminal() {
    deleting = false;
    let tabs = this.state.tabs.slice();
    let key = tabCount;
    tabs.push(
      <Tab
        key={key}
        value={key}
        style={{ width: "10%" }}
        className={"tab"}
        label={"Terminal"}
        icon={
          <div onClick={() => this.removeTerminal(key)}>
            <i
              style={{
                display: "none",
                right: 5,
                position: "absolute",
                bottom: 14,
                fontSize: 20
              }}
              className="material-icons"
            >
              close
            </i>
          </div>
        }
      >
        <Terminal />
      </Tab>
    );
    this.setState({
      tabs: tabs,
      value: key
    });
    tabCount++;
  }

  handleChange = value => {
    if (deleting && value != -1) {
      deleting = false;
      return;
    } else {
      deleting = false;
    }

    switch (value) {
      case "new":
        this.newTerminal();
        break;
      case "help":
        this.toggleHelp();
        break;
      default:
        this.setState({
          value: value
        });
    }
  };

  render() {
    return (
      <div>
        <style global jsx>{`
          body {
            margin: 0;
          }
          .tab:hover .material-icons {
            display: block !important;
          }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons"
          rel="stylesheet"
        />
        <MuiThemeProvider muiTheme={theme}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
            inkBarStyle={{ width: "10%" }}
          >
            <Tab key={-1} value={-1} style={{ width: "10%" }} label="Terminal">
              <Terminal />
            </Tab>
            {this.state.tabs}
            <Tab
              key={"new"}
              value={"new"}
              style={{
                width: 48,
                position: "absolute",
                right: 0
              }}
              icon={<i className="material-icons">add_to_queue</i>}
            />
            <Tab
              key={"help"}
              value={"help"}
              style={{
                width: 48,
                position: "absolute",
                right: 48
              }}
              icon={<i className="material-icons">help_outline</i>}
            />
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}
