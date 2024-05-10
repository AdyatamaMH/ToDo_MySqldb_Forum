import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTaskForm from './components/AddTaskForm.jsx';
import UpdateForm from './components/UpdateForm.jsx';
import ToDo from './components/ToDo.jsx';
import FullName from './components/FullName.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import UserProfile from './components/UserProfile';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState(null);
  const [fullName, setFullName] = useState('Adyatama Mahabarata');
  const [number, setNumber] = useState('2602158626');
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    email: 'user@example.com', 
    uid: '12345'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
    }
  };

  const addTask = async () => {
    if (!newTask) {
      alert('Please enter a task title.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/tasks/', {
        title: newTask,
        status: false
      });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      alert(`Failed to add task: ${error.response ? error.response.data : error.message}`);
    }
  };

  const updateTask = async () => {
    if (!updateData || !updateData.title) {
      alert('Please provide the updated task title.');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/tasks/${updateData.id}`, {
        title: updateData.title
      });
      setUpdateData(null);
      fetchTasks();
    } catch (error) {
      alert(`Failed to update task: ${error.response ? error.response.data : error.message}`);
    }
  };

  return (
    <div className="container App">
      <br />
      <h2>To Do List</h2>
      {isAuthenticated ? (
        <>
          <FullName fullName={fullName} number={number} />
          {updateData ? (
            <UpdateForm
              updateData={updateData}
              setUpdateData={setUpdateData}
              updateTask={updateTask}
            />
          ) : (
            <AddTaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
          )}
          <TaskFilter filter={filter} setFilter={setFilter} />
          {tasks.length > 0 ? (
            <ToDo tasks={tasks} filter={filter} setUpdateData={setUpdateData} />
          ) : (
            'No Tasks...'
          )}
        </>
      ) : (
        <div>
          <h1>Welcome</h1>
          <p>Please log in to continue.</p>
        </div>
      )}
      {currentUser && (
        <div>
          <h2>User Profile</h2>
          <p>Logged in as: {currentUser.email}</p>
          <button onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
