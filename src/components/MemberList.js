import React, { Component } from 'react';

class MemberList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listMembers: [],
      displayShareUserInput: false,
      sharedUserEmail: "",
      isOwner: false,
    };

    this.updateSig = "" + this.props.list.roomName + "memberList";
  }

  componentDidMount() {
    this.props.socket.getListMembers(this.props.list.id, (message, data) => {
      if(data !== false) {
        this.setState({
          listMembers: data,
        });
      this.props.socket.registerForUpdates(this.updateSig, (data) => this.receiveUpdate(data));
      }
      else {
        window.alert(message);
      }
    });
    if(this.props.list.createdBy === this.props.user.id) {
      this.setState({
        isOwner: true,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.list !== prevProps.list) {
    this.props.socket.getListMembers(this.props.list.id, (message, data) => {
      if(data !== false) {
        this.setState({
          listMembers: data,
        });
        this.props.socket.deregisterForUpdates(this.updateSig)
        this.updateSig = "" + this.props.list.roomName + "memberList";
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
    switch (data.op) {
      case "addmember": {
        let newMembers = this.state.listMembers;
        newMembers.push(data.newUser);
        this.setState({
          listMembers: newMembers,
        });
        break;
      }
      case "removemember": {
        if(data.removedUserId === this.props.user.id) {
          this.props.receiveUpdate({op: "deletelist", listId: this.props.list.id});
          return;
        }
        let newMembers = this.state.listMembers;
        let removeIndex = newMembers.findIndex((value) => {return (value.id === data.removedUserId)});
        newMembers.splice(removeIndex, 1);
        this.setState({
          listMembers: newMembers,
        });
        break;
      }
    }
  }

  toggleShareUser() {
    if (this.state.displayShareUserInput) {
      this.setState({
        displayShareUserInput: false
      });
    }
    else {
      this.setState({
        displayShareUserInput: true
      });
    }
  }

  handleValueChange(e) {
    this.setState({ sharedUserEmail: e.target.value });
  }

  validateKeyPress(e) {
    if (e.key === "Enter") {
      if(e.target.value === "") {
        return;
      }
      this.shareUser(e.target.value);
      this.setState({
        sharedUserEmail: '',
      });
      this.toggleShareUser();
    }
  }

  shareUser(email) {
    this.props.socket.addListUser(email.toLowerCase(), this.props.list.id, this.props.list.roomName, (message, data) => {
      if(data !== false) {
        var newMembers = this.state.listMembers;
        newMembers.push(data);
        this.setState({
          listMembers: newMembers,
        });
      }
      else {
        window.alert(message);
      }
    });
  }

  removeUser(userId) {
    if(this.state.isOwner) {
      if(window.confirm("Are you sure you want unshare this user from this list?")) {
        this.props.socket.removeListUser(userId, this.props.list.id, this.props.list.roomName, (message, success) => {
          if(success === true) {
            let newMembers = this.state.listMembers;
            let removedIndex = newMembers.findIndex((value) => {return (value.id===userId)});
            newMembers.splice(removedIndex, 1);
            this.setState({
              listMembers: newMembers,
            });
            return;
          }
          else {
            window.alert(message);
            return;
          }
        });
      }
      else {
        return;
      }
    }
    else {
      if(window.confirm("Are you sure you want to leave this list?")) {
        this.props.socket.removeListUser(userId, this.props.list.id, this.props.list.roomName, (message, success) => {
          if(success === true) {
            console.log("Removal complete, sending update up to List Display");
            this.props.receiveUpdate({op: "deletelist", gList: this.props.list.id}); //send data to parent compoonent to delete this list locally.
            return;
          }
          else {
            window.alert(message);
            return;
          }
        });
      }
      else {
        return;
      }
    }
  }

  render() {
    let shareUserInput = this.state.displayShareUserInput ?
    <input id="share-user" type="email" placeholder="Email address" value={this.state.sharedUserEmail} onChange= { (e) => this.handleValueChange(e) } onKeyPress={ (e) => this.validateKeyPress(e) } onBlur={ () => this.toggleShareUser() } autoFocus="true"/> :
    <button id="share-user-button" onClick={() => this.toggleShareUser()}>Share</button>;

    return (
      <div>
        <table>
          <thead>
            <th>Shared Users</th>
          </thead>
          <tbody>
            {
              this.state.listMembers.map( (value, index) => {
                let memberName = (value.id === this.props.list.createdBy) ? (value.handle + " (owner)") : value.handle;
                let removeUserButton;
                if(this.state.isOwner) { //if owner, add a remove user button to all users on the list except the owner themselves.
                  if(value.id !== this.props.list.createdBy) {
                    removeUserButton = <button className="remove-user-button" onClick={() => this.removeUser(value.id)}>Unshare</button>
                  }
                  else {
                    removeUserButton = <div></div>
                  }
                }
                else if(value.id === this.props.user.id) { //is the currently logged in user on the list add a leave button to their own name.
                  removeUserButton = <button id="leave-list-button" onClick={() => this.removeUser(value.id)}>Leave</button>
                }

                return (
                  <tr className="member-row" key={value.id}>
                    <td className="member-cell">
                      {memberName}
                      {removeUserButton}
                    </td>
                  </tr>
                )
              })
            }
            <tr className="share-user-row"><td className="share-user-cell">{shareUserInput}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }

}

export default MemberList;
