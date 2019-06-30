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
      else {
        this.setState({
          displaySignInForm: false,
        });
      }
    }
  }

  handleSignIn(e) {
    console.log("handling sign in");
    e.preventDefault();
    let formData = new FormData(e.target);
    let request = new Request('/signin', {method: 'POST', credentials: 'include', body: formData});

    fetch(request).then((response) => {
      if(!response.ok) {
       console.log('sign in fetch failed');
      }
      else {
       console.log(response);
       this.setState({
         displaySignInForm: false
       });
       response.json().then((data) => {
         this.props.signIn(data.handleName, data.userId, data.email);
       })
       .catch((err) => {console.log(err);});
      }
    });
  }

 handleNewUser(e) {
   console.log("handling new user");
   e.preventDefault();
   let formData = new FormData(e.target);
   let request = new Request('/newuser', {method: 'POST', credentials: 'include', body: formData});

   fetch(request).then((response) => {
     if(!response.ok) {
       console.log('new user fetch failed');
     }
     else {
       console.log(response);
       this.setState({
         displaySignInForm: false,
         displayNewUserForm: false,
       });
       response.json().then((data) => {
          this.props.signIn(data.handleName, data.userId, data.email);
       })
       .catch((err) => {console.log(err);});
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
    let form;
    let cancelVisibility = this.state.displayNewUserForm ? {} : { visibility: "hidden" };

    if (this.props.signedIn) {
      button = <button id="sign-out-button"
        onClick={(e) => this.props.signOut(e)}
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

      if (this.state.displayNewUserForm) {
        form =
          <form id="signin-form" onSubmit={(e) => this.handleNewUser(e)}>
            <label htmlFor="email-input">Enter a valid email address</label>
            <input id="email-input" name="username" type="email"/>
            <label htmlFor="password-input">Enter your password</label>
            <input id="password-input" name="password" type="password"/>
            <label htmlFor="password-confirmation-input">Confirm Password</label>
            <input id="password-confirmation-input" name="password-confirmation" type="password"/>
            <label htmlFor="handle-name-input">Choose a handle name</label>
            <input id="handle-name-input" name="handleName" type="text"/>
            <input id="submit-input" type="submit" value="Submit"/>
          </form>
      }
      else if (!this.state.displayNewUserForm && this.state.displaySignInForm) {
        form =
          <form id="signin-form" onSubmit={(e) => this.handleSignIn(e)}>
            <label htmlFor="email-input">Enter a valid email address</label>
            <input id="email-input" name="username" type="email"/>
            <label htmlFor="password-input">Enter your password</label>
            <input id="password-input" name="password" type="password"/>
            <input id="submit-input" type="submit" value="Submit"/>
          </form>
      }
      else {
        form = <span></span>
      }
          return (
          <div>
            {button}
            {form}
            <button id="cancel-button" style={cancelVisibility} onClick={() => this.displayNewUserForm()}>Cancel</button>
          </div>
    )
  }
}

export default SignIn;
