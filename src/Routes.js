import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import NewFeedback from "./containers/NewFeedback";
import Feedbacks from "./containers/Feedbacks"

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/feedbacks/new">
                <NewFeedback />
            </Route>
            <Route exact path="/feedbacks/:id">
                <Feedbacks />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}