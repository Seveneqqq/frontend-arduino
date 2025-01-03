import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import SessionTimedOut from '../sessionTimedOut';

export default function AutomationTab({ devices, deviceStates }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editingScenario, setEditingScenario] = useState(null);
    const toast = useRef(null);
    const [scenarios, setScenarios] = useState([]);
    const [scenariosStates, setScenariosStates] = useState({});
    const [sessionExpired, setSessionExpired] = useState(false);
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

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

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

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                setScenariosStates(prev => {
                    const newStates = { ...prev, [scenarioId]: newState };
                    localStorage.setItem('scenarioStates', JSON.stringify(newStates));
                    return newStates;
                });

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Scenario ${newState ? 'activated' : 'deactivated'}`,
                    life: 3000
                });
            } else {
                throw new Error('Failed to toggle scenario');
            }
        } catch (error) {
            console.error('Error toggling scenario:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to toggle scenario',
                life: 3000
            });
        }
    };

    const handleAddDevice = () => {
        if (!newDevice.device) return;
        
        // Validate device type and status
        if (newDevice.device.category === 'Sensor' || newDevice.device.status !== 'active') {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'This device type cannot be added to scenario',
                life: 3000
            });
            return;
        }

        // Check for duplicate devices
        const deviceExists = formData.devices.some(
            device => device.device_id === newDevice.device.device_id
        );

        if (deviceExists) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'This device is already added to the scenario',
                life: 3000
            });
            return;
        }

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

    const handleEditClick = (scenario) => {
        setEditingScenario({
            ...scenario,
            name: scenario.name,
            scenarioTurnOn: scenario.scenarioTurnOn,
            scenarioTurnOff: scenario.scenarioTurnOff
        });
        setEditDialogVisible(true);
    };

    const handleDeleteClick = async (scenarioId, scenarioName) => {
        try {
            const response = await fetch(`http://localhost:4000/api/mongodb/delete-scenario/${scenarioId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: sessionStorage.getItem('UserId')
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                setScenarios(scenarios.filter(s => s._id !== scenarioId));
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Scenario "${scenarioName}" deleted successfully`,
                    life: 3000
                });
            } else {
                throw new Error('Failed to delete scenario');
            }
        } catch (error) {
            console.error('Error deleting scenario:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete scenario',
                life: 3000
            });
        }
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/mongodb/edit-scenario/${editingScenario._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    name: editingScenario.name,
                    scenarioTurnOn: editingScenario.scenarioTurnOn,
                    scenarioTurnOff: editingScenario.scenarioTurnOff,
                    user_id: sessionStorage.getItem('UserId')
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                const updatedScenario = await response.json();
                setScenarios(scenarios.map(s => 
                    s._id === editingScenario._id ? {...s, ...updatedScenario} : s
                ));
                setEditDialogVisible(false);
                setEditingScenario(null);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Scenario updated successfully',
                    life: 3000
                });
            } else {
                throw new Error('Failed to update scenario');
            }
        } catch (error) {
            console.error('Error updating scenario:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update scenario',
                life: 3000
            });
        }
    };

    const handleSave = async () => {
        const homeId = sessionStorage.getItem('selected-home-id');

        if (!homeId) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No home selected',
                life: 3000
            });
            return;
        }

        const dataToSend = {
            ...formData,
            user_id: sessionStorage.getItem('UserId'),
            home_id: homeId
        };

        try {
            const response = await fetch('http://localhost:4000/api/mongodb/add-scenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                const savedScenario = await response.json();
                setScenarios(prevScenarios => [...prevScenarios, savedScenario]);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Scenario added successfully',
                    life: 3000
                });
                setVisible(false);
                setFormData({
                    name: '',
                    scenarioTurnOn: '',
                    scenarioTurnOff: '',
                    devices: []
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add scenario');
            }
        } catch (error) {
            console.error('Error adding scenario:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
                life: 3000
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const renderDeviceActions = () => {
        if (!newDevice.device) return null;

        switch (newDevice.device.category) {
            case 'Heating':
            return (
                <div className="flex flex-col gap-4">
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
                                        temperature: newState === 0 ? 15 : (prev.actions.temperature || 20)
                                    }
                                }));
                            }}
                            placeholder="Select state"
                            className="w-full"
                        />
                    </div>
                    {newDevice.actions.state === 1 && (
                        <div className="field flex flex-col gap-4">
                            <label>Temperature: {newDevice.actions.temperature || 20}°C</label>
                            <div className="flex gap-4 items-center">
                                <Slider 
                                    value={newDevice.actions.temperature || 20} 
                                    onChange={(e) => {
                                        setNewDevice(prev => ({
                                            ...prev,
                                            actions: {
                                                ...prev.actions,
                                                temperature: e.value
                                            }
                                        }));
                                    }}
                                    min={15} 
                                    max={36}
                                    className="w-full" 
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
            case 'Light':
                return (
                    <div className="flex flex-col gap-4">
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

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Light':
                return 'pi-lightbulb';
            case 'Gate':
                return 'pi-home';
            case 'Climate':
                return 'pi-cloud';
            case 'Sensor':
                return 'pi-chart-line';
            default:
                return 'pi-circle';
        }
    };

    return (
        <div>
            <SessionTimedOut 
                visible={sessionExpired} 
                setVisible={setSessionExpired}
            />
            <Toast ref={toast} />
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
                        className="md:w-[unset] w-[100%]"
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
                                options={devices.filter(device => device.category !== 'Sensor' && device.status === 'active')}
                                onChange={(e) => setNewDevice({ device: e.value, actions: {} })}
                                optionLabel="label"
                                placeholder="Select device"
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

                    <div className="field mt-4">
                        <label>Device list</label>
                        <div className="flex flex-col gap-2">
                            {formData.devices.map((device, index) => (
                                <div key={index} className="p-2 rounded flex justify-between items-center">
                                    <span>{device.label}</span>
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

            <Dialog
                header="Edit Scenario"
                visible={editDialogVisible}
                style={{ width: '600px' }}
                onHide={() => {
                    setEditDialogVisible(false);
                    setEditingScenario(null);
                }}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
            >
                {editingScenario && (
                    <div className="flex flex-col gap-4">
                        <div className="field">
                            <label htmlFor="edit-name">Scenario Name</label>
                            <InputText
                                id="edit-name"
                                value={editingScenario.name}
                                onChange={(e) => setEditingScenario(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="edit-turnOn">Turn On Command</label>
                            <InputText
                                id="edit-turnOn"
                                value={editingScenario.scenarioTurnOn}
                                onChange={(e) => setEditingScenario(prev => ({ ...prev, scenarioTurnOn: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="edit-turnOff">Turn Off Command</label>
                            <InputText
                                id="edit-turnOff"
                                value={editingScenario.scenarioTurnOff}
                                onChange={(e) => setEditingScenario(prev => ({ ...prev, scenarioTurnOff: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                label="Cancel"
                                className="p-button-text"
                                onClick={() => {
                                    setEditDialogVisible(false);
                                    setEditingScenario(null);
                                }}
                            />
                            <Button
                                label="Save"
                                onClick={handleEditSave}
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {scenarios
                    .filter(scenario => 
                        scenario.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(scenario => (
                        <div key={scenario._id} className="bg-[#1E1E1C] rounded-xl p-6 hover:bg-[#252523] transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-medium text-gray-100">{scenario.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {formatDate(scenario.createdAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-text p-button-sm"
                                        onClick={() => handleEditClick(scenario)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-sm p-button-danger"
                                        onClick={() => handleDeleteClick(scenario._id, scenario.name)}
                                    />
                                    <InputSwitch
                                        checked={scenariosStates[scenario._id] ?? false}
                                        onChange={(e) => handleScenarioToggle(scenario._id, e.value, scenario.devices)}
                                        className="ml-2"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-400">Voice Commands</p>
                                    <div className="space-y-2 bg-[#151513] rounded-lg p-3">
                                        <div className="flex items-center text-sm gap-4">
                                            <span className="text-green-500 w-8">ON: </span>
                                            <span className="text-gray-400">{scenario.scenarioTurnOn}</span>
                                        </div>
                                        <div className="flex items-center text-sm gap-4">
                                            <span className="text-red-500 w-8">OFF: </span>
                                            <span className="text-gray-400">{scenario.scenarioTurnOff}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-400">Devices</p>
                                    <div className="space-y-2">
                                        {scenario.devices
                                            .sort((a, b) => b.actions.state - a.actions.state)
                                            .map((device, index) => (
                                                <div 
                                                    key={index} 
                                                    className="flex items-center justify-between bg-[#151513] rounded-lg p-3 text-sm hover:bg-[#1A1A18] transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <i className={`pi ${getCategoryIcon(device.category)} text-gray-400`}></i>
                                                        {device.actions.state === 1 ? (
                                                            <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                                                        ) : (
                                                            <div className={`w-2 h-2 rounded-full bg-red-500`}></div>
                                                        )}
                                                        <span className="text-gray-200">{device.label}</span>
                                                    </div>
                                                    <div className='flex flex-row gap-4 items-center'>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-[#2A2A28] text-gray-400">
                                                            {device.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}