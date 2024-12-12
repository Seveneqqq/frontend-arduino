import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Knob } from 'primereact/knob';

export default function DevicesTab({ devices, deviceStates, onEditDevice, onDeleteDevice, onSwitchChange, onKnobChange }) {
  const rooms = [
    'Kitchen',
    'Living room',
    'Bathroom',
    'Garden',
    'Children\'s room',
    'Garage',
    'Office'
  ];

  const groupDevicesByRoom = () => {
    const devicesByRoom = {};
    devices.forEach(device => {
      const roomIndex = device.room_id - 1;
      if (roomIndex >= 0 && roomIndex < rooms.length) {
        const room = rooms[roomIndex];
        if (!devicesByRoom[room]) {
          devicesByRoom[room] = [];
        }
        devicesByRoom[room].push(device);
      }
    });
    return devicesByRoom;
  };

  const devicesByRoom = groupDevicesByRoom();
  const roomsWithDevices = Object.keys(devicesByRoom);

  const columnClasses = [
    'grid-cols-1',
    'grid-cols-1 xl:grid-cols-2',
    'grid-cols-1 xl:grid-cols-3',
    'grid-cols-1 xl:grid-cols-4',
    'grid-cols-1 xl:grid-cols-5',
    'grid-cols-1 xl:grid-cols-6',
    'grid-cols-1 xl:grid-cols-7'
  ];

  const [visibleActions, setVisibleActions] = useState(null);

  const handleEditClick = (device) => {
    onEditDevice(device);
    setVisibleActions(null);
  };

  const handleDeleteClick = (device) => {
    onDeleteDevice(device);
    setVisibleActions(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">Devices</h2>
        <Button label="Add new device" icon="pi pi-plus" className="p-button-success" />
      </div>
      <div className={`grid ${columnClasses[roomsWithDevices.length - 1]} gap-4`}>
        {roomsWithDevices.map((room, index) => (
          <div key={index} className="bg-[#151513] rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">{room}</h3>
            <div className="space-y-2">
              {devicesByRoom[room].map((device, deviceIndex) => (
                <div
                  key={`${room}-${deviceIndex}`}
                  className={`p-4 rounded-xl flex justify-between items-center ${
                    device.status === 'active' ? 'bg-[#1E1E1C]' : 'bg-[#111111]'
                  }`}
                >
                  <div>
                    <h4 className="text-base font-medium">{device.label}</h4>
                    <p className={`text-sm ${device.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                      {device.status}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center relative">
                    {device.status === 'active' && (
                      <InputSwitch
                        checked={deviceStates[device.device_id]?.isOn || false}
                        onChange={(e) => onSwitchChange(device, e.value, deviceStates[device.device_id]?.brightness, false)}
                      />
                    )}
                    {device.category === 'Light' && (
                      <div className="flex items-center">
                        <Knob
                          value={deviceStates[device.device_id]?.brightness || 100}
                          onChange={(e) => onKnobChange(device, deviceStates[device.device_id]?.isOn, e.value, false)}
                          valueTemplate="{value}%"
                          size={60}
                          strokeWidth={8}
                          valueColor="#5E85ED"
                          disabled={!deviceStates[device.device_id]?.isOn || device.status !== 'active'}
                        />
                      </div>
                    )}
                    <Button
                      icon="pi pi-ellipsis-v"
                      className="p-button-text p-button-secondary"
                      onClick={() => setVisibleActions(visibleActions === device.device_id ? null : device.device_id)}
                    />
                    {visibleActions === device.device_id && (
                      <div className="absolute top-full gap-2 mt-2 left-0 bg-gray-800 rounded shadow-lg p-2 flex flex-col z-10">
                        <Button
                          label="Edit"
                          icon="pi pi-pencil"
                          className="p-button-text text-left bg-transparent"
                          onClick={() => handleEditClick(device)}
                        />
                        <Button
                          label="Delete"
                          icon="pi pi-trash"
                          className="p-button-text text-left bg-transparent"
                          onClick={() => handleDeleteClick(device)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
