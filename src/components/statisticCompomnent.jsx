import React, { useState, useEffect } from 'react';

export default function StatisticComponent() {
  const [stats, setStats] = useState({
    devices: 0,
    users: 0,
    scenarios: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/home/statistics/${sessionStorage.getItem('selected-home-id')}`, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Statistics</h2>
      </div>

      <div className="border-t border-gray-700 flex-1 flex flex-row justify-center">
        <div className="flex flex-row w-full justify-around items-center">
          <div className="flex flex-col items-center">
            <div className="w-15 h-15 bg-blue-500/10 rounded-full flex items-center justify-center mb-2">
              <i className="pi pi-home text-blue-400" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <span className="text-2xl font-semibold mb-1">{stats.devices}</span>
            <span className="text-gray-400 text-sm">Devices</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-15 h-15 bg-purple-500/10 rounded-full flex items-center justify-center mb-2">
              <i className="pi pi-users text-purple-400" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <span className="text-2xl font-semibold mb-1">{stats.users}</span>
            <span className="text-gray-400 text-sm">Users</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-15 h-15 bg-indigo-500/10 rounded-full flex items-center justify-center mb-2">
              <i className="pi pi-moon text-indigo-400" style={{ fontSize: '2.5rem' }}></i>
            </div>
            <span className="text-2xl font-semibold mb-1">{stats.scenarios}</span>
            <span className="text-gray-400 text-sm">Scenarios</span>
          </div>
        </div>
      </div>
    </div>
  );
}