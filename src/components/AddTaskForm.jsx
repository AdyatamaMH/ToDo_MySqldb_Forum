import React, { useState } from 'react';
import axios from 'axios';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = async () => {
    if (title.trim() !== '') {
      try {
        await axios.post('http://localhost:8000/tasks/', {
          title: title,
          description: description,
          status: false 
        });
        setTitle('');
        setDescription('');
      } catch (err) {
        alert(err);
      }
    } else {
      alert('Title cannot be empty!');
    }
  };

  return (
    <>
      {/* Add Task Form */}
      <div className="row">
        <div className="col">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Task title"
          />
        </div>
        <div className="col">
          <input 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Task description"
          />
        </div>
        <div className="col-auto">
          <button
            onClick={handleAddTask}
            className="btn btn-lg btn-success"
          >Add Task</button>
        </div>
      </div>
      <br />
    </>
  )
}

export default AddTaskForm;
