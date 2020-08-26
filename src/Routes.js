import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from './containers/NotFound'
import Login from './containers/Login'
import NewFeedback from "./containers/NewFeedback";
import Feedbacks from "./containers/Feedbacks"
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <UnauthenticatedRoute exact path="/login">
                <Login />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/feedbacks/new">
                <NewFeedback />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/feedbacks/:id">
                <Feedbacks />
            </AuthenticatedRoute>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}