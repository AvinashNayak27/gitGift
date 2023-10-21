import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import GitHubLoginButton from './GitHubLoginButton';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('githubAccessToken');
        if (token) {
            setIsLoggedIn(true);
            fetchUserData(token);
            fetchUserFollowers(token);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('https://api.github.com/user', {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserFollowers = async (token) => {
        try {
            const response = await axios.get('https://api.github.com/user/followers', {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            setFollowers(response.data);
        } catch (error) {
            console.error('Error fetching user followers:', error);
        }
    };
    return (
      <div className="App bg-gray-100 min-h-screen">
          <header className="App-header text-center py-10">
              <h1 className="text-3xl font-bold mb-6">Welcome to GitGift</h1>
              {!isLoggedIn && <GitHubLoginButton />}
              {isLoggedIn && userData && (
                  <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
                      <img src={userData.avatar_url} alt="User Avatar" className="w-24 h-24 mx-auto rounded-full mb-4" />
                      <p className="text-xl font-semibold mb-2">Username: {userData.login}</p>
                      <p className="text-lg mb-2">Name: {userData.name}</p>
                      <p className="text-md mb-4">Bio: {userData.bio}</p>
                      <h2 className="text-2xl font-bold mb-4">Followers:</h2>
                      <ul className="grid grid-cols-2 gap-4">
                          {followers.map(follower => (
                              <li key={follower.id} className="flex items-center space-x-3">
                                  <img src={follower.avatar_url} alt="Follower Avatar" className="w-12 h-12 rounded-full" />
                                  <span className="text-md">{follower.login}</span>
                                  <span className="text-sm text-gray-500">{follower.id}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
          </header>
      </div>
  );
}

export default App;
