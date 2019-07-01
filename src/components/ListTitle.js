import React, { Component } from 'react';

class ListTitle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOwner: false,
      isEditing: false,
      newListName: ""
    }
  }

  componentDidMount() {
    if(this.props.list.createdBy === this.props.user.id) {
      this.setState({
        isOwner: true
      });
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.list.id !== prevProps.list.id) {
      if(this.props.list.createdBy === this.props.user.id) {
        this.setState({
          isOwner: true
        });
      }
      else {
        this.setState({
          isOwner: false
        });
      }
    }
  }

  toggleEdit() {
    if(!this.state.isEditing) {
      this.setState({
        isEditing: true
      });
    }
    else {
      this.setState({
        isEditing: false
      });
    }
  }

  handleValueChange(e) {
    this.setState({ newListName: e.target.value });
  }

  validateKeyPress(e) {
    if (e.key === "Enter") {
      if(e.target.value === "") {
        return;
      }
      this.editList(e.target.value);
      this.setState({
        newListName: '',
      });
      this.toggleEdit();
    }
  }

  editList(newListName) {
    var newList = {id: this.props.list.id, listName: newListName, createdBy: this.props.list.createdBy}
    this.props.socket.updateGList(newList, this.props.user.id, this.props.list.roomName, (message, success) => {
      if(success === false) {
        window.alert(message);
      }
      else {
        this.props.receiveUpdate({op: "updatelist", gList: newList});
      }
    });
  }

  deleteList() {
    if(window.confirm("Are you sure you want to delete this list?")) {
      this.props.socket.deleteGList(this.props.list.id, this.props.list.roomName, (message, success) => {
        if(success === false) {
          console.log(message);
        }
        else {
          this.props.receiveUpdate({op: "deletelist", listId: this.props.list.id});
        }
      });
    }
    else {
      return;
    }
  }

  render() {
    let listInput = (this.state.isEditing) ? <span><button id="delete-list-button" className="icon ion-md-close" onClick={() => this.deleteList()}></button>
      <input id="list-edit-input" autoFocus="true" type="text" placeholder={this.props.list.listName} value={this.state.newListName} onChange= { (e) => this.handleValueChange(e) } onKeyPress={ (e) => this.validateKeyPress(e) } />
    </span>
    : this.props.list.listName
    let listHeading = (this.state.isOwner) ? <h1 id="list-heading" onClick={() => this.toggleEdit()}>{listInput}</h1> : <h1 id="list-heading">{this.props.list.listName}</h1>

    return (
      <div id="list-heading-wrapper" className="col">
        {listHeading}
      </div>
    )
  }
}

export default ListTitle;
