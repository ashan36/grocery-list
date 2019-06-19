import React, { Component } from 'react';
import SignIn from './components/SignIn.js';
import ListDisplay from './components/ListDisplay.js';
import GroceryList from './components/GroceryList.js';
import io from 'socket.io-client';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      handleName: "Sign In",
      userId: null
    }
  }

  compnentDidMount() {
    //this.socket.emit('socket message', "hello from react");
  }

  signIn(handleName, userId) {
    this.setState({
      signedIn: true,
      handleName: handleName,
      userId: userId
    });
  }

  signOut() {
    let request = new Request('/signout', {method: 'GET', credentials: 'include'});
    fetch(request).then((response) => {
      if(!response.ok) {
        console.log("sign out failed");
      }
      else {
        this.setState({
          signedIn: false,
          handleName: "Sign In"
        });
      }
    })
  }

  render() {
    let displayList;
      //displayList = this.stat.signedIn ? {} : {<ListDisplay socket={this.socket} userId={this.state.userId}/>}

    return (
      <div>
        <SignIn signedIn={this.state.signedIn} signIn={(handleName, userId) => this.signIn(handleName, userId)} signOut={() => this.signOut()} handleName={this.state.handleName}/>
        {displayList}
      </div>
    )
  };
}

export default Main;
