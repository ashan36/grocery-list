import React, { Component } from 'react';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displaySignInForm: false,
      displayNewUserForm: false,
      buttonHover: false
    }
  }

  componentDidMount() {
    if (!this.props.signedIn) {
      this.setState({
        displaySignInForm: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.signedIn !== prevProps.signedIn) {
      if (!this.props.signedIn) {
        this.setState({
          displaySignInForm: true,
        });
      }
    }
  }

  displayNewUserForm() {
    if (!this.state.displayNewUserForm) {
      this.setState({
        displayNewUserForm: true
      });
    }
    else {
      this.setState({
        displayNewUserForm: false
      });
    }
  }

  mouseEnter() {
    this.setState({ buttonHover: true });
  }

  mouseLeave() {
    this.setState({ buttonHover: false });
  }

  render() {
    let button;
    let submit;

    let formVisibility = this.state.displaySignInForm ? {} : { visibility: "hidden" };
    let newUserFieldVisibilty = this.state.displayNewUserForm ? {} : { visibility: "hidden" };

    if (this.props.signedIn) {
      button = <button id="sign-out-button"
        onClick={this.props.signOut}
        onMouseEnter={() => this.mouseEnter()}
        onMouseLeave={() => this.mouseLeave()}>
        {(this.state.buttonHover) ? ("Sign-Out") : (this.props.handleName)}
      </button>
        }
      else {
        button = <button id="new-user-button"
          onClick={() => this.displayNewUserForm()}>
          New User
        </button>
      }

      if (!this.state.displayNewUserForm) {
        submit = <input id="submit-input" type="submit" formMethod="post" formAction="/signin" formEncType="application/x-www-form-urlencoded" value="Submit" form="signin_form"/>
          }
      else {
        submit = <input id="submit-input" type="submit" formMethod="post" formAction="/newuser" formEncType="application/x-www-form-urlencoded" value="Submit" form="signin_form"/>
      }

          return (
          <div>
            {button}
            <form id="signin-form" style={formVisibility}>
              <label htmlFor="email-input">Enter a valid email address</label>
              <input id="email-input" name="username" type="email"/>
              <label htmlFor="password-input">Enter your password</label>
              <input id="password-input" name="password" type="password"/>
              <label htmlFor="password-confirmation-input" style={newUserFieldVisibilty}>Confirm Password</label>
              <input id="password-confirmation-input" name="password-confirmation" type="password"  style={newUserFieldVisibilty}/>
              <label htmlFor="handle-name-input" style={newUserFieldVisibilty}>Choose a handle name</label>
              <input id="handle-name-input" name="handleName" type="text"  style={newUserFieldVisibilty}/>
            </form>
            {submit}
            <button id="cancel-button" style={newUserFieldVisibilty} onClick={() => this.displayNewUserForm()}>Cancel</button>
          </div>
    )
  }
}

export default SignIn;
