import React, { Component } from 'react';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editItem: false,
      newItemName: '',
      deleteHover: false
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.editItemIndex !== prevProps.editItemIndex) {
      if(this.props.editItemIndex !== null && prevProps.editItemIndex !== null) {
          this.toggleEdit();
      }
    }
  }

  toggleEdit() {
    if (this.state.editItem && this.props.editItemIndex !== this.props.index) { //Stop showing the edit dialog as another item has begun editing
      this.setState({
        editItem: false
      });
    }
  }

  showEdit() {
    this.setState({
      editItem: true,
    });
    this.props.dialogManager(this.props.index);
  }

  hideEdit() {
    this.setState({
      editItem: false,
    });
    this.props.dialogManager(null)
  }

  deleteItem() {
    if(window.confirm("Are you sure you want to delete this item?")) {
      this.props.deleteItem(this.props.item.id, this.props.index);
    }
    else {
      return;
    }
  }

  deleteHover() {
    if(this.state.deleteHover === false) {
      this.setState({
        deleteHover: true,
      });
    }
    else {
      this.setState({
        deleteHover: false
      });
    }
  }

  editItem(change) {
    var newItem;
    if(change === true) {
      var checked;
      if (this.props.item.complete) {
        checked = false;
      }
      else {
        checked = true;
      }
      newItem = {id: this.props.item.id, itemName: this.props.item.itemName, complete: checked};
      this.props.editItem(newItem, this.props.index);
    }
    else {
      newItem = {id: this.props.item.id, itemName: change, complete: this.props.item.complete};
      this.props.editItem(newItem, this.props.index);
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
      console.log("name change " + e.target.value);

      this.editItem(e.target.value);
      this.setState({
        newItemName: '',
      });
      this.hideEdit();
    }
  }

  render() {
    let blurFn = this.state.deleteHover ? () => {return} : () => {this.hideEdit()} //Make onBlur event do nothing if the user is currently attempting to use the delete button.
    let itemName = this.state.editItem ?
    <td className="item-name">
      <div className="item-edit-wrapper" onBlur={blurFn} autoFocus="true" >
        <input className="item-edit-input" type="text" placeholder={this.props.item.itemName} value={this.state.newItemName} onChange= { (e) => this.handleValueChange(e) } onKeyPress={ (e) => this.validateKeyPress(e) }/>
        <input className="item-delete" type="button" onClick={ () => this.deleteItem() } onMouseEnter={ () => this.deleteHover() } onMouseLeave={ () => this.deleteHover() } value="Delete"/>
      </div>
    </td> :
    <td className="item-name" onClick={() => this.showEdit()}>{this.props.item.itemName}</td>;


    return (
      <tr className="item-row">
        {itemName}
        <td className="item-complete"><input type="checkbox" checked={this.props.item.complete} onChange={() => this.editItem(true)}/></td>
      </tr>
    )
  }
}

export default ListItem;
