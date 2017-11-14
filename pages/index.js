import React from "react";
import Terminal from "../components/Terminal";
import { Paper, Tabs, Tab, LinearProgress, AppBar, Toolbar } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const theme = getMuiTheme({
  palette: {
    primary1Color: "#003f72",
    primary2Color: "#003f72",
    accent1Color: "#691012",
    pickerHeaderColor: "#003f72"
  }
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
          <Tabs>
            <Tab value="one" label="Terminal">
              <Terminal />
            </Tab>
            <Tab value="two" label="Terminal">
              <Terminal />
            </Tab>
            <Tab value="three" label="Terminal">
              <Terminal />
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}
