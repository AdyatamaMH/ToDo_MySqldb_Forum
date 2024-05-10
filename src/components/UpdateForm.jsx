import React, { useState } from 'react';
import axios from 'axios';

const UpdateForm = ({ updateData, cancelUpdate }) => {
  const [title, setTitle] = useState(updateData ? updateData.title : '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (title.trim() !== '') {
      try {
        const response = await axios.put(`http://localhost:8000/tasks/${updateData.id}`, {
          title: title
        });
        console.log('Task updated:', response.data);
        cancelUpdate(); 
      } catch (err) {
        console.error('Error updating task:', err.response ? err.response.data : err.message);
        alert('Failed to update task: ' + (err.response ? err.response.data.detail : err.message));
      }
    } else {
      alert('Title cannot be empty!');
    }
  };

  return (
    <>
      <form onSubmit={handleUpdate} className='editTodo' name='updateTodo'>
        <div className="row">
          <div className="col">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control form-control-lg"
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-lg btn-success mr-20">Update</button>
            <button onClick={cancelUpdate} className="btn btn-lg btn-warning">Cancel</button>
          </div>
        </div>
      </form>
      <br />
    </>
  );
}

export default UpdateForm;
