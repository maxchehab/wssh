const Icon = ({ k }) => {
  return (
    <div>
      <i id={"icon" + k} className={"wssh-icon material-icons"}>
        close
      </i>
    </div>
  );
};

const Label = ({ k }) => {
  return (
    <div>
      <span className={"wssh-tab"} id={"tabLabel" + k}>
        Terminal
      </span>
    </div>
  );
};

export { Icon, Label };
