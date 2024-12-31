import React, { useEffect, useState } from 'react';

const HeatPumpController = ({ devices, deviceStates, sensorValue, onUpdateDeviceState }) => {
  const [heatPump, setHeatPump] = useState(null);
  const [tempSensor, setTempSensor] = useState(null);
  const [lastSentState, setLastSentState] = useState(null); 

  useEffect(() => {
    const pump = devices.find(d => d.name === 'HEAT_PUMP' && d.status === 'active');
    const sensor = devices.find(d => 
      d.name === 'temperature and humidity sensor' && 
      d.status === 'active'
    );

    setHeatPump(pump);
    setTempSensor(sensor);
  }, [devices]);

  useEffect(() => {
    if (!heatPump || !tempSensor || !sensorValue || !deviceStates[heatPump.device_id]) {
      return;
    }

    const heatPumpState = deviceStates[heatPump.device_id];

    if (!heatPumpState.isOn || !heatPumpState.temperature) {
      setLastSentState(null); 
      return;
    }

    const currentTemp = sensorValue.temperature;
    const targetTemp = heatPumpState.temperature;
    
    let requiredState = null;
    if (currentTemp < targetTemp) {
      requiredState = 1;
    } else if (currentTemp > targetTemp) {
      requiredState = 0;
    }

    if (requiredState !== null && requiredState !== lastSentState) {
      fetch('http://localhost:4000/api/home/do', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
        },
        body: JSON.stringify({
          homeId: heatPump.home_id,
          device: {
            deviceName: heatPump.name,
            category: heatPump.category,
            label: heatPump.label,
            status: heatPump.status
          },
          actions: {
            state: requiredState,
            temperature: targetTemp
          }
        })
      })
      .then(() => {
        setLastSentState(requiredState); 
      })
      .catch(error => console.error('Error sending heat pump signal:', error));
    }
  }, [heatPump, tempSensor, sensorValue, deviceStates, lastSentState, onUpdateDeviceState]);

  return null;
};

export default HeatPumpController;