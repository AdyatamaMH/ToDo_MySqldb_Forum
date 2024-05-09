const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/register', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.post('/login', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/login', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/tasks');
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/tasks', req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.put('/tasks/:task_id', async (req, res) => {
    try {
        const response = await axios.put(`http://localhost:8000/tasks/${req.params.task_id}`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

app.delete('/tasks/:task_id', async (req, res) => {
    try {
        const response = await axios.delete(`http://localhost:8000/tasks/${req.params.task_id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response.status).json(error.response.data);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
