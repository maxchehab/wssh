const ToastFileSuccess = ({ count, path }) => {
  return (
    <div className={"super-container-notify"}>
      <i class="icon-notify fas fa-check-circle" />

      <div className={"container-notify"}>
        <div className={"title-notify"}>{`Success uploading files.`}</div>
        <div
          className={"body-notify"}
        >{`Uploaded ${count} files to ${path}.`}</div>
      </div>
    </div>
  );
};

const ToastFileError = ({ name, path }) => {
  return (
    <div className={"super-container-notify"}>
      <i class="icon-notify fas fa-exclamation-circle" />

      <div className={"container-notify"}>
        <div className={"title-notify"}>{`Error uploading files`}</div>
        <div
          className={"body-notify"}
        >{`Failed to upload \`${name}\` to ${path}`}</div>
      </div>
    </div>
  );
};

const ToastFileInfo = ({ count, path }) => {
  return (
    <div className={"super-container-notify"}>
      <i class="icon-notify fas fa-exclamation-circle" />

      <div className={"container-notify"}>
        <div
          className={"title-notify"}
        >{`Uploading ${count} files to ${path}`}</div>
        {/* <div
            className={"body-notify"}
          >{`Failed to upload \`${name}\` to ${path}`}</div> */}
      </div>
    </div>
  );
};

export { ToastFileError, ToastFileInfo, ToastFileSuccess };
