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
} from "../components/material-ui/index";
import MuiThemeProvider from "../components/material-ui/styles/MuiThemeProvider";
import getMuiTheme from "../components/material-ui/styles/getMuiTheme";

const theme = getMuiTheme({
  palette: {
    primary1Color: "#003f72",
    primary2Color: "#003f72",
    accent1Color: "#691012",
    pickerHeaderColor: "#003f72"
  },
  userAgent: (typeof navigator !== "undefined" && navigator.userAgent) || "all"
});

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      tabs: [
        <Tab key={0} value={0} style={{ width: "10%" }} label="Terminal">
          <Terminal />
        </Tab>
      ]
    };
  }

  newTerminal() {
    let tabs = this.state.tabs.slice();
    tabs.push(
      <Tab
        key={this.state.tabs.length}
        value={this.state.tabs.length}
        style={{ width: "10%" }}
        label="Terminal"
      >
        <Terminal />
      </Tab>
    );
    this.setState({
      tabs: tabs,
      value: this.state.tabs.length
    });
  }

  handleChange = value => {
    this.setState({
      value: value
    });
    if (value == "new") {
      this.newTerminal();
    }
  };

  render() {
    return (
      <div>
        <style global jsx>{`
          body {
            margin: 0;
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
            {this.state.tabs}
            <Tab
              key={1}
              value={"new"}
              style={{
                width: "48px",
                position: "absolute",
                right: 0,
                boxShadow: "rgb(0, 0, 0) 0px 0px 3px"
              }}
              icon={<i className="material-icons">add_to_queue</i>}
            />
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}
