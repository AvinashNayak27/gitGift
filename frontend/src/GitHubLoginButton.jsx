import React from 'react';
import axios from 'axios';

const GitHubLoginButton = () => {

    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/github';
    };


    return (
        <div>
            <button 
                onClick={handleLogin} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Login with GitHub
            </button>
        </div>
    );
};

export default GitHubLoginButton;
