import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import Terminal from "../components/Terminal";

let tabCount = 0;
let deleting = false;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class ScrollableTabsButtonAuto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      tabs: [],
      terminals: []
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  newTerminal() {
    deleting = false;
    let tabs = this.state.tabs.slice();
    let terminals = this.state.terminals.slice();
    let key = tabCount;
    tabs.push(<Tab label="Terminal" />);
    terminals.push(<Terminal enabled={key == this.state.value} />);
    this.setState({
      tabs: tabs,
      terminals: terminals,
      value: key
    });
    tabCount++;
  }

  render() {
    const { value } = this.state;

    return (
      <div>
        <button onClick={() => this.newTerminal()}>new terminal</button>
        <style global jsx>{`
          .terminal-cursor {
            background-color: white;
          }

          body {
            margin: 0;
          }

          .docker-browser-console {
            font-family: monospace;
            background-color: black;
          }
        `}</style>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {this.state.tabs}
          </Tabs>
        </AppBar>
        {this.state.terminals}
      </div>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScrollableTabsButtonAuto);
