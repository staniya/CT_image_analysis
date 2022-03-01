import React, { Component } from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import './Login.css';
import config from '../config.js';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { withRouter } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';


class Login extends Component {
  constructor(props) {
      super(props);

      this.state = {
        isLoading: false,
        username: '',
        password: '',
      };
  }

  validateForm() {
      return this.state.username.length > 0 
          && this.state.password.length > 0;
  }

  handleChange = (event) => {
      this.setState({
          [event.target.id]: event.target.value,
      });
  }

  handleSubmit = async (event) => {
      event.preventDefault();
      // give the user some feedback while logging in
      this.setState({ isLoading: true });

      try {
        const userToken = await this.login(this.state.username, this.state.password);
        this.props.updateUserToken(userToken);
        this.props.history.push('/');
      } catch(e) {
        alert(e);
        this.setState({ isLoading: false });
      }
  }

  login(username, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID,
    });

    const authenticationData = {
      Username: username,
      Password: password,
    };

    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => (
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
        onFailure: (err) => reject(err),
      })
    ));
  }

  render() {
      return(
          <div>
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="username" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                autoFocus
                type="email"
                value={this.state.username}
                onChange={this.handleChange}
                />
              </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>
              <LoaderButton
                block
                bsSize="large"
                disabled={ ! this.validateForm() }
                type="submit"
                isLoading={this.state.isLoading}
                text="Login" 
                loadingText="Loggin in..." />
            </form>
          </div>
      );
  }
}

// use HOC (Higher Order Component) to add history
// prop to our component.
// Redirect now possible by using this.props.history.push('/') to
// redirect to homepage
export default withRouter(Login);