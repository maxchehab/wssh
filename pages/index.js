import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
import Tabs, { Tab } from "material-ui/Tabs";
import TerminalController from "../components/TerminalController";
import CheatSheet from "../components/CheatSheet";
import Header from "../components/Header";
import UUID from "uuid/v4";
import "babel-polyfill";

let tabCount = 0;
let deleting = false;

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabLabels: {},
      value: 0,
      enabled: {},
      tabs: [],
      terminals: [],
      helping: false,
      cheatsheet: "",
      height: 0,
      session: UUID()
    };
    this.changeHeader = this.changeHeader.bind(this);
  }

  changeHeader = (value, label) => {
    let tabLabels = this.state.tabLabels;
    tabLabels[value] = label;
    this.setState({ tabLabels });
    document.getElementById("tabLabel" + value).innerHTML = label || "Terminal";
    window.dispatchEvent(new Event("resize"));
    if (value == this.state.value && label != undefined) {
      document.title = label;
    } else {
      document.title = "adaweb.gonzaga.edu";
    }
  };

  keyHandler = event => {
    document.getElementsByClassName("terminal")[this.state.value].focus();
  };

  handleChange = (event, value) => {
    this.setState({
      value: value
    });

    this.changeHeader(value, this.state.tabLabels[value]);
  };

  componentDidMount() {
    this.newTerminal();
    document.addEventListener("keydown", this.keyHandler.bind(this));

    this.setState({ height: window.innerHeight - 48 });
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
        label={
          <span
            style={{
              fontFamily: "monospace",
              textTransform: "none",
              fontSize: 14
            }}
            id={"tabLabel" + key}
          >
            Terminal
          </span>
        }
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

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.tabs.length) {
      this.newTerminal();
    }
  }

  render() {
    return (
      <div>
        <Header />
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
        <div style={{ display: "flex" }}>
          <TerminalController
            helping={this.state.helping}
            currentValue={this.state.value}
            terminals={this.state.terminals}
            session={this.state.session}
            changeHeader={this.changeHeader}
          />
          <CheatSheet helping={this.state.helping} height={this.state.height} />
        </div>
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
        <Button
          className="new-terminal"
          onClick={() => {
            this.setState({ helping: !this.state.helping });
          }}
          fab
          style={{
            position: "fixed",
            bottom: 80,
            right: 18,
            opacity: 0.5
          }}
          color="primary"
          aria-label="help"
        >
          <i className="material-icons">
            {this.state.helping ? "close" : "help"}{" "}
          </i>
        </Button>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Index);
