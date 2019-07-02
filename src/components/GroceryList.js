import React, { Component } from 'react';
import ListItem from './ListItem.js';

class GroceryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listItems: [],
      displayNewItemInput: false,
      newItemName: "",
      editItemIndex: null,
    };
    this.updateSig = "" + this.props.list.roomName + "gList";
  }

  componentDidMount() {
    this.props.socket.getListItems(this.props.list.id, (message, data) => {
      if(data !== false) {
        this.setState({
          listItems: data,
        });
        this.props.socket.registerForUpdates(this.updateSig, (data) => this.receiveUpdate(data));
      }
      else {
        window.alert(message);
      }
    });
  }

  componentDidUpdate(prevProps) {
    if(this.props.list.id !== prevProps.list.id) {
      this.props.socket.getListItems(this.props.list.id, (message, data) => {
        if(data !== false) {
          this.setState({
            listItems: data,
          });
          this.props.socket.deregisterForUpdates(this.updateSig)
          this.updateSig = "" + this.props.list.roomName + "gList";
          this.props.socket.registerForUpdates(this.updateSig, (data) => this.receiveUpdate(data));
        }
        else {
          window.alert(message);
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.socket.deregisterForUpdates(this.updateSig);
  }

  receiveUpdate(data) {
    if(data.roomName === this.props.list.roomName) {
      switch (data.op) {
        case "updateitem": {
          console.log("List item update received");
          let newItems = this.state.listItems;
          let itemIndex = newItems.findIndex((value) => {return (value.id === data.newItem.id)});
          if(itemIndex !== -1) {
            newItems[itemIndex] = data.newItem;
            this.setState({
              listItems: newItems,
            });
          }
          else {
            console.log("item to update not found");
          }
          break;
        }
        case "deleteitem": {
          console.log("delete item update received");
          let newItems = this.state.listItems;
          let itemIndex = newItems.findIndex((value) => {return (value.id === data.oldItemId)});
          if(itemIndex !== -1) {
            newItems.splice(itemIndex, 1);
            this.setState({
              listItems: newItems,
            });
          }
          else {
            console.log("item to delete not found");
          }
          break;
        }
        case "createitem": {
          console.log("Create item update received");
          let newItems = this.state.listItems;
          newItems.push(data.newItem);
          this.setState({
            listItems: newItems,
          });
          break;
        }
      }
    }
  }

  toggleNewItemInput() {
    if (this.state.displayNewItemInput) {
      this.setState({
        displayNewItemInput: false
      });
    }
    else {
      this.setState({
        displayNewItemInput: true
      });
    }
  }

  handleValueChange(e) {
    this.setState({ newItemName: e.target.value });
  }

  validateKeyPress(e) {
    if (e.key === "Enter") {
      if(e.target.value === "") {
        return;
      }
      this.createNewItem(e.target.value);
      this.setState({
        newItemName: '',
      });
      this.toggleNewItemInput();
    }
  }

  createNewItem(itemName) {
    var newItem = {itemName: itemName, complete: false, listId: this.props.list.id};

    this.props.socket.createListItem(newItem, this.props.list.roomName, (message, data) => {
      if(data !== false) {
        var newListItems = this.state.listItems;
        newListItems.push(data);
        this.setState({
          listItems: newListItems,
        });
      }
      else {
        window.alert(message);
      }
    });
  }

  editItem(newItem, index) {
    this.props.socket.updateListItem(newItem, this.props.list.roomName, (message, success) => {
      if(success) {
        var newItems = this.state.listItems;
        newItems[index] = newItem;
        this.setState({
          listItems: newItems
        });
      }
      else {
        window.alert(message);
      }
    });
  }

  deleteItem(id, index) {
    this.props.socket.deleteListItem(id, this.props.list.roomName, (message, success) => {
      if(success) {
        var newItems = this.state.listItems;
        newItems.splice(index, 1);
        this.setState({
          listItems: newItems,
        });
      }
      else {
        window.alert(message);
      }
    });
  }

  manageItemDialog(i) {
    console.log("Item with index " + i + " is being edited");
    this.setState({
      editItemIndex: i,
    });
  }

  render() {
    let newItemInput = this.state.displayNewItemInput ?
    <input id="new-item-input" type="text" placeholder="New Item Name" maxLength="24" value={this.state.newItemName} onChange= { (e) => this.handleValueChange(e) } onKeyPress={ (e) => this.validateKeyPress(e) } onBlur={ () => this.toggleNewItemInput() } autoFocus="true" /> :
    <button id="new-item-button" className="icon ion-md-add" onClick={() => this.toggleNewItemInput()}></button>;

    return (
      <div id="list-wrapper" className="col-lg-6">
        <table>
          <thead>
            <th>Item Name</th>
            <th>Complete</th>
          </thead>
          <tbody>
            {
              this.state.listItems.map( (value, index) => {
                return (
                  <ListItem item={value} index={index} roomName={this.props.list.roomName} editItem={(item, i) => this.editItem(item, i) } deleteItem={(id, i) => this.deleteItem(id, i)} dialogManager={(i) => this.manageItemDialog(i)} editItemIndex={this.state.editItemIndex}></ListItem>
                  )
                  })
              }
                <tr className="new-item-row"><td className="new-item-cell">{newItemInput}</td></tr>
              </tbody>
            </table>
          </div>
    )
  }
}

export default GroceryList;
