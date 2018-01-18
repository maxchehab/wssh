import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
import Tabs, { Tab } from "material-ui/Tabs";
import Terminal from "../components/Terminal";
import TerminalList from "../components/TerminalList";

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
      enabled: {},
      tabs: [],
      terminals: []
    };
  }

  keyHandler = (event) => {
    document.getElementsByClassName("terminal")[this.state.value].focus()
  }

  handleChange = (event, value) => {
    this.setState({
      value: value
    });
  };

  componentDidMount() {
    this.newTerminal();
    document.addEventListener("keydown", this.keyHandler.bind(this));
  }

  newTerminal() {
    deleting = false;
    let tabs = this.state.tabs.slice();
    let terminals = this.state.terminals.slice();
    let key = tabCount;
    tabs.push(
      <Tab
        key={key}
        onClick={e => {
          const rect = document
            .getElementById("icon" + key)
            .getBoundingClientRect();
          if (
            e.clientX >= rect.x &&
            e.clientX <= rect.width + rect.x &&
            e.clientY >= rect.y &&
            e.clientY <= rect.y + rect.height
          ) {
            this.removeTerminal(key);
            e.preventDefault();
          }
        }}
        style={{ height: 48, minWidth: 160 }}
        value={key}
        label="Terminal"
        icon={
          <div>
            <i
              id={"icon" + key}
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
      />
    );

    terminals.push(key);

    this.setState({
      tabs: tabs,
      terminals: terminals,
      value: key
    });

    tabCount++;
  }

  removeTerminal(id) {
    deleting = true;
    let tabs = this.state.tabs.slice();
    let terminals = this.state.terminals.slice();
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
    terminals.slice(index, 1);

    this.setState({
      tabs: tabs,
      terminals: terminals,
      value: id == this.state.value ? lastValue : this.state.value
    });
  }

  componentDidUpdate(nextProps, nextState) {
    if (!this.state.tabs.length) {
      this.newTerminal();
    }
  }

  render() {
    return (
      <div>
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
            height: 100%;
          }

          button:hover .material-icons {
            display: block !important;
          }

          .new-terminal:hover{
            opacity: 1 !important;
          }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons"
          rel="stylesheet"
        />
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {this.state.tabs}
          </Tabs>
        </AppBar>
        <TerminalList
          currentValue={this.state.value}
          terminals={this.state.terminals}
        />
        {this.state.tabs.length < 10 && (
          <Button
            className="new-terminal"
            onClick={() => this.newTerminal()}
            fab
            style={{
              position: "fixed",
              bottom: 18,
              right: 18,
              opacity: 0.5

            }}
            color="primary"
            aria-label="add"
          >
            <i className="material-icons">add_to_queue</i>
          </Button>
        )}
      </div>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScrollableTabsButtonAuto);
