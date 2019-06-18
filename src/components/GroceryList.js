import React, { Component } from 'react';

class GroceryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      currentListName: "Select one of your active lists.",
      selectedListID: null,
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <table>
        <thead>
          <th>{this.state.currentListName}</th>
        </thead>
        <tbody>
          {
            this.state.listItems.map( (value, index) => {
              return (
                <tr className="ListItemRow" key={value.id}>
                  <td className="ListItemCell">{value.itemName}</td>
                  <td className="CompleteCheck">{value.complete}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

export default GroceryList;
