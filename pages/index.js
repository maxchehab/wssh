import "babel-polyfill";
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import UUID from "uuid/v4";
import { ToastContainer, toast } from "react-toastify";

import Terminal from "../components/Terminal";
import TerminalList from "../components/TerminalList";
import Header from "../components/Header";
import CheatSheet from "../components/CheatSheet";
import { Icon, Label } from "../components/TabElements";
import FloatingButtons from "../components/FloatingButtons";

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
    this.changeState = this.changeState.bind(this);
    this.addTerminal = this.addTerminal.bind(this);
  }

  changeHeader = (key, value) => {
    let tabLabels = this.state.tabLabels;
    tabLabels[key] = value;
    this.setState({ tabLabels });
    document.getElementById("tabLabel" + key).innerHTML = value;
    window.dispatchEvent(new Event("resize"));
    if (key == this.state.value && value != undefined) {
      document.title = value;
    } else {
      document.title = "adaweb.gonzaga.edu";
    }
  };

  keyHandler = event => {
    document.getElementsByClassName("terminal")[this.state.value].focus();
  };

  changeState = state => {
    this.setState(state);
  };

  handleChange = (event, value) => {
    this.setState({
      value: value
    });

    if (this.state.tabLabels[value] != undefined) {
      document.title = this.state.tabLabels[value];
    } else {
      document.title = "adaweb.gonzaga.edu";
    }
  };

  componentDidMount() {
    this.addTerminal();
    document.addEventListener("keydown", this.keyHandler.bind(this));

    this.setState({ height: window.innerHeight - 48 });
  }

  addTerminal() {
    let tabs = this.state.tabs.slice();
    let terminals = this.state.terminals.slice();
    let key = tabs.length;

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
        label={<Label k={key} />}
        icon={<Icon k={key} />}
      />
    );

    terminals.push(key);

    this.setState({
      tabs: tabs,
      terminals: terminals,
      value: key
    });
  }

  removeTerminal(id) {
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
      this.addTerminal();
    }
  }

  render() {
    return (
      <div>
        <Header />
        <ToastContainer />
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
          <TerminalList
            helping={this.state.helping}
            currentValue={this.state.value}
            terminals={this.state.terminals}
            session={this.state.session}
            changeHeader={this.changeHeader}
          />
          <CheatSheet helping={this.state.helping} height={this.state.height} />
        </div>
        <FloatingButtons
          helping={this.state.helping}
          tabLength={this.state.tabs.length}
          changeState={this.changeState}
          addTerminal={this.addTerminal}
        />
      </div>
    );
  }
}
export default withStyles(styles)(Index);
