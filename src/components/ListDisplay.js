import React, { Component } from 'react';

class ListDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <p>Display Grocery List Here</p>
    )
  }
}

export default ListDisplay;
