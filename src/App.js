import logo from './logo.svg';
import React, { Component } from "react";
import './App.css';
import TaskList from './TaskList';

class App extends Component {

  state = {
    tasks: [],
    text: "",
    isLoadingData: false,
    loadingMessage: "",
    errorText: "",
    successText: "",
    showSuccessErrorText: false,
  };

  componentDidMount() {
    this._isMounted = true;

    this.showLoadingMessage("Loading task data...");
    Tasks.getTasks((responseArray) => {
      let fetchedTasks = [];
      //build the array of tasks from the data retrieved by getTasks
      for (let i = 0; i < responseArray.length; i++) {
        //basically, loop through tasks and if they are active we
        //add them to the fetchedTasks array
        let currentTask = responseArray[i];
        if (currentTask.todo.status === "active") {
          let task = {
            key: currentTask.id,
            text: currentTask.todo.text
          }
          fetchedTasks.push(task);
        }
      }
      //if no error, update the state
      if (this._isMounted) {
        this.setState(prevState => {
          let { tasks } = prevState;
          return {
            tasks: tasks.concat(fetchedTasks),
            text: "",
            isLoadingData: false,
            loadingMessage: ""
          };
        })
      }
      //if no error, notify user of success
      this.hideLoadingMessage();
      // this.showSuccess("Success! Tasks loaded!");

    }, errorMessage => {
      //if an error message occurs, notify the user.
      this.hideLoadingMessage();
      // this.showError("Could not load server data. Server Error: '"
      //   + errorMessage.error
      //   + "'", false);
    })
  }

  componentWillUnmount() {
    //if the component is going to unmount, update _isMounted to avoid state updates.
    this._isMounted = false;
  }

  changeTextHandler = event => {
    if (this._isMounted) {
      this.setState({ text: event.target.value });
    }
  };

  showLoadingMessage = text => {
    if (this._isMounted) {
      this.setState({ isLoadingData: true, loadingMessage: text });
    }
  }

  hideLoadingMessage = () => {
    if (this._isMounted) {
      this.setState({ isLoadingData: false, loadingMessage: "" });
    }
  }

  showError = (message) => {
    if (this._isMounted) {
      this.setState({
        errorText: message,
        text: "",
        showSuccessErrorText: true,
      })
      setTimeout(() => {
        this.setState({
          showSuccessErrorText: false,
          errorText: "",
        });
      }, 2000);
    }
  }

  showSuccess = (message) => {
    if (this._isMounted) {
      this.setState({
        successText: message,
        text: "",
        showSuccessErrorText: true,
      })
      setTimeout(() => {
        this.setState({
          showSuccessErrorText: false,
          successText: "",
        });
      }, 2000);
    }
  }

  deleteTask = (i, item) => {

    //show a loading message indicating we are deleting the task
    this.showLoadingMessage("Deleting Task...");

    //attempt a delete
    Tasks.deleteTask(item.key, item.text, () => {
      //if its successful
      if (this._isMounted) {
        //update state
        this.setState(
          prevState => {
            let tasks = prevState.tasks.slice();
            tasks.splice(i, 1);
            return { tasks: tasks };
          }
        );
      }
      //hide loading message and show success to user
      this.hideLoadingMessage();
      this.showSuccess("Task successfully deleted!");

    }, errorMessage => {
      //if error, we should ouput to user
      this.hideLoadingMessage();
      this.showError("Cannot update task! Server Error: '"
        + errorMessage.error + "'");
    });

  };

