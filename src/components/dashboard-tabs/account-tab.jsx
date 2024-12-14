import React, { useState, useEffect, useRef } from 'react';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';

export default function AccountTab() {
  let [data, setData] = useState(null);

  const fetchAccountInfo = async() => {
    try {
      let response = await fetch(`http://localhost:4000/api/account/${sessionStorage.getItem('UserId')}`, {
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
    fetchAccountInfo();
  }, []);

  if (!data) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col py-5 gap-6 max-w-3xl mx-auto">
      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">User</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Name</span>
              <div className="flex items-center gap-2">
                {data.login}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Email</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {data.email}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm mb-1">Password</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button label="Change" size='small' icon="pi pi-lock" className="mt-2"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1C] rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold mb-4">My Homes</h2>
          <div className="space-y-4">
            {data.homes.map((home) => (
              <div key={home.home_id} className="rounded-lg p-4 bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-2 justify-between">
                      <h3 className="text-lg font-medium">{home.name}</h3>
                      {home.owner_id === parseInt(sessionStorage.getItem('UserId')) && (
                        <span className="text-xs bg-[#CB50CB] text-white px-2 py-1 rounded">Owner</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Invite Code:</span>
                      <span className="text-sm bg-[#151513] px-2 py-1 rounded">{home.home_invite_code}</span>
                      <Button 
                        icon="pi pi-copy" 
                        className="p-button-text p-button-sm p-0 bg-transparent" 
                        onClick={() => navigator.clipboard.writeText(home.home_invite_code)}
                      />
                    </div>
                  </div>
                  {home.owner_id !== parseInt(sessionStorage.getItem('UserId')) && (
                    <Button
                      icon="pi pi-sign-out"
                      className="p-button-danger p-button-text p-button-sm"
                      tooltip="Leave Home"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}