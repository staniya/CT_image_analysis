import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import Login from './containers/Login';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';

import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) => (
    <Switch>
        {/* use exact to just apply to exact url 
            childProps coming from what is being passed from parent
            component
        */}
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
        {/* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>
)