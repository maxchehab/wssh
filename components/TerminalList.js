import React from "react";
import Terminal from "./Terminal";

export default class TerminalList extends React.Component {
  render() {

    const terminals = this.props.terminals.map((term, i) => (
      <Terminal changeHeader={this.props.changeHeader} session={this.props.session} currentValue={this.props.currentValue} key={i} value={term} />
    ));

    return (
      <div
        style={{
          width: this.props.helping ? "60%" : "100%",
          float: "left"
        }}>
        {terminals}
      </div>
    );
  }
}
