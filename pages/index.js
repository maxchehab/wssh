import React from "react";
import Terminal from "../components/Terminal";
import {
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  AppBar,
  Toolbar
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
  }

  render() {
    return (
      <div>
        <style global jsx>{`
          [data-reactroot] {
            height: 100% !important;
          }

          body {
            margin: 0;
          }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          rel="stylesheet"
        />
        <MuiThemeProvider muiTheme={theme}>
          <Tabs inkBarStyle={{ width: "10%" }}>
            <Tab style={{ width: "10%" }} label="Terminal">
              <Terminal />
            </Tab>
            <Tab style={{ width: "10%" }} label="Terminal">
              <Terminal />
            </Tab>
            <Tab style={{ width: "10%" }} label="Terminal">
              <Terminal />
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}
