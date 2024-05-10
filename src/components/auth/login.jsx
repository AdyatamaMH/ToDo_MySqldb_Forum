import React, { useState } from "react";
import axios from 'axios';

const SignIn = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in both email and password.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/login/', {
                email,
                password
            });
            console.log('Login successful:', response.data);
            onLoginSuccess(response.data); // Ensure this function handles the login data correctly.
        } catch (error) {
            console.error('Error signing in:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                alert(`Login failed: ${error.response.data.message || 'Error occurred'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                alert('Login failed: Server not reachable.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                alert('Login failed: An unexpected error occurred.');
            }
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={signIn}>
                <h1>Log In to your Account</h1>
                <input
                    type="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default SignIn;
