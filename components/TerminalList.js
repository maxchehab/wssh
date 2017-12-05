import React from "react";
import Terminal from "./Terminal";

export default class TerminalList extends React.Component {
  render() {
    const terminals = this.props.terminals.map(term => (
      <Terminal currentValue={this.props.currentValue} value={term} />
    ));
    return <div>{terminals}</div>;
  }
}
