import ReactGA from "react-ga";

export default class Header extends React.Component {
    componentDidMount() {
        ReactGA.initialize("UA-85511623-2");
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    render() {
        return (
            <div>
                <title>adaweb.gonzaga.edu</title>
                <meta charSet="utf-8" />

                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons" />
                <link rel="icon" href="/static/favicon.ico" />
                <link rel="stylesheet" href="/static/css/terminal.css" />
                <link rel="stylesheet" href="/static/css/markdown.css" />

                <script src="/static/dropzone.js"> </script>
            </div>
        );
    }
};