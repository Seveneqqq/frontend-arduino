import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { HeaderDashboard } from '../components/dashboard-header'
import ActivityTab from '../components/dashboard-tabs/activity-tab';
import DevicesTab from '../components/dashboard-tabs/devices-tab';
import AutomationTab from '../components/dashboard-tabs/automation-tab';
import SettingsTab from '../components/dashboard-tabs/settings-tab';
import AccountTab from '../components/dashboard-tabs/account-tab';
import TasksComponent from '../components/tasksComponents';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { Knob } from 'primereact/knob';
import ChatComponent from '../components/chatComponent';
import _ from 'lodash';
import { io } from 'socket.io-client';

const DeviceItem = React.memo(({ 
    device, 
    deviceState, 
    onSwitchChange, 
    onKnobChange, 
    dialogCategory 
}) => {
    const debouncedKnobChange = React.useCallback(
        _.debounce((newValue) => {
            onKnobChange(device, true, newValue, false);
        }, 200),
        [device, onKnobChange]
    );

    return (
        <div 
            className={`p-4 rounded-xl flex justify-between items-center
                ${device.status === 'active' ? 'bg-[#1E1E1C]' : 'bg-[#111111]'}`}
        >
            <div>
                <h3 className="text-lg font-semibold">{device.label} ( {device.name} )</h3>
                <p className={`text-sm ${device.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                    {device.status}
                </p>
            </div>
            <div className="flex gap-3 items-center">
                {device.status === 'active' && (
                    <InputSwitch 
                        checked={deviceState?.isOn || false}
                        onChange={(e) => onSwitchChange(device, e.value, device.category === 'Light' ? deviceState?.brightness : deviceState?.temperature)}
                    />
                )}
                {dialogCategory === 'Light' && (
                    <div className="flex items-center">
                        <Knob 
                            value={deviceState?.brightness || 100}
                            onChange={(e) => {
                                const newValue = e.value;
                                onKnobChange(device, true, newValue, true);
                                debouncedKnobChange(newValue);
                            }}
                            valueTemplate="{value}%"
                            size={70}
                            strokeWidth={8}
                            valueColor="#5E85ED"
                            disabled={!deviceState?.isOn || device.status !== 'active'}
                        />
                    </div>
                )}
                {dialogCategory === 'Heating' && (
                    <div className="flex items-center">
                        <Knob 
                            value={deviceState?.temperature || 20}
                            onChange={(e) => {
                                const newValue = e.value;
                                onKnobChange(device, true, newValue, true);
                                debouncedKnobChange(newValue);
                            }}
                            valueTemplate="{value}°C"
                            min={15}
                            max={30}
                            size={70}
                            strokeWidth={8}
                            valueColor="#5E85ED"
                            disabled={!deviceState?.isOn || device.status !== 'active'}
                        />
                    </div>
                )}
                <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
        </div>
    );
});

const DialogWithDeviceFamily = React.memo(({ 
    visible, 
    setVisible, 
    devices, 
    dialogCategory,
    deviceStates,
    onUpdateDeviceState
}) => {
    const filteredDevices = useMemo(() => 
        devices
            .filter(device => device.category === dialogCategory)
            .sort((a, b) => {
                if (a.status === 'active' && b.status !== 'active') return -1;
                if (a.status !== 'active' && b.status === 'active') return 1;
                return 0;
            }),
        [devices, dialogCategory]
    );

    return (
        <Dialog 
            header={dialogCategory}
            visible={visible}
            className='max-w-[800px] w-[100%] md:m-0 m-5 border-2'
            contentStyle={{ backgroundColor: '#151513' }}
            headerStyle={{ backgroundColor: '#151513' }}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
            onHide={() => {if (!visible) return; setVisible(false); }}
        >
            <div className="flex flex-col gap-4">
                {filteredDevices.map((device) => (
                    <DeviceItem
                        key={device.device_id}
                        device={device}
                        deviceState={deviceStates[device.device_id]}
                        onSwitchChange={onUpdateDeviceState}
                        onKnobChange={onUpdateDeviceState}
                        dialogCategory={dialogCategory}
                    />
                ))}
            </div>
        </Dialog>
    );
});

export default function PanelDashboard() {
    const scrollRef = useRef(null);
    const op = useRef(null);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [notifications, setNotifications] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [wasDragged, setWasDragged] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [microphoneActivated, setMicrophoneActivated] = useState(false);
    const [microphoneActivatedColor, setMicrophoneActivatedColor] = useState('bg-[#080808]');
    const [notificationsActivated, setNotificationsActivated] = useState(false);
    const [notificationsActivatedColor, setNotificationsActivatedColor] = useState('bg-[#080808]');
    const [devices, setDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dialogCategory, setDialogCategory] = useState();
    const [deviceStates, setDeviceStates] = useState({});
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [sensorValue, setSensorValue] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
            const socket = io('http://localhost:4000', {
                transports: ['websocket']
            });
    
            socket.on('connect', () => {
                console.log('Connected to server');
                setIsConnected(true);
                startSensorReading();
            });
    
            socket.on('disconnect', () => {
                console.log('Disconnected from server');
                setIsConnected(false);
            });
    
            socket.on('sensorData', (data) => { 
                setSensorValue(data);
            });
    
            return () => {
                socket.disconnect();
            };

        }, []);

    useEffect(() => {
        if (devices.length > 0) {
            const initialStates = {};
            devices.forEach(device => {
                const id = device.device_id;
                if (!deviceStates[id]) {
                    initialStates[id] = {
                        isOn: false,
                        brightness: 100,
                        temperature: 24 
                    };
                }
            });
            if (Object.keys(initialStates).length > 0) {
                setDeviceStates(prev => ({
                    ...prev,
                    ...initialStates
                }));
            }
        }
    }, [devices, deviceStates]);

    const startSensorReading = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/home/app-start');
            const data = await response.json();
            console.log('Sensor reading started:', data);
        } catch (error) {
            console.error('Error starting sensors:', error);
        }
    };

    const updateDeviceState = useCallback(async (device, newState, newValue, isLocalUpdate = false) => {
        setDeviceStates(prev => ({
            ...prev,
            [device.device_id]: {
                ...prev[device.device_id],
                isOn: newState !== undefined ? newState : prev[device.device_id]?.isOn || false,
                brightness: device.category === 'Light' ? 
                    (newValue !== undefined ? newValue : prev[device.device_id]?.brightness || 100) : 
                    prev[device.device_id]?.brightness || 100,
                temperature: device.category === 'Heating' ? 
                    (newValue !== undefined ? newValue : prev[device.device_id]?.temperature || 20) : 
                    prev[device.device_id]?.temperature || 20
            }
        }));
      
        if (isLocalUpdate || device.status !== 'active') return;
        
        try {
            const actionValue = device.category === 'Heating' ? 
                (newValue !== undefined ? newValue : deviceStates[device.device_id]?.temperature || 20) :
                (newValue !== undefined ? newValue : deviceStates[device.device_id]?.brightness || 100);
    
            const payload = {
                homeId: device.home_id,
                device: {
                    deviceName: device.name,
                    category: device.category,
                    label: device.label,
                    status: device.status
                },
                actions: {
                    state: newState ? 1 : 0
                }
            };
    
            if (device.category === 'Heating') {
                payload.actions.temperature = actionValue;
            } else if (device.category === 'Light') {
                payload.actions.brightness = actionValue;
            }
    
            const response = await fetch('http://localhost:4000/api/home/do', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error updating device state:', error);
        }
    }, [deviceStates]);

    useEffect(() => {
        let recognition = null;

        const createDeviceCommands = () => {
            if (!devices || devices.length === 0) {
                return [];
            }

            return devices.map(device => ({
                name: device.name,
                label: device.label,
                commands: [
                    device.label,
                    `włącz ${device.label}`,
                    `wyłącz ${device.label}`,
                    `włącz ${device.name}`,
                    `wyłącz ${device.name}`,
                    device.command_on || 'light',
                    device.command_off || 'light off'
                ]
            }));
        };

        const startRecording = () => {
            try {
                if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
                    console.error('Twoja przeglądarka nie obsługuje rozpoznawania mowy');
                    return;
                }

                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();

                if (!recognition) {
                    console.error('Nie udało się włączyć rozpoznawania mowy');
                    return;
                }

                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'pl-PL';

                recognition.onstart = () => {
                    console.log('Rozpoczęto nasłuchiwanie');
                };

                recognition.onresult = (event) => {
                    if (!event.results || !event.results[0]) {
                        return;
                    }

                    const transcript = event.results[0][0].transcript.toLowerCase();
                    console.log('Rozpoznany tekst:', transcript);

                    const deviceCommands = createDeviceCommands();
                    deviceCommands.forEach(device => {
                        if (device.commands.some(cmd => transcript.includes(cmd.toLowerCase()))) {
                            console.log('Wykryto komendę dla urządzenia:', device.name);
                        }
                    });
                };

                recognition.onerror = (event) => {
                    console.error('Błąd rozpoznawania:', event.error);
                    
                    if (event.error === 'not-allowed') {
                        console.error('Brak dostępu do mikrofonu');
                        setMicrophoneActivated(false);
                        setMicrophoneActivatedColor('bg-[#080808]');
                    }
                };

                recognition.onend = () => {
                    if (microphoneActivated && recognition) {
                        setTimeout(() => {
                            try {
                                recognition.start();
                            } catch (error) {
                                console.error('Błąd przy restarcie:', error);
                            }
                        }, 200);
                    }
                };

                recognition.start();

            } catch (error) {
                console.error('Błąd podczas inicjalizacji rozpoznawania mowy:', error);
                setMicrophoneActivated(false);
                setMicrophoneActivatedColor('bg-[#080808]');
            }
        };

        if (microphoneActivated) {
            startRecording();
        }

        return () => {
            if (recognition) {
                try {
                    recognition.stop();
                    recognition = null;
                } catch (error) {
                    console.error('Błąd podczas zatrzymywania rozpoznawania:', error);
                }
            }
        };
    }, [microphoneActivated, devices]);

    const fetchDevices = async() => {
        const response = await fetch(`http://localhost:4000/api/home/get-devices`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            },
            body: JSON.stringify({
                home_id: sessionStorage.getItem('selected-home-id')
            })
        });

        const data = await response.json();
        setDevices(data.devices);
        setCategories(data.categories);
    }

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setWasDragged(false); 
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.1;
        scrollRef.current.scrollLeft = scrollLeft - walk;
        setWasDragged(true); 
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    const handleCardClick = () => {
        if (!wasDragged) {
            setVisible(true);
        }
        setWasDragged(false);
    }

    const microphoneActivate = () => {
        setMicrophoneActivated(!microphoneActivated);
        setMicrophoneActivatedColor(microphoneActivated? 'bg-[#080808]' : 'bg-[#5E85ED]');
    }

    const activateNofitications = (forceClose = false) => {
        const newState = forceClose ? false : !notificationsActivated;
        setNotificationsActivated(newState);
        setNotificationsActivatedColor(newState ? 'bg-[#5E85ED]' : 'bg-[#080808]');
    }

    const handleSwitchChange = useCallback(
        (device, newState, newBrightness, isLocalUpdate) => {
          updateDeviceState(device, newState, newBrightness, isLocalUpdate);
        },
        [updateDeviceState]
      );
    
      const handleKnobChange = (device, newState, newBrightness, isLocalUpdate) => {
        updateDeviceState(device, newState, newBrightness, isLocalUpdate);
      };
    
      const handleEditDevice = (device) => {
        setSelectedDevice(device);
        // edytowanie urzadzen
      };
    
      const handleDeleteDevice = (device) => {
        setSelectedDevice(device);
        // usuwanie urzadzen
      };

      


    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return (
                    <div className="flex-1 px-5 py-5 flex flex-col gap-5">
                        <div
                            ref={scrollRef}
                            className="flex gap-5 md:overflow-x-hidden overflow-x-scroll select-none px-2"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {categories && categories.map((category, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => {
                                        handleCardClick();
                                        setDialogCategory(category.category);
                                    }}
                                    className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
                                >
                                    <h3 className="text-xl mb-2">{category.category}</h3>
                                    <p className="text-2xl font-bold text-[#C7EE7C]">{category.count}</p>
                                    <p className="text-sm text-gray-400">{category.count > 1 ? "Devices" : "Device"}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-none lg:grid-rows-5 gap-4 bg-[#151513] rounded-xl px-5 py-5 flex-1">
                            <div className="bg-[#B68CFA] rounded-xl p-6 min-h-[100px]">
                                {sensorValue !== null && devices.some(device => 
                                    device.status === 'active' && 
                                    device.name === 'temperature and humidity sensor'
                                ) ? (
                                    <div className="flex items-center gap-5">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="32px"  viewBox="0 -960 960 960"  fill="#e8eaed"><path d="M520-520v-80h200v80H520Zm0-160v-80h320v80H520ZM320-120q-83 0-141.5-58.5T120-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T320-120ZM200-320h240q0-29-12.5-54T392-416l-32-24v-280q0-17-11.5-28.5T320-760q-17 0-28.5 11.5T280-720v280l-32 24q-23 17-35.5 42T200-320Z"/></svg>
                                        <div>
                                            <span className="text-md text-white/80 font-semibold">Interior temperature :</span>
                                            <div className="flex mt-1 items-center gap-1">
                                                <span className="text-2xl font-semibold font-sans">
                                                    {sensorValue.temperature || '-'}
                                                </span>
                                                <span className="ml-1 text-lg">°C</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <i className="pi pi-exclamation-circle"></i>
                                        {devices.some(device => device.name === 'temperature and humidity sensor') ? (
                                            <h2 className="text-xl font-semibold">Sensor not connected</h2>
                                        ) : (
                                            <h2 className="text-xl font-semibold">No sensor added</h2>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#CB50CB] rounded-xl p-6 min-h-[100px] lg:col-start-1 lg:row-start-2">
                                {sensorValue !== null && devices.some(device => 
                                    device.status === 'active' && 
                                    device.name === 'temperature and humidity sensor'
                                )? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-5">
                                            <i className="pi pi-cloud text-2xl"></i>
                                            <div>
                                                <span className="text-md text-white/80 font-semibold">Humidity level :</span>
                                                <div className="flex mt-1 items-center gap-1">
                                                    <span className="text-2xl font-semibold">
                                                        {sensorValue.humidity || '-'}
                                                    </span>
                                                    <span className="ml-1 text-lg">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <i className="pi pi-exclamation-circle"></i>
                                        {devices.some(device => device.name === 'temperature and humidity sensor') ? (
                                            <h2 className="text-xl font-semibold">Sensor not connected</h2>
                                        ) : (
                                            <h2 className="text-xl font-semibold">No sensor added</h2>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:row-span-2 lg:col-start-2 lg:row-start-1">Kamera z mozliwoscia przewijania na inne ?</div>
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1"><TasksComponent /></div>
                            <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:row-span-2 lg:row-start-3">Jakies losowe urzadzenie w ktorym beda rozne opcje w zaleznosci od urzadzenia</div>
                            <div className="bg-[#be992a] rounded-xl p-6 min-h-[100px] lg:col-start-1 lg:row-start-5">Jeszcze nie wiadomo co - scenariusz albo cos innego</div>
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:col-span-2 lg:row-span-3 lg:col-start-2 lg:row-start-3"><ChatComponent /></div>
                            <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:row-span-2 lg:col-start-4 lg:row-start-3">otwieranie bramy/drzwi</div>
                            <div className="bg-[#B68CFA] rounded-xl p-6 min-h-[100px] lg:col-start-4 lg:row-start-5">Scenariusz</div>
                        </div>
                    </div>
                );
            case 'automation':
                return (
                    <div className="flex-1 px-5 py-5">
                        <div className="bg-[#151513] rounded-xl p-6 h-full">
                            <AutomationTab devices={devices} deviceStates={deviceStates}/>
                        </div>
                    </div>
                );
            case 'devices':
                return (
                    <div className="flex-1 px-5 py-5">
                        <div className="bg-[#151513] rounded-xl p-6 h-full">
                        <DevicesTab
                          devices={devices}
                          deviceStates={deviceStates}
                          onEditDevice={handleEditDevice}
                          onDeleteDevice={handleDeleteDevice}
                          onSwitchChange={updateDeviceState}
                          onKnobChange={updateDeviceState}
                        />
                        </div>
                    </div>
                );
            case 'activity':
                return (
                    <div className="flex-1 px-5 py-5">
                        <div className="bg-[#151513] rounded-xl p-6 h-full">
                            <h2 className="text-2xl mb-4">Activity</h2>
                            <ActivityTab/>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="flex-1 px-5 py-5">
                        <div className="bg-[#151513] rounded-xl p-6 h-full">
                            <h2 className="text-2xl mb-4">Settings</h2>
                            <SettingsTab/>
                        </div>
                    </div>
                );
            case 'account':
                return (
                    <div className="flex-1 px-5 py-5">
                        <div className="bg-[#151513] rounded-xl p-6 h-full">
                            <h2 className="text-2xl mb-4">Account</h2>
                            <AccountTab/>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-[#080808] min-h-screen flex flex-col">
            <HeaderDashboard
                microphoneActivatedColor={microphoneActivatedColor}
                notificationsActivatedColor={notificationsActivatedColor}
                microphoneActivate={microphoneActivate}
                op={op}
                activateNofitications={activateNofitications}
                notifications={notifications}
                onTabChange={setActiveTab}
                activeTab={activeTab}
            />           
            {renderContent()}
            <DialogWithDeviceFamily 
                visible={visible}
                setVisible={setVisible}
                devices={devices}
                dialogCategory={dialogCategory}
                deviceStates={deviceStates}
                onUpdateDeviceState={updateDeviceState}
            />
        </div>
    );
}
