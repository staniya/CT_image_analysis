import React, { Component } from 'react';
import { withRouter,Link } from 'react-router-dom';
import { Nav,Navbar,NavItem } from 'react-bootstrap';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from './config.js';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true,
    };
  }

  updateUserToken = (userToken) => {
    this.setState({
      userToken: userToken
    });
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  // clear browser session on logout using
  // AWS Cognito JS SDK signOut() function
  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    this.updateUserToken(null);
    this.props.history.push('/login');
  }

  // store and load user from the browser session
  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });

    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession(function(err, session){
        if (err) {
          reject(err);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }

  // load user token from session when the user refreshes
  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if (currentUser === null) {
      this.setState({isLoadingUserToken: false});
      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);
      this.updateUserToken(userToken);
    }
    catch(e) {
      alert(e);
    }

    this.setState({isLoadingUserToken: false});
  }

  render () {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
    };

    // hold off rendering the app till isLoadingToken is false
    return ! this.state.isLoadingUserToken && (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Scratch</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
            { this.state.userToken 
            ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
            : [ <RouteNavItem key={1} onClick={this.handleNavLink}  href="/signup">Signup</RouteNavItem>,
                <RouteNavItem key={2} onClick={this.handleNavLink} href="/login">Login</RouteNavItem>] }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {/* Pass in the props defined above as state in the route*/}
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);