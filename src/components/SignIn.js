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

  handleSignIn(e) {
    let form = document.getElementById('signin-form');
    let formData = new FormData(form);
    let request = new Request('/signin', {method: 'POST', body: formData, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});

    fetch(request).then((response) => {
      if(!response.ok) {
        console.log('sign in fetch failed');
      }
      else {
        response.json();
        console.log(response);
        this.setState({
          displaySignInForm: false
        });
      }
    });
  }

  handleNewUser(e) {
    let form = document.getElementById('signin-form');
    let formData = new FormData(form);
    let request = new Request('/newuser', {method: 'POST', body: formData, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});

    fetch(request).then((response) => {
      if(!response.ok) {
        console.log('new user fetch failed');
      }
      else {
        response.json();
        console.log(response);
        this.setState({
          displaySignInForm: false
        });
      }
    });
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

    return (
      <div>
        {button}
        <form id="signin-form" style={formVisibility}>
          <label for="email-input">Enter a valid email address</label>
          <input id="email-input" name="username" type="email"/>
          <label for="password-input">Enter your password</label>
          <input id="password-input" name="password" type="password"/>
          <label for="password-confirmation-input" style={newUserFieldVisibilty}>Confirm Password</label>
          <input id="password-confirmation-input" name="password-confirmation" type="password"  style={newUserFieldVisibilty}/>
          <label for="handle-name-input" style={newUserFieldVisibilty}>Choose a handle name</label>
          <input id="handle-name-input" name="handleName" type="text"  style={newUserFieldVisibilty}/>
          <button id="sign-in-submit" onClick={(e) => {
            if (!this.state.displayNewUserForm) {
              this.handleSignIn(e);
            }
            else {
              this.handleNewUser(e);
            }
          }}>Submit
          </button>
          <button id="cancel-button" style={newUserFieldVisibilty} onClick={() => this.displayNewUserForm()}>Cancel</button>
        </form>
      </div>
    )
  }
}

export default SignIn;
