import Button from "material-ui/Button";

export default class FloatingButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.tabLength < 10 && (
          <Button
            className="wssh-fab wssh-new"
            onClick={() => this.props.addTerminal()}
            fab
            color="primary"
            aria-label="add"
          >
            <i className="material-icons">add_to_queue</i>
          </Button>
        )}
        <Button
          className="wssh-fab wssh-help"
          onClick={() => {
            this.props.changeState({ helping: !this.props.helping });
          }}
          fab
          color="primary"
          aria-label="help"
        >
          <i className="material-icons">
            {this.props.helping ? "close" : "help"}
          </i>
        </Button>
      </div>
    );
  }
}
