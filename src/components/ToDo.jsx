import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 

const ToDo = ({ tasks, filter, markDone, setUpdateData, deleteTask }) => {
  const handleAddTask = async () => {
    try {
      await axios.post('http://localhost:8000/tasks/', {
        title: '',
        status: false, 
      });
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}`);
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/tasks/${id}`, {
        status: !status
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      {/* Form for adding new task */}
      <form onSubmit={handleAddTask} className='addTodo' name='addTodo'>
      </form>

      {/* Display tasks */}
      {tasks.map((task, index) => (
        <div className="col taskBg" key={task.id}>
          <div className={task.completed ? 'done' : ''}>
            <span className="taskNumber">{index + 1}</span>
            <span className="taskText">{task.title}</span>
          </div>
          <div className="iconsWrap">
            {/* Icon to toggle task status */}
            <span
              title="Completed / Not Completed"
              onClick={() => handleUpdateTaskStatus(task.id, task.completed)}
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>

            {/* Icon to edit task */}
            {!task.completed && (
              <span
                title="Edit"
                onClick={() =>
                  setUpdateData({
                    id: task.id,
                    title: task.title,
                    completed: task.completed ? true : false,
                  })
                }
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
            )}

            {/* Icon to delete task */}
            <span title="Delete" onClick={() => handleDeleteTask(task.id)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToDo;
