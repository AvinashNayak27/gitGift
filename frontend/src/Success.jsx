import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSuccess(props) {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Store the token in local storage
            localStorage.setItem('githubAccessToken', token);

            // Redirect to the root path
            navigate('/');
        } else {
            // Handle error: token was not provided
            console.error("Token was not provided.");
        }
    }, [navigate]);

    return (
        <div>
            Processing login...
        </div>
    );
}

export default LoginSuccess;
