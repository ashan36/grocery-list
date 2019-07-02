import React, { Component } from 'react';
import GroceryList from './GroceryList.js';
import MemberList from './MemberList.js';
import ListTitle from './ListTitle.js';

class ListDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
      selectedListIndex: null,
      displayNewListInput: false,
      newListName: ""
    }

    this.updateSig = "" + this.props.user.email + "listDisplay";
  }

  componentDidMount() {
    this.requestGLists();
  }

  componentWillUnmount() {
    this.props.socket.deregisterForUpdates(this.updateSig);
  }

  requestGLists() {
    this.props.socket.getGLists(this.props.user.id, (message, data) => {
      if(data !== null) {
        this.setState({
          lists: data,
          selectedListIndex: null,
        });
        this.props.socket.registerForUpdates(this.updateSig, (data) => this.receiveUpdate(data));
      }
      else {
        alert(message);
      }
    });
  }

  selectGList(index) {
    this.setState({
      selectedListIndex: index,
    });
  }

  toggleNewListInput() {
    if (this.state.displayNewListInput) {
      this.setState({
        displayNewListInput: false
      });
    }
    else {
      this.setState({
        displayNewListInput: true
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
      this.createNewList(e.target.value);
      this.setState({
        newListName: '',
      });
      this.toggleNewListInput();
    }
  }

  createNewList(listName) {
    this.props.socket.createList(listName, this.props.user.id, (message, data) => {
      if(data !== false) {
        var newLists = this.state.lists;
        newLists.push(data);
        this.setState({
          lists: newLists,
        });
      }
      else {
        window.alert(message);
      }
    });
  }

  receiveUpdate(data) {
    if(data.op === "updatelist") {
      let newRoomName = "" + data.gList.id + "_" + data.gList.listName;
      let newLists = this.state.lists;
      let listIndex = newLists.findIndex((value) => {return (value.id === data.gList.id)});
      this.props.socket.unsubscribe(newLists[listIndex].roomName);
      data.gList = {id: data.gList.id, listName: data.gList.listName, createdBy: data.gList.createdBy, roomName: newRoomName};
      newLists[listIndex] = data.gList;
      this.setState({
        lists: newLists,
      });
      this.props.socket.subscribe(newRoomName);
    }
    else if(data.op === "deletelist") {
      console.log("Delete Updated Received");
      let newLists = this.state.lists;
      let listIndex = newLists.findIndex((value) => {return (value.id === data.listId)});
      this.props.socket.unsubscribe(newLists[listIndex].roomName);
      newLists.splice(listIndex, 1);
      this.setState({
        lists: newLists,
        selectedListIndex: null,
      });
    }
    else if(data.op === "sharelist") {
      console.log("Share list update received");
      this.requestGLists();
    }
    else if(data.op === "removemember") {
      if(data.removedUserId === this.props.user.id) {
        this.receiveUpdate({op: "deletelist", listId: data.removedListId});
        return;
      }
    }
  }

  render() {
    let newListInput = this.state.displayNewListInput ?
    <input id="new-list-input" maxLength="20" type="text" placeholder="New List Name" value={this.state.newListName} onChange= { (e) => this.handleValueChange(e) } onKeyPress={ (e) => this.validateKeyPress(e) } onBlur={ () => this.toggleNewListInput() } autoFocus="true"/> :
    <button id="new-list-button" className="icon ion-md-add" onClick={() => this.toggleNewListInput()}>&nbsp;New List</button>;
    let selectedGList = (this.state.selectedListIndex !== null) ? <GroceryList id="g-list-display" list={this.state.lists[this.state.selectedListIndex]} user={this.props.user} socket={this.props.socket}></GroceryList> : <div className="comp-placeholder"></div>;
    let selectedMemberList = (this.state.selectedListIndex !== null) ? <MemberList id="member-list-display" list={this.state.lists[this.state.selectedListIndex]} user={this.props.user} socket={this.props.socket} receiveUpdate={(data) => this.receiveUpdate(data)}></MemberList> : <div className="comp-placeholder"></div>;
    let seletedListTitle = (this.state.selectedListIndex !== null) ? <ListTitle id="list-title-display" list={this.state.lists[this.state.selectedListIndex]} user={this.props.user} socket={this.props.socket} receiveUpdate={(data) => this.receiveUpdate(data)}></ListTitle> : <div className="comp-placeholder"></div>;

      return (
      <div id="list-display-wrapper" className="container-fluid">
        <div className="row">
          <div className="col-md-5">
            <table id="list-display-table">
              <tbody>
                {
                  this.state.lists.map( (value, index) => {
                    return (
                      <tr className="g-list-row" key={value.id}>
                        <td className="g-list-cell"><ul><li className="g-list-element" onClick={() => this.selectGList(index)}>{value.listName}</li></ul></td>
                      </tr>
                    )
                  })
                }
                <tr className="new-list-row"><td className="new-list-cell">{newListInput}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-7 align-self-center">
            {seletedListTitle}
          </div>
        </div>
        <div className="row">
          {selectedGList}
          {selectedMemberList}
        </div>
      </div>
      )
  }
}

export default ListDisplay;
