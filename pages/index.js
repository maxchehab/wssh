import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import Terminal from "../components/Terminal";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class ScrollableTabsButtonAuto extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Terminal" />
            <Tab label="Terminal" />
            <Tab label="Terminal" />
            <Tab label="Terminal" />
            <Tab label="Terminal" />
            <Tab label="Terminal" />
            <Tab label="Terminal" />
          </Tabs>
        </AppBar>
        <Terminal enabled={value === 0} />
        <Terminal enabled={value === 1} />
        <Terminal enabled={value === 2} />
        <Terminal enabled={value === 3} />
        <Terminal enabled={value === 4} />
        <Terminal enabled={value === 5} />
        <Terminal enabled={value === 6} />
      </div>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ScrollableTabsButtonAuto);
