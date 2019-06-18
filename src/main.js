import React, { Component } from 'react';
import SignIn from './components/SignIn.js';
import ListDisplay from './components/ListDisplay.js';
import GroceryList from './components/GroceryList.js';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      handleName: "Guest",
    }
  }

  signIn() {
    this.setState({
      signedIn: true,
    })
  }

  signOut() {
    this.setState({
      signedIn: false,
      handleName: "Guest"
    })
  }

  render() {
    return (
      <SignIn signedIn={this.state.signedIn} signIn={() => this.signIn()} signOut={() => this.signOut()} handleName={this.state.handleName}/>
    )
  };
}

export default Main;
