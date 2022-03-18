import React, { Component } from "react";

class TaskRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      error: false,
      errorText: "",
      text: props.text
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  doneEditing = () => {
    if (this._isMounted) {
      this.setState({
        editing: false,
        error: false,
        errorText: ""
      })
      this.props.onDoneEditing(this.state.text, this.props.item, this.props.index);
    }
  }

  cancelEdit = () => {
    if (this._isMounted) {
      this.setState(
        {
          editing: false,
          error: false,
          errorText: "",
          text: this.props.text
        }
      );
    }
  }

  changeTextHandler = event => {
    //check if there is text
    const text = event.target.value;
    if (this._isMounted) {
      let notEmpty = text.trim().length > 0;
      if (notEmpty || this.props.allowEmpty) {
        //if not empty or allow empty, set error state variables to default
        this.setState({
          error: false,
          errorText: ""
        })
      }
      else {
        //if error, set error message
        this.setState({
          error: true,
          errorText: "The text input cannot be empty!"
        })
      }
      //set the text current state
      this.setState({ text: text });
    }
  }

  _renderTask = () => {
    return (
      <React.Fragment>
        <div onClick={() => this.setState({ editing: true })}>{this.props.text}</div>
        <button className="rowButton" onClick={() => this.props.onDelete(this.props.index, this.props.item)}>X</button>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="row">
        {!this.state.editing && this._renderTask() }
        {this.state.editing &&
          <form style={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }} onSubmit={this.state.error ? this.cancelEdit : this.doneEditing}>
            <input
              style={{ backgroundColor: "#e8e8e8" }}
              type="text"
              value={this.state.text}
              onChange={this.changeTextHandler}
            />
            <button className="rowButton" onClick={() => this.props.onDoneEditing(this.state.text, this.props.item, this.props.index)}>DONE</button>
          </form>
        }
      </div>
    );
  }
}

export default TaskRow;