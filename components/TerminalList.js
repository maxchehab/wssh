import React from "react";
import Terminal from "./Terminal";

export default class TerminalList extends React.Component {
  render() {
    const terminals = this.props.terminals.map((term, i) => (
      <Terminal currentValue={this.props.currentValue} key={i} value={term} />
    ));
    return <div>{terminals}</div>;
  }
}