  updateTask = (text, item, index) => {
    let notEmpty = text.trim().length > 0;
    //make sure the text isnt empty and there was actually
    //some type of text update. note: this should never be empty,
    //because its checked in TaskRow.
    if (notEmpty && text !== item.text) {
      //if its not empty and there is text, begin the update
      this.showLoadingMessage("Updating task...");

      //attempt to update the task
      Tasks.updateTask(item.key, text, () => {
        this.hideLoadingMessage();
        if (this._isMounted) {

          //if the task was successfully updated, update it
          //in the local state.
          this.setState(
            prevState => {
              let tasks = prevState.tasks;

              tasks[index].text = text;
              return {
                tasks: tasks
              }
            }
          );
        }
        //display a success message
        this.showSuccess("Task successfully updated!");
      },
        errorMessage => {
          //if there was an error, display an error message
          this.hideLoadingMessage();
          this.showError("Cannot update task! Server Error: '"
            + errorMessage.error + "'");
        });
    }
  }

  addTask = (event) => {
    event.preventDefault();
    //check to make sure the text state variable is not empty.
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      //if not empty, begin adding
      this.showLoadingMessage("Adding task...");

      //attempt to add the task
      Tasks.addTask(this.state.text, (response) => {
        //if successfully addded, set the current state to include
        //the new added task
        if (this._isMounted) {
          this.setState(
            prevState => {
              let { tasks, text } = prevState;
              return {
                tasks: tasks.concat({ key: response.id, text: text }),
                text: "",
                errorText: ""
              };
            }
          );
        }
        //show success message
        this.hideLoadingMessage();
        this.showSuccess("Task successfully added!");
      },
        (errorMessage) => {
          //if there is an error, show an error message
          this.hideLoadingMessage();
          this.showError("Cannot update task! Server Error: '"
            + errorMessage.error + "'");
        });
    }
    else {
      //if its empty, notify the user
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          To-Do List
        </header>
        <div className="App-body">
          <TaskList
            tasks={this.state.tasks}
            onDoneEditing={this.updateTask}
            onDelete={this.deleteTask}
          />
        </div>
        <div className="App-system">
          {this.state.isLoadingData ? this.state.loadingMessage : ""}
          {this.state.showSuccessErrorText && (this.state.errorText || this.state.successText)}
        </div>
        <footer className="App-footer">
          <form onSubmit={this.addTask}>
            <input
              type="text"
              value={this.state.text}
              onChange={this.changeTextHandler}
              placeholder={"Add Tasks"}
            />
          </form>
        </footer>

      </div>
    );
  }
}

const userId = 'BHAVIK_PATEL_REACT';

const Tasks = {
  getTasks(callback, error) {
    const options = { method: 'GET', headers: { Accept: 'application/json' } };

    fetch('https://sandbox.hurdlr.com/rest/v5/interview/todos?userId=' + userId, options)
      .then(response => response.ok ? response.json().then((result) =>
        callback(result)) : response.json().then((errorMessage) =>
          error(errorMessage)))
      .catch(err => console.error(err));
  },

  updateTask(id, text, callback, error) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        todo: { status: 'active', text: text },
        id: id,
        userId,
        throwError: false,
      })
    };

    fetch('https://sandbox.hurdlr.com/rest/v5/interview/todo', options)
      .then(response => response.ok ? response.json().then((result) =>
        callback(result)) : response.json().then((errorMessage) =>
          error(errorMessage)))
      .catch(err => console.error(err));
  },

  deleteTask(id, text, callback, error) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        todo: { status: 'deleted', text: text },
        userId,
        id: id,
        throwError: false,
      })
    };

    fetch('https://sandbox.hurdlr.com/rest/v5/interview/todo', options)
      .then(response => response.ok ? response.json().then((result) =>
        callback(result)) : response.json().then((errorMessage) =>
          error(errorMessage)))
      .catch(err => console.error(err));
  },

  addTask(text, callback, error) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        todo: { status: 'active', text: text },
        userId,
        throwError: false,
      })
    };
    fetch('https://sandbox.hurdlr.com/rest/v5/interview/todo', options)
      .then(response => response.ok ? response.json().then((result) =>
        callback(result)) : response.json().then((errorMessage) =>
          error(errorMessage)))
      .catch(err => console.error(err));
  }
}

export default App;
