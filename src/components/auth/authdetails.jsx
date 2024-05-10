import React, { useEffect, useState } from "react";
import axios from 'axios';

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null);

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

    return (
        <div>
            {authUser ? (
                <>
                    <p>{`Logged In as ${authUser.email}`}</p>
                    <button onClick={() => setAuthUser(null)}>Log Out</button>
                </>
            ) : (
                <p>Logged Out</p>
            )}
        </div>
    );
};

export default AuthDetails;
