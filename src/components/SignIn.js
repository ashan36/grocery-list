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
       response.json().then((data) => {
         if(data.success) {
            this.setState({
              displaySignInForm: false
            });
            this.props.signIn(data.handleName, data.userId, data.email);
          }
          else {
            window.alert("Sign in failed");
          }
       })
       .catch((err) => {console.log(err);});
      }
    });
  }

 handleNewUser(e) {
   console.log("handling new user");
   e.preventDefault();
   let password = document.getElementById("password-input").value;
   let passwordConf = document.getElementById("password-confirmation-input").value;

   if(password !== passwordConf) {
     window.alert("Passwords don't match");
     return;
   }

   let formData = new FormData(e.target);
   let request = new Request('/newuser', {method: 'POST', credentials: 'include', body: formData});

   fetch(request).then((response) => {
     if(!response.ok) {
       console.log('new user fetch failed');
     }
     else {
       console.log(response);
       response.json().then((data) => {
         if(data.success) {
            this.setState({
              displaySignInForm: false,
              displayNewUserForm: false
            });
            this.props.signIn(data.handleName, data.userId, data.email);
          }
          else {
            window.alert("Sign in failed");
          }
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
          <form id="signin-form" className="container" onSubmit={(e) => this.handleNewUser(e)}>
            <div className="row justify-content-md-center">
              <div className="col-sm-4">
                <label htmlFor="email-input">Enter a valid email address</label>
              </div>
              <div className="col-sm-4">
                <input id="email-input" name="username" type="email"/>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-sm-4">
                <label htmlFor="password-input">Enter your password</label>
              </div>
              <div className="col-sm-4">
                <input id="password-input" name="password" type="password"/>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-sm-4">
                <label htmlFor="password-confirmation-input">Confirm Password</label>
              </div>
              <div className="col-sm-4">
                <input id="password-confirmation-input" name="password-confirmation" type="password"/>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-sm-4">
                <label htmlFor="handle-name-input">Choose a handle name</label>
              </div>
              <div className="col-sm-4">
                <input id="handle-name-input" name="handleName" type="text"/>
              </div>
            </div>
            <div className="row justify-content-md-end">
              <div className="col-sm-6">
                <input id="sign-in-submit-input" type="submit" value="Submit"/>
                <button id="sign-in-cancel-button" onClick={() => this.displayNewUserForm()}>Cancel</button>
              </div>
            </div>
          </form>
      }
      else if (!this.state.displayNewUserForm && this.state.displaySignInForm) {
        form =
          <form id="signin-form" className="container" onSubmit={(e) => this.handleSignIn(e)}>
            <div className="row justify-content-md-center">
              <div className="col-sm-4">
                <label htmlFor="email-input">Enter a valid email address</label>
              </div>
              <div className="col-sm-4">
                <input id="email-input" name="username" type="email"/>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-sm-4">
                <label htmlFor="password-input">Enter your password</label>
              </div>
              <div className="col-sm-4">
                <input id="password-input" name="password" type="password"/>
              </div>
            </div>
            <div className="row justify-content-md-end">
              <div className="col-sm-6">
                <input id="sign-in-submit-input" type="submit" value="Submit"/>
              </div>
            </div>
          </form>
      }
      else {
        form = <span id="form-placeholder"></span>
      }
          return (
          <div id="sign-in-wrapper" className="container-fluid">
            <div className="row justify-content-sm-left">
              <div className="col">
                {button}
              </div>
            </div>
            {form}
          </div>
    )
  }
}

export default SignIn;
