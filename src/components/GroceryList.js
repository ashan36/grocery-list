import React, { Component } from 'react';

class GroceryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
    };
  }

  render() {
    return (
      <table>
        <thead>
          <th>Items</th>
        </thead>
        <tbody>
          {
            this.state.listItems.map( (value, index) => {
              return (
                <tr className="ListItemRow" key={value.key}>
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
