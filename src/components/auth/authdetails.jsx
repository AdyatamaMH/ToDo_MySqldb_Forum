import React, { useEffect, useState } from "react";
import axios from 'axios';

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8000/auth/check');
            if (response.data.authenticated) {
                setAuthUser(response.data.user);
            } else {
                setAuthUser(null);
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
        }
    };

    const userlogOut = async () => {
        try {
            await axios.post('http://localhost:8000/auth/logout');
            setAuthUser(null);
            console.log('Log out successful');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    
    return (
        <div> 
            {authUser ? (
                <>
                    <p> {`Logged In as ${authUser.email}`} </p> 
                    <button onClick={userlogOut}> Log Out </button> 
                </>
            ) : (
                <p> Logged Out </p>
            )} 
        </div>
    )
}

export default AuthDetails;
