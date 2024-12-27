import React, { useState, useEffect } from 'react';

const ScenarioCard = ({ scenarios, scenariosStates, onToggle }) => {
  const [randomScenario, setRandomScenario] = useState(null);

  useEffect(() => {
    if (scenarios && scenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      setRandomScenario(scenarios[randomIndex]);
    }
  }, [scenarios]);

  if (!randomScenario) return null;

  const isActive = scenariosStates[randomScenario._id] || false;

  return (
    <div className="w-full rounded-lg flex items-center px-4 justify-between">
      <div className="flex flex-row py-2 gap-4 justify-center items-center">
        <i className="pi pi-moon" style={{ fontSize: '1.5rem' }} ></i>
        <span className="text-white text-lg font-medium">
          {randomScenario.name}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div 
          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
            isActive ? 'bg-blue-600' : 'bg-gray-600'
          }`}
          onClick={() => onToggle(randomScenario._id, !isActive, randomScenario.devices)}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
              isActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
    </div>
  );
};

const ScenarioComponent = ({ devices, deviceStates }) => {
  const [scenarios, setScenarios] = useState([]);
  const [scenariosStates, setScenariosStates] = useState({});

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const home_id = sessionStorage.getItem('selected-home-id');
      const response = await fetch(`http://localhost:4000/api/mongodb/scenarios/${home_id}`, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        }
      });
      const data = await response.json();
      setScenarios(data);

      const savedStates = JSON.parse(localStorage.getItem('scenarioStates') || '{}');
      const initialStates = data.reduce((acc, scenario) => {
        acc[scenario._id] = savedStates[scenario._id] || false;
        return acc;
      }, {});
      setScenariosStates(initialStates);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const handleScenarioToggle = async (scenarioId, newState, scenarioDevices) => {
    try {
      const activeDevices = scenarioDevices
        .filter(device => device.status === 'active')
        .map(device => {
          if (!newState) {
            return {
              ...device,
              actions: {
                state: deviceStates[device.device_id]?.isOn ? 1 : 0,
                brightness: deviceStates[device.device_id]?.brightness || 100
              }
            };
          }
          return device;
        });

      const response = await fetch(`http://localhost:4000/api/automation/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
        body: JSON.stringify({
          scenario_id: scenarioId,
          state: newState,
          devices: activeDevices
        })
      });

      if (response.ok) {
        setScenariosStates(prev => {
          const newStates = { ...prev, [scenarioId]: newState };
          localStorage.setItem('scenarioStates', JSON.stringify(newStates));
          return newStates;
        });
      } else {
        throw new Error('Failed to toggle scenario');
      }
    } catch (error) {
      console.error('Error toggling scenario:', error);
    }
  };

  return (
    <div className="w-full h-full">
      <h2 className="text-xl mb-2">Scenario</h2>
      <ScenarioCard 
        scenarios={scenarios}
        scenariosStates={scenariosStates}
        onToggle={handleScenarioToggle}
      />
    </div>
  );
};

export default ScenarioComponent;