import React from 'react';
import { useState, useEffect } from 'react';
import 'primeicons/primeicons.css';

export default function SettingTab() {
  let [data, setData] = useState(null);
  let [copyText, setCopyText] = useState("Copy");
  let [isEditing, setIsEditing] = useState(false);
  let [newName, setNewName] = useState("");

  const fetchHouseInfo = async() => {
    try {
      let house_id = sessionStorage.getItem('selected-home-id');
      let response = await fetch(`http://localhost:4000/api/home/home-info/${house_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
      });
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHouseInfo();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(homeInfo.home_invite_code);
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyText("Failed to copy");
      setTimeout(() => setCopyText("Copy"), 2000);
    }
  };

  const startEditing = () => {
    setNewName(homeInfo.name);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      let house_id = sessionStorage.getItem('selected-home-id');
      const response = await fetch(`http://localhost:4000/api/home/change-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
        body: JSON.stringify({
          home_id: house_id,
          name: newName
        })
      });

      if (response.ok) {
        setIsEditing(false);
        fetchHouseInfo();
      } else {
        console.error('Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  if (!data) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const homeInfo = data.find(item => item.type === 'home_info')?.data;
  const ownerInfo = data.find(item => item.type === 'owner')?.data;
  const usersInfo = data.find(item => item.type === 'users')?.data;

  if (!homeInfo || !ownerInfo || !usersInfo) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col py-5 gap-6 max-w-3xl mx-auto">
      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Home</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Name</span>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-gray-800 text-lg px-3 py-1.5 rounded border-0 focus:ring-1 focus:ring-blue-400 outline-none"
                    />
                    <button 
                      onClick={handleSave}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="pi pi-save"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-lg">{homeInfo.name}</span>
                    <button 
                      onClick={startEditing}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="pi pi-pen-to-square"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Invite Code</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-800 px-3 py-1.5 rounded text-blue-400 font-mono">
                  {homeInfo.home_invite_code}
                </code>
                <button 
                  onClick={handleCopy}
                  className={`text-sm ${
                    copyText === "Copied!" 
                      ? "text-green-400" 
                      : copyText === "Failed to copy" 
                        ? "text-red-400" 
                        : "text-gray-400 hover:text-white"
                  } transition-colors`}
                >
                  {copyText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Owner</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Username</span>
              <span className="text-lg">{ownerInfo.login}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Email</span>
              <span className="text-lg">{ownerInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="space-y-3">
            {usersInfo.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg group"
              >
                <div className="flex-1">
                  <div className="text-lg">{user.login}</div>
                  <div className="text-gray-400 text-sm">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}