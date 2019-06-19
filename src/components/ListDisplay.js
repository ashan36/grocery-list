import React, { Component } from 'react';
import { getLists } from '../SocketHandler';

class ListDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
    }
  }

  componentDidMount() {
    getLists(this.props.userId, (data) => {
      
    })
  }

  render() {
    return (
      <table>
        <tbody>
          {
            this.state.lists.map( (value, index) => {
              return (
                <tr className="ListItemRow" key={value.id}>
                  <td className="ListItemCell">{value.listName}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

export default ListDisplay;
