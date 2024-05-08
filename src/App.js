import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTaskForm from './components/AddTaskForm.jsx';
import UpdateForm from './components/UpdateForm.jsx';
import ToDo from './components/ToDo.jsx';
import FullName from './components/FullName.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import SignIn from './components/auth/login';
import SignUp from "./components/auth/register";
import AuthDetails from "./components/auth/authdetails";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks/');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    // Auth state change logic removed as it's not used anymore

  }, []);

  const addTask = async () => {
    try {
      await axios.post('http://localhost:8000/tasks/', {
        title: newTask,
        status: false
      });
      setNewTask('');
      fetchTasks();
    } catch (err) {
      alert(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const changeTask = (e) => {
    const updatedData = { ...updateData, title: e.target.value };
    setUpdateData(updatedData);
  };

  const updateTask = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/tasks/${updateData.id}`, {
        title: updateData.title
      });
      fetchTasks();
      setUpdateData(null);
    } catch (err) {
      alert(err);
    }
  };

  const cancelUpdate = () => {
    setUpdateData(null);
  };

  const markDone = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:8000/tasks/${id}`, {
        status: !status
      });
      fetchTasks();
    } catch (err) {
      alert(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert(err);
    }
  };

  const handleLogout = () => {
    // Your logout logic here
  };

  return (
    <div className="container App">
      <br />
      <br />
      <h2>To Do List</h2>
      <br />
      <br />

      {isAuthenticated ? (
        <>
          <FullName fullName={fullName} number={number} />
          {updateData ? (
            <UpdateForm
              updateData={updateData}
              changeTask={changeTask}
              updateTask={updateTask}
              cancelUpdate={cancelUpdate}
            />
          ) : (
            <AddTaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
          )}

          <TaskFilter filter={filter} setFilter={setFilter} />

          {tasks && tasks.length ? (
            <ToDo tasks={tasks} filter={filter} markDone={markDone} setUpdateData={setUpdateData} deleteTask={deleteTask} />
          ) : (
            'No Tasks...'
          )}
        </>
      ) : (
        <>
          <SignIn setIsAuthenticated={setIsAuthenticated} />
          <SignUp />
          <AuthDetails />
        </>
      )}

      {/* User Profile Component */}
      {window.location.pathname === '/profile' && <UserProfile currentUser={currentUser} />}
      
      {currentUser && (
        <div>
          <h2>User Profile</h2>
          <p>Logged in as: {currentUser.email}</p>
          <p>UID: {currentUser.uid}</p>
          <p>Date Created: {new Date(currentUser.metadata.creationTime).toLocaleString()}</p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

    </div>
  );
}

export default App;
