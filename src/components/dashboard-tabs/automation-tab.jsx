import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Slider } from 'primereact/slider';

export default function AutomationTab({ devices, deviceStates }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        scenarioTurnOn: '',
        scenarioTurnOff: '',
        devices: []
    });

    const [newDevice, setNewDevice] = useState({
        device: null,
        actions: {}
    });

    const handleAddDevice = () => {
        if (!newDevice.device) return;

        const deviceToAdd = {
            device_id: newDevice.device.device_id,
            name: newDevice.device.name,
            label: newDevice.device.label,
            room_id: newDevice.device.room_id,
            category: newDevice.device.category,
            command_on: newDevice.device.command_on,
            command_off: newDevice.device.command_off,
            status: newDevice.device.status,
            actions: newDevice.actions,
            protocolData: newDevice.device.protocolData
        };

        setFormData(prev => ({
            ...prev,
            devices: [...prev.devices, deviceToAdd]
        }));

        setNewDevice({
            device: null,
            actions: {}
        });
    };

    const handleSave = () => {
        console.log("Data to be sent to API:", formData);
        setVisible(false);
        setFormData({
            name: '',
            scenarioTurnOn: '',
            scenarioTurnOff: '',
            devices: []
        });
    };

    const renderDeviceActions = () => {
        if (!newDevice.device) return null;

        switch (newDevice.device.category) {
            case 'Light':
                return (
                    <div className="flex flex-col gap-4 ">
                        <div className="field flex flex-col">
                            <label>State</label>
                            <Dropdown
                                value={newDevice.actions.state}
                                options={[
                                    { label: 'Turn On', value: 1 },
                                    { label: 'Turn Off', value: 0 }
                                ]}
                                onChange={(e) => {
                                    const newState = e.value;
                                    setNewDevice(prev => ({
                                        ...prev,
                                        actions: {
                                            ...prev.actions,
                                            state: newState,
                                            brightness: newState === 0 ? 0 : (prev.actions.brightness || 100)
                                        }
                                    }));
                                }}
                                placeholder="Select state"
                                className="w-full"
                            />
                        </div>
                        <div className="field flex flex-col gap-4">
                            <label>Brightness: {newDevice.actions.brightness || 0}%</label>
                            <div className="flex gap-4 items-center">
                                <Slider 
                                    value={newDevice.actions.brightness || 0} 
                                    onChange={(e) => {
                                        const newBrightness = e.value;
                                        setNewDevice(prev => ({
                                            ...prev,
                                            actions: {
                                                ...prev.actions,
                                                brightness: newBrightness,
                                                state: newBrightness > 0 ? 1 : 0
                                            }
                                        }));
                                    }}
                                    min={0} 
                                    max={100}
                                    className="w-full" 
                                    disabled={newDevice.actions.state === 0}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'Gate':
                return (
                    <div className="flex flex-col gap-4">
                        <div className="field flex flex-col gap-2">
                            <label>Action</label>
                            <Dropdown
                                value={newDevice.actions.state}
                                options={[
                                    { label: 'Open', value: 1 },
                                    { label: 'Close', value: 0 }
                                ]}
                                onChange={(e) => setNewDevice(prev => ({
                                    ...prev,
                                    actions: { ...prev.actions, state: e.value }
                                }))}
                                placeholder="Select action"
                                className="w-full"
                            />
                        </div>
                    </div>
                );
            case 'Sensor':
                return (
                    <div className="flex flex-col gap-4">
                        <div className="field flex flex-col gap-2">
                            <label>State</label>
                            <Dropdown
                                value={newDevice.actions.state}
                                options={[
                                    { label: 'Turn On', value: 1 },
                                    { label: 'Turn Off', value: 0 }
                                ]}
                                onChange={(e) => setNewDevice(prev => ({
                                    ...prev,
                                    actions: { ...prev.actions, state: e.value }
                                }))}
                                placeholder="Select state"
                                className="w-full"
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col gap-4">
                        <div className="field flex flex-col gap-2">
                            <label>State</label>
                            <Dropdown
                                value={newDevice.actions.state}
                                options={[
                                    { label: 'Turn On', value: 1 },
                                    { label: 'Turn Off', value: 0 }
                                ]}
                                onChange={(e) => setNewDevice(prev => ({
                                    ...prev,
                                    actions: { ...prev.actions, state: e.value }
                                }))}
                                placeholder="Select state"
                                className="w-full"
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="flex xl:flex-row flex-col xl:gap-0 gap-4 justify-between items-center mb-4">
                <h2 className="text-2xl">Automation</h2>
                <div className="flex md:flex-row flex-col gap-4 items-center">
                    <IconField iconPosition="left" className='flex items-center'>
                        <InputIcon className="pi pi-search" />
                        <InputText
                            placeholder="Search..."
                            value={searchQuery}
                            className='px-10'
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </IconField>
                    <Button
                        label="Add new"
                        icon="pi pi-plus"
                        className="p-button-success md:w-[unset] w-[100%]"
                        onClick={() => setVisible(true)}
                    />
                </div>
            </div>

            <Dialog
                header="Add New Scenario"
                visible={visible}
                style={{ width: '1000px' }}
                onHide={() => setVisible(false)}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
            >
                <div className="flex flex-col gap-4">
                    <div className="field">
                        <label htmlFor="name">Scenario Name</label>
                        <InputText
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="scenarioTurnOn">Turn On Command</label>
                        <InputText
                            id="scenarioTurnOn"
                            value={formData.scenarioTurnOn}
                            onChange={(e) => setFormData(prev => ({ ...prev, scenarioTurnOn: e.target.value }))}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="scenarioTurnOff">Turn Off Command</label>
                        <InputText
                            id="scenarioTurnOff"
                            value={formData.scenarioTurnOff}
                            onChange={(e) => setFormData(prev => ({ ...prev, scenarioTurnOff: e.target.value }))}
                            className="w-full"
                        />
                    </div>

                    <div className="field">
                        <label>Add Device</label>
                        <div className="flex gap-2">
                            <Dropdown
                                value={newDevice.device}
                                options={devices}
                                onChange={(e) => setNewDevice({ device: e.value, actions: {} })}
                                optionLabel="name"
                                placeholder="Select a device"
                                className="w-full"
                            />
                            <Button
                                icon="pi pi-plus"
                                onClick={handleAddDevice}
                                disabled={!newDevice.device}
                            />
                        </div>
                    </div>

                    {renderDeviceActions()}


                    {formData.lenght > 0 && (
                        <div className="field mt-4">
                          <label>Devices list</label>
                            <div className="flex flex-col gap-2">
                                {formData.devices.map((device, index) => (
                                    <div key={index} className="p-2 border rounded flex justify-between items-center">
                                        <span>{device.name}</span>
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-danger p-button-text"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                devices: prev.devices.filter((_, i) => i !== index)
                                            }))}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                      )
                    }
                  
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setVisible(false)}
                        />
                        <Button
                            label="Save"
                            onClick={handleSave}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}