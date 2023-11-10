import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useGithubProfile } from "./GithubProfileContext";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { setSelectedGithubId } = useGithubProfile();

  // Debounce the search operation to avoid too many API calls
  const debouncedSearchUsers = debounce(async (search) => {
    if (search.length < 3) {
      setProfiles([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://gitgift.fly.dev/search/users/${search}`
      );
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  }, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearchUsers(searchTerm);
    } else {
      setProfiles([]);
    }
    // Cleanup the debounce function on component unmount
    return () => debouncedSearchUsers.cancel();
  }, [searchTerm]);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    setSelectedGithubId(profile.id); // Set the selected GitHub ID in the context
  };

  // Reset selected profile to null to allow re-searching
  const handleResetSelection = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="mb-4 w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search GitHub users"
          className="px-4 py-2 w-full border rounded-md"
          onFocus={handleResetSelection} // Reset selection when the user focuses on the search bar
        />
      </div>
      {profiles.length > 0 && !selectedProfile && (
        <ul className="w-full">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="flex items-center p-4 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectProfile(profile)}
            >
              <img
                src={profile.avatar_url}
                alt={profile.login}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <p className="text-lg font-semibold">{profile.login}</p>
                <p className="text-sm text-gray-600">{profile.html_url}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedProfile && (
        <div className="mt-4 p-4 border rounded-md bg-white shadow">
          <div className="flex items-center space-x-4">
            <img
              src={selectedProfile.avatar_url}
              alt={selectedProfile.login}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {selectedProfile.login}
              </span>
              <a
                href={selectedProfile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Visit GitHub Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
