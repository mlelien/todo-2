import React from "react";

import TaskRow from "./TaskRow";


function TaskList(props) {
  return (
    <div>
      {props.tasks.map((t, index) =>
        <TaskRow
          key={t.key}
          item={t}
          text={t.text}
          index={index}
          onDoneEditing={props.onDoneEditing}
          onDelete={props.onDelete
        }/>)
      }
    </div>
  );
}

export default TaskList;