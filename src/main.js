import React, { Component } from 'react';
import SignIn from './components/SignIn.js';
import ListDisplay from './components/ListDisplay.js';
import SocketHandler from './SocketHandler.js';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      user: {
        handleName: "Sign In",
        id: null,
        email: null
      }
    };

    this.socket = new SocketHandler();
  }

  componentDidMount() {
    let request = new Request('/loggedIn', {method: 'POST', credentials: 'include'});
    fetch(request).then((response) => {
      if(!response.ok) {
       console.log('sign in fetch failed');
      }
      else {
        response.json().then((data) => {
          if(data.success === true) {
            this.setState({
              signedIn: true,
              user: {
                handleName: data.handleName,
                id: data.userId,
                email: data.email
              }
            });
            this.socket.signIn(data.email);
          }
          else {
            console.log(data.message);
          }
        })
        .catch((err) => {console.log(err);});
      }
    });
  }


  signIn(handleName, userId, email) {
    this.setState({
      signedIn: true,
      user: {
        handleName: handleName,
        id: userId,
        email: email
      }
    });
    this.socket.signIn(email);
  }

  signOut(e) {
    e.preventDefault();
    let request = new Request('/signout', {method: 'GET', credentials: 'include'});
    fetch(request).then((response) => {
      if(!response.ok) {
        console.log("sign out failed");
      }
      else {
        this.socket.unsubscribe(this.state.user.email);
        this.setState({
          signedIn: false,
          handleName: "Sign In"
        });
      }
    })
  }

  render() {
    let displayList;
      displayList = this.state.signedIn ?  <ListDisplay socket={this.socket} user={this.state.user}/> : <div></div>

    return (
      <div>
        <SignIn signedIn={this.state.signedIn} signIn={(handleName, userId, email) => this.signIn(handleName, userId, email)} signOut={(e) => this.signOut(e)} handleName={this.state.user.handleName}/>
        {displayList}
      </div>
    )
  };
}

export default Main;
