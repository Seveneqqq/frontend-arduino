import React, { useState, useRef, useEffect } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Knob } from 'primereact/knob';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import _ from 'lodash';
import SessionTimedOut from '../sessionTimedOut';
import HeatPumpController from '../heatPumpController';

export default function DevicesTab({ 
    devices, 
    deviceStates, 
    onEditDevice, 
    onDeleteDevice, 
    onSwitchChange, 
    onKnobChange,
    onRefresh,
    sensorValue,
    updateDeviceState
}) {
    const toast = useRef(null);
    const [loading, setLoading] = useState('hidden');
    const [blur, setBlur] = useState('');
    const [newDevices, setNewDevices] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [label, setLabel] = useState('');
    const [command_on, setCommand_on] = useState('');
    const [command_off, setCommand_off] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const [zigbeeId, setZigbeeId] = useState('');
    const [zigbeeChannel, setZigbeeChannel] = useState('');
    const [zigbeeGroupId, setZigbeeGroupId] = useState('');
    const [zigbeeHub, setZigbeeHub] = useState('');

    const [ipAddress, setIpAddress] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');

    const [bleUuid, setBleUuid] = useState('');
    const [bleConnection, setBleConnection] = useState('');

    const [zwaveDeviceId, setZwaveDeviceId] = useState('');
    const [zwaveNetworkKey, setZwaveNetworkKey] = useState('');
    const [zwaveGroupId, setZwaveGroupId] = useState('');

    const [mqttBrokerUrl, setMqttBrokerUrl] = useState('');
    const [mqttTopicOn, setMqttTopicOn] = useState('');
    const [mqttTopicOff, setMqttTopicOff] = useState('');
    const [mqttDeviceId, setMqttDeviceId] = useState('');

    const [panelVisible1, setPanelVisible1] = useState(false);
    const [panelVisible2, setPanelVisible2] = useState(false);
    const [userDevices] = useState([]);
    const [devicesList, setDevicesList] = useState([]);
    
    const [editDialog, setEditDialog] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [editLabel, setEditLabel] = useState('');
    const [editCommandOn, setEditCommandOn] = useState('');
    const [editCommandOff, setEditCommandOff] = useState('');
    const [visibleActions, setVisibleActions] = useState(null);

    const debouncedKnobChange = useRef(
        _.debounce((device, isOn, value) => {
            onKnobChange(device, isOn, value, false);
        }, 500)
    ).current;

    useEffect(() => {
        if (userDevices.length === devices.length && devices.length !== 0) {
            setPanelVisible1(false);
            setTimeout(() => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Devices saved successfully',
                    life: 2000
                });
            }, 500);
        }
    }, [userDevices, devices.length]);

    const clearFields = () => {
        setZigbeeId('');
        setZigbeeChannel('');
        setZigbeeGroupId('');
        setZigbeeHub('');
        setIpAddress('');
        setMacAddress('');
        setSsid('');
        setPassword('');
        setBleUuid('');
        setBleConnection('');
        setZwaveDeviceId('');
        setZwaveNetworkKey('');
        setZwaveGroupId('');
        setMqttBrokerUrl('');
        setMqttTopicOn('');
        setMqttTopicOff('');
        setMqttDeviceId('');
        setLabel('');
        setCommand_on('');
        setCommand_off('');
        setSelectedRoom(null);
        setSelectedCategory(null);
        setSelectedProtocol(null);
    };

    const rooms = [
        'Kitchen',
        'Living room',
        'Bathroom',
        'Garden',
        'Childrens room',
        'Garage',
        'Office',
        'Bedroom',
        'Hall'
    ];

    const categories = [
        'Light',
        'Sensor',
        'Gate',
        'Lock',
        'Security',
        'Wifi',
        'Kitchen device',
        'Heating',
        'Camera',
        'Vacuum device',
        'Multimedia device'
    ];

    const protocols = [
        'Zigbee',
        'Wifi',
        'Bluetooth',
        'Z-Wave',
        'MQTT'
    ];

    const showFormFields = () => {
        if (!selectedProtocol) return null;
        
        switch (selectedProtocol) {
            case 'Zigbee':
                return (
                    <>
                        <InputText placeholder="Zigbee ID" value={zigbeeId} maxLength={15} 
                            className="!w-64" onChange={(e) => setZigbeeId(e.target.value)} />
                        <InputText placeholder="Zigbee channel" value={zigbeeChannel} maxLength={30} 
                            className="!w-64" onChange={(e) => setZigbeeChannel(e.target.value)} />
                        <InputText placeholder="Zigbee group ID" value={zigbeeGroupId} maxLength={15} 
                            className="!w-64" onChange={(e) => setZigbeeGroupId(e.target.value)} />
                        <InputText placeholder="Zigbee binding central hub" value={zigbeeHub} maxLength={30} 
                            className="!w-64" onChange={(e) => setZigbeeHub(e.target.value)} />
                    </>
                );
            case 'Wifi':
                return (
                    <>
                        <InputText placeholder="WiFi IP address" value={ipAddress} maxLength={50} 
                            className="!w-64" onChange={(e) => setIpAddress(e.target.value)} />
                        <InputText placeholder="WiFi MAC address" value={macAddress} maxLength={50} 
                            className="!w-64" onChange={(e) => setMacAddress(e.target.value)} />
                        <InputText placeholder="WiFi SSID" value={ssid} maxLength={50} 
                            className="!w-64" onChange={(e) => setSsid(e.target.value)} />
                        <InputText placeholder="WiFi password" value={password} maxLength={50} 
                            className="!w-64" onChange={(e) => setPassword(e.target.value)} />
                    </>
                );
            case 'Bluetooth':
                return (
                    <>
                        <InputText placeholder="Bluetooth BLE UUID" value={bleUuid} maxLength={30} 
                            className="!w-64" onChange={(e) => setBleUuid(e.target.value)} />
                        <InputText placeholder="Bluetooth connection" value={bleConnection} maxLength={30} 
                            className="!w-64" onChange={(e) => setBleConnection(e.target.value)} />
                    </>
                );
            case 'Z-Wave':
                return (
                    <>
                        <InputText placeholder="Z-wave device ID" value={zwaveDeviceId} maxLength={15} 
                            className="!w-64" onChange={(e) => setZwaveDeviceId(e.target.value)} />
                        <InputText placeholder="Z-wave network key" value={zwaveNetworkKey} maxLength={30} 
                            className="!w-64" onChange={(e) => setZwaveNetworkKey(e.target.value)} />
                        <InputText placeholder="Z-wave group ID" value={zwaveGroupId} maxLength={15} 
                            className="!w-64" onChange={(e) => setZwaveGroupId(e.target.value)} />
                    </>
                );
            case 'MQTT':
                return (
                    <>
                        <InputText placeholder="MQTT broker URL" value={mqttBrokerUrl} maxLength={150} 
                            className="!w-64" onChange={(e) => setMqttBrokerUrl(e.target.value)} />
                        <InputText placeholder="MQTT topic ON" value={mqttTopicOn} maxLength={50} 
                            className="!w-64" onChange={(e) => setMqttTopicOn(e.target.value)} />
                        <InputText placeholder="MQTT topic OFF" value={mqttTopicOff} maxLength={50} 
                            className="!w-64" onChange={(e) => setMqttTopicOff(e.target.value)} />
                        <InputText placeholder="MQTT device ID" value={mqttDeviceId} maxLength={15} 
                            className="!w-64" onChange={(e) => setMqttDeviceId(e.target.value)} />
                    </>
                );
            default:
                return null;
        }
    };

    const handleEditDevice = async () => {
        if (!editLabel || !editCommandOn || !editCommandOff) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'All fields are required'
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/devices/${editingDevice.device_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    label: editLabel,
                    command_on: editCommandOn,
                    command_off: editCommandOff
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Device updated successfully'
                });
                setEditDialog(false);
                if (onRefresh) await onRefresh();
            } else {
                throw new Error('Failed to update device');
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update device'
            });
        }
    };

    const handleDeleteClick = async (device) => {
        try {
            await onDeleteDevice(device);
            if (onRefresh) await onRefresh();
        } catch (error) {
            console.error('Error deleting device:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete device'
            });
        }
        setVisibleActions(null);
    };

    const handleEditClick = (device) => {
        setEditingDevice(device);
        setEditLabel(device.label);
        setEditCommandOn(device.command_on);
        setEditCommandOff(device.command_off);
        setEditDialog(true);
        setVisibleActions(null);
    };

    async function findDevices() {
        setBlur('blur-sm');
        setLoading('');

        try {
            const response = await fetch('http://localhost:4000/api/find-devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                const data = await response.json();
                if (data.connection) {
                    setNewDevices(data.devices);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Successfully found devices',
                        life: 1000
                    });
                    setTimeout(() => {
                        setPanelVisible1(true);
                    }, 1250);
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Cannot find any device',
                        life: 1000
                    });
                }
            }
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot find any device',
                life: 1000
            });
        } finally {
            setBlur('');
            setLoading('hidden');
        }
    }

    async function AddManually() {
        setBlur('blur-sm');
        setLoading('');
        setPanelVisible2(true);

        try {
            const response = await fetch("http://localhost:4000/api/devices-list", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            const list = await response.json();
            setDevicesList(list.devices);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong',
                life: 2000
            });
            console.error(error);
        } finally {
            setBlur('');
            setLoading('hidden');
        }
    }

    function setFields(name, status) {
        setFormVisible(true);
        setSelectedRoom(null);
        setSelectedProtocol('');
        setName(name);
        setStatus(status);
    }

    const saveDevice = async () => {
        if (!name || !selectedRoom || !selectedCategory) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields',
                life: 2000
            });
            return;
        }

        const newDevice = {
            name: name,
            status: status,
            label: label || name,
            command_on: command_on,
            command_off: command_off,
            room_id: rooms.indexOf(selectedRoom),
            category: selectedCategory,
        };

        try {
            const response = await fetch('http://localhost:4000/api/add-new-devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    homeId: sessionStorage.getItem('selected-home-id'),
                    userId: sessionStorage.getItem('UserId'),
                    devices: [newDevice]
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Device added successfully',
                    life: 2000
                });
                setPanelVisible1(false);
                clearFields();
                if (onRefresh) await onRefresh();
            } else {
                throw new Error('Failed to add device');
            }
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add device',
                life: 2000
            });
        }
    };

    const saveDeviceManually = async () => {
        let foundDevice = devicesList.find(device => device.name === name);
        if (!foundDevice) return;

        const newDevice = {
            name: name,
            category: foundDevice.category,
            status: "not-active",
            label: label,
            command_on: command_on,
            command_off: command_off,
            room_id: rooms.indexOf(selectedRoom),
            protocol: selectedProtocol,
            protocolConfig: {}
        };

        switch (selectedProtocol) {
            case 'Zigbee':
                newDevice.protocolConfig = {
                    zigbeeId,
                    zigbeeChannel,
                    zigbeeGroupId,
                    zigbeeHub
                };
                break;
            case 'Wifi':
                newDevice.protocolConfig = {
                    ipAddress,
                    macAddress,
                    ssid,
                    password
                };
                break;
            case 'Bluetooth':
                newDevice.protocolConfig = {
                    bleUuid,
                    bleConnection
                };
                break;
            case 'Z-Wave':
                newDevice.protocolConfig = {
                    zwaveDeviceId,
                    zwaveNetworkKey,
                    zwaveGroupId
                };
                break;
            case 'MQTT':
                newDevice.protocolConfig = {
                    mqttBrokerUrl,
                    mqttTopicOn,
                    mqttTopicOff,
                    mqttDeviceId
                };
                break;
            default:
                // Handle unknown protocol
                break;
        }

        try {
            const response = await fetch('http://localhost:4000/api/add-new-devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    homeId: sessionStorage.getItem('selected-home-id'),
                    userId: sessionStorage.getItem('UserId'),
                    devices: [newDevice]
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Device added successfully',
                    life: 2000
                });
                setPanelVisible2(false);
                clearFields();
                if (onRefresh) await onRefresh();
            }
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add device',
                life: 2000
            });
        }
    };

    const groupDevicesByRoom = () => {
        const devicesByRoom = {};

        devices.forEach(device => {
            const roomIndex = device.room_id;
            if (roomIndex >= 0 && roomIndex < rooms.length) {
                const room = rooms[roomIndex];
                if (!devicesByRoom[room]) {
                    devicesByRoom[room] = [];
                }
                devicesByRoom[room].push(device);
            } else if (roomIndex === -1) {
                devicesByRoom["Living room"] = devicesByRoom["Living room"] || [];
                devicesByRoom["Living room"].push(device);
            }
        });

        Object.keys(devicesByRoom).forEach(room => {
            devicesByRoom[room].sort((a, b) => {
                if (a.status !== b.status) {
                    return a.status === 'active' ? -1 : 1;
                }
                if (a.status === b.status) {
                    if (a.category === 'Sensor' && b.category !== 'Sensor') return 1;
                    if (a.category !== 'Sensor' && b.category === 'Sensor') return -1;
                }
                return 0;
            });
        });

        return devicesByRoom;
    };

    const devicesByRoom = groupDevicesByRoom();
    const roomsWithDevices = Object.keys(devicesByRoom);

    return (
        <>
            <SessionTimedOut 
                visible={sessionExpired} 
                setVisible={setSessionExpired}
            />
            <Toast ref={toast} />

            <Dialog
                header="Edit Device"
                visible={editDialog}
                style={{ width: '400px' }}
                onHide={() => setEditDialog(false)}
            >
                <div className="flex flex-col gap-4 p-4">
                    <InputText
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="Device Label"
                        className={!editLabel ? 'p-invalid' : ''}
                    />
                    <InputText
                        value={editCommandOn}
                        onChange={(e) => setEditCommandOn(e.target.value)}
                        placeholder="Command to turn on"
                        className={!editCommandOn ? 'p-invalid' : ''}
                    />
                    <InputText
                        value={editCommandOff}
                        onChange={(e) => setEditCommandOff(e.target.value)}
                        placeholder="Command to turn off"
                        className={!editCommandOff ? 'p-invalid' : ''}
                    />
                    <small className="text-red-500">* Required fields</small>
                    <Button label="Save" onClick={handleEditDevice} />
                </div>
            </Dialog>

            <div className="flex xl:flex-row flex-col xl:gap-0 gap-4 justify-between items-center mb-4">
                <h2 className="text-2xl">Devices</h2>
                <div className='flex gap-4'>
                    <Button label="Arduino devices" icon="pi pi-plus" onClick={findDevices} />
                    <Button label="Other devices" icon="pi pi-plus" onClick={AddManually} />
                </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-[2000px] mx-auto`}>
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
                                        {device.status === 'active' && device.category === 'Light' && (
                                            <>
                                                <InputSwitch
                                                    checked={deviceStates[device.device_id]?.isOn || false}
                                                    onChange={(e) => onSwitchChange(device, e.value, deviceStates[device.device_id]?.brightness)}
                                                />
                                                <div className="flex items-center">
                                                    <Knob
                                                        value={deviceStates[device.device_id]?.brightness || 100}
                                                        onChange={(e) => {
                                                            onKnobChange(device, deviceStates[device.device_id]?.isOn, e.value, true);
                                                            debouncedKnobChange(device, deviceStates[device.device_id]?.isOn, e.value);
                                                        }}
                                                        valueTemplate="{value}%"
                                                        size={60}
                                                        strokeWidth={8}
                                                        valueColor="#5E85ED"
                                                        disabled={!deviceStates[device.device_id]?.isOn || device.status !== 'active'}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {device.status === 'active' && (device.category === 'Gate' || device.category === 'Lock') && (
                                            <InputSwitch
                                                checked={deviceStates[device.device_id]?.isOn || false}
                                                onChange={(e) => onSwitchChange(device, e.value)}
                                            />
                                        )}
                                        {device.status === 'active' && device.category === 'Heating' && (
                                            <>
                                            <HeatPumpController 
                                                devices={devices}
                                                deviceStates={deviceStates}
                                                sensorValue={sensorValue}
                                                onUpdateDeviceState={updateDeviceState}
                                            />
                                                <InputSwitch
                                                    checked={deviceStates[device.device_id]?.isOn || false}
                                                    onChange={(e) => onSwitchChange(device, e.value, deviceStates[device.device_id]?.temperature)}
                                                />
                                                <div className="flex items-center">
                                                    <Knob
                                                        value={deviceStates[device.device_id]?.temperature || 20}
                                                        onChange={(e) => onKnobChange(device, deviceStates[device.device_id]?.isOn, e.value)}
                                                        valueTemplate="{value}°C"
                                                        min={15}
                                                        max={30}
                                                        size={60}
                                                        strokeWidth={8}
                                                        valueColor="#5E85ED"
                                                        disabled={!deviceStates[device.device_id]?.isOn || device.status !== 'active'}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <Button
                                            icon="pi pi-ellipsis-v"
                                            className="p-button-text p-button-secondary"
                                            onClick={() => setVisibleActions(visibleActions === device.device_id ? null : device.device_id)}
                                        />
                                        <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {visibleActions === device.device_id && (
                                            <div className="absolute top-full gap-2 mt-2 right-0 bg-gray-800 rounded shadow-lg p-2 flex flex-col z-10">
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

            <div className="flex flex-column h-[80vh] items-center justify-center">
                <div className={`absolute w-[100%] h-[100%] flex justify-center ${loading}`}>
                    <ProgressSpinner strokeWidth={5} className={`absolute flex z-50 ${loading}`} />
                </div>
                <div className={`!bg-slate-800 flex-row gap-[2vw] flex justify-center items-center w-[100%] ${blur}`}>
                    <Dialog
                        header="Found devices"
                        visible={panelVisible1}
                        className="max-w-3xl"
                        style={{ width: '1000px' }}
                        onHide={() => { if (!panelVisible1) return; setPanelVisible1(false); }}
                        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
                    >
                        <div className="flex flex-row">
                            <div className="w-[40%]">
                                {newDevices === "" ? 
                                    <h1>Loading...</h1> 
                                    :
                                    <>
                                        <div className="grid grid-cols-2 font-semibold px-2 py-4">
                                            <p>Name</p>
                                            <p>Status</p>
                                        </div>
                                        {newDevices.map(el => (
                                            <div 
                                                className={`grid grid-cols-2 px-2 py-2 border-y-[1px] border-slate-600 hover:bg-slate-700 ${el.hidden ? "hidden" : ""}`}
                                                onClick={() => setFields(el.name, el.status)}
                                            >
                                                <p>{el.name}</p>
                                                <p>{el.status}</p>
                                            </div>
                                        ))}
                                    </>
                                }
                            </div>
                            <div className="px-2 pt-4 gap-4 flex flex-col items-center w-[60%]">
                                <>
                                <p className="font-semibold">Set your devices - {name}</p>

                                    <InputText 
                                        placeholder="label" 
                                        id="label" 
                                        className="!w-64" 
                                        value={label} 
                                        onChange={(e) => setLabel(e.target.value)} 
                                    />

                                    <Dropdown 
                                        value={selectedRoom} 
                                        onChange={(e) => setSelectedRoom(e.value)} 
                                        options={rooms} 
                                        id="room_id" 
                                        optionLabel="Room"
                                        placeholder="Select room" 
                                        className="!w-64" 
                                    />

                                    <Dropdown 
                                        value={selectedCategory} 
                                        onChange={(e) => setSelectedCategory(e.value)} 
                                        options={categories} 
                                        id="category_id" 
                                        optionLabel="Device category"
                                        placeholder="Select device category" 
                                        className="!w-64" 
                                    />

                                    <InputText 
                                        placeholder="Say to turn on" 
                                        id="command_on" 
                                        className="!w-64" 
                                        value={command_on} 
                                        onChange={(e) => setCommand_on(e.target.value)} 
                                    />

                                    <InputText 
                                        placeholder="Say to turn off" 
                                        id="command_off" 
                                        className="!w-64" 
                                        value={command_off} 
                                        onChange={(e) => setCommand_off(e.target.value)} 
                                    />

                                    <Button label="Save" onClick={saveDevice} />
                                </>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog
                        header="Add devices from list"
                        className="max-w-3xl"
                        visible={panelVisible2}
                        onHide={() => { if (!panelVisible2) return; setPanelVisible2(false); }}
                        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
                    >
                        <div className="flex flex-row">
                            <div className="w-[40%]">
                                {devicesList === "" ? 
                                    <h1>Loading...</h1> 
                                    :
                                    <>
                                        <div className="grid grid-cols-2 font-semibold px-2 py-4">
                                            <p>Name</p>
                                            <p>Category</p>
                                        </div>
                                        <div className="">
                                            {devicesList.map(el => (
                                                <div 
                                                    className="grid grid-cols-2 px-2 gap-6 py-2 border-y-[1px] border-slate-600 hover:bg-slate-700"
                                                    onClick={() => setFields(el.name, "not-active")}
                                                >
                                                    <p>{el.name}</p>
                                                    <p>{el.category}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="px-2 pt-4 gap-4 flex flex-col items-center w-[60%]">
                                <>
                                    {formVisible ? 
                                        <p className="font-semibold">Set your devices - {name}</p> 
                                        : 
                                        <p className="font-semibold">Select device</p>
                                    }

                                    <InputText 
                                        placeholder="label" 
                                        id="label" 
                                        className="!w-64" 
                                        value={label} 
                                        onChange={(e) => setLabel(e.target.value)} 
                                    />

                                    <Dropdown 
                                        value={selectedRoom} 
                                        onChange={(e) => setSelectedRoom(e.value)} 
                                        options={rooms} 
                                        id="room_id" 
                                        optionLabel="Room"
                                        placeholder="Select room" 
                                        className="!w-64" 
                                    />

                                    <InputText 
                                        placeholder="Say to turn on" 
                                        className="!w-64" 
                                        id="command_on" 
                                        value={command_on} 
                                        onChange={(e) => setCommand_on(e.target.value)} 
                                    />

                                    <InputText 
                                        placeholder="Say to turn off" 
                                        className="!w-64" 
                                        id="command_off" 
                                        value={command_off} 
                                        onChange={(e) => setCommand_off(e.target.value)} 
                                    />

                                    <Dropdown 
                                        value={selectedProtocol} 
                                        onChange={(e) => setSelectedProtocol(e.value)} 
                                        options={protocols} 
                                        id="protocol_id" 
                                        optionLabel="Protocol"
                                        placeholder="Select protocol" 
                                        className="!w-64" 
                                    />

                                    {selectedProtocol && showFormFields()}
                                    {formVisible && <Button label="Save" onClick={saveDeviceManually} />}
                                </>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </>
    );
}