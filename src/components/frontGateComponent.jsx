import React from 'react';

const FrontGateComponent = ({ devices, deviceStates, onUpdateDeviceState }) => {
  const gateDevice = devices?.find(device => device.name === 'FRONT_GATE');
  const gateState = gateDevice ? deviceStates[gateDevice.device_id] : null;

  if (!gateDevice) {
    return (
      <div className="w-full flex flex-col gap-2">
        <h2 className='text-xl'>Front gate</h2>
        <div className='flex items-center gap-2 mt-2'>
          <i className="pi pi-exclamation-circle"></i>
          <span className="text-xl font-semibold">No front gate added</span>
        </div>
      </div>
    );
  }

  const handleGateSwitch = (isOpen) => {
    if (gateDevice && typeof onUpdateDeviceState === 'function') {
      onUpdateDeviceState(gateDevice, isOpen);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Gate</h2>
      </div>
      <div className="flex flex-row justify-between px-4">
        <div className="flex flex-row gap-4 items-center">
          <i className="pi pi-home text-2xl"></i>
          <span className="text-white text-lg font-medium">
            Front gate
          </span>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <div
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out relative ${
              gateDevice?.status === 'active' 
                ? (gateState?.isOn ? 'bg-blue-600' : 'bg-gray-600') 
                : 'bg-gray-700 cursor-not-allowed'
            }`}
            onClick={() => handleGateSwitch(!gateState?.isOn)}
          >
            <div
              className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out ${
                gateState?.isOn ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
          <div 
            className={`w-3 h-3 rounded-full ${
              gateDevice?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`} 
          />
        </div>
      </div>
    </div>
  );
};

export default FrontGateComponent;