import React from "react";
import * as Bootstrap from "react-bootstrap";
import {Link, Route, withRouter} from "react-router-dom";


class NavBar extends React.Component {

    render() {
        return (
            <Bootstrap.Navbar id="mainNavBar" bg="dark" variant="dark" sticky={"top"}>
                <Link to="/" className="navbar-brand mr-auto">AdminApp</Link>
                <Route exact path={"/"}>
                    <Link to={'/ontology-sets'}>
                        <Bootstrap.Button variant={"success"} className={'mr-3'}>Ontology dashboard</Bootstrap.Button>
                    </Link>
                    <Link to={'/index'}>
                        <Bootstrap.Button variant={"success"} className={'mr-3'}>Create new</Bootstrap.Button>
                    </Link>
                </Route>
                <Route exact path={"/ontology-sets"}>
                    <Link to={'/'}>
                        <Bootstrap.Button variant={"success"} className={'mr-3'}>Indexer</Bootstrap.Button>
                    </Link>
                    <Link to={'/ontology-set'}>
                        <Bootstrap.Button variant={"success"} className={'mr-3'}>Create new</Bootstrap.Button>
                    </Link>
                </Route>
            </Bootstrap.Navbar>
        );
    }
}

export default withRouter(NavBar);
