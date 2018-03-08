import ReactGA from "react-ga";

export default class Header extends React.Component {
  componentDidMount() {
    ReactGA.initialize("UA-85511623-2");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    return (
      <div>
        <title>wssh</title>
        <meta charSet="utf-8" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons"
        />
        <link
          href="https://use.fontawesome.com/releases/v5.0.6/css/all.css"
          rel="stylesheet"
        />

        <link rel="icon" href="/static/favicon.ico" />
        <link rel="stylesheet" href="/static/css/index.css" />
        <link rel="stylesheet" href="/static/css/markdown.css" />

        <script src="/static/dropzone.js"> </script>
      </div>
    );
  }
}
