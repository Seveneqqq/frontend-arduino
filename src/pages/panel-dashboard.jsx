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
import ScenarioComponent from '../components/scenarioComponent';
import _ from 'lodash';
import { io } from 'socket.io-client';
import SensorAlarmComponent from '../components/sensorAlarmComponent';
import CameraStreamComponent from '../components/cameraStreamComponent';
import StatisticCompomnent from '../components/statisticCompomnent';
import FrontGateComponent from '../components/frontGateComponent';
import { Toast } from 'primereact/toast';
import SessionTimedOut from '../components/sessionTimedOut';
import HeatPumpController from '../components/heatPumpController';

const DeviceItem = React.memo(({ 
    device, 
    deviceState, 
    onSwitchChange, 
    onKnobChange, 
    dialogCategory 
}) => {
    const debouncedKnobChange = React.useCallback(
        _.debounce((newValue) => {
            if (device.name !== 'HEAT_PUMP') {
                onKnobChange(device, true, newValue, false);
            }
        }, 200),
        [device, onKnobChange]
    );

    const handleSwitchChange = (e) => {
        if (device.name === 'HEAT_PUMP') {
            onSwitchChange(device, e.value, deviceState?.temperature, true);
        } else {
            onSwitchChange(device, e.value, device.category === 'Light' ? deviceState?.brightness : deviceState?.temperature);
        }
    };

    const handleKnobChange = (e) => {
        const newValue = e.value;
        if (device.name === 'HEAT_PUMP') {
            onKnobChange(device, true, newValue, true);
        } else {
            onKnobChange(device, true, newValue, true);
            debouncedKnobChange(newValue);
        }
    };

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
                {device.status === 'active' && device.category !== 'Sensor' && (
                    <InputSwitch 
                        checked={deviceState?.isOn || false}
                        onChange={handleSwitchChange}
                    />
                )}
                {dialogCategory === 'Light' && (
                    <div className="flex items-center">
                        <Knob 
                            value={deviceState?.brightness || 100}
                            onChange={handleKnobChange}
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
                            onChange={handleKnobChange}
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
    const socketRef = useRef(null);
    const toast = useRef(null);

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
    const [temperatureRange, setTemperatureRange] = useState([]);
    const [humidityRange, setHumidityRange] = useState([]);
    const [alarmActivated, setAlarmActivated] = useState(false);
    const [alarmReasons, setAlarmReasons] = useState({});
    const [cameraAdded, setCameraAdded] = useState(false);
    const [cameraAddress, setCameraAddress] = useState("");
    const [isCameraEditing, setIsCameraEditing] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    
    const [scenarios, setScenarios] = useState([]);
    const [scenariosStates, setScenariosStates] = useState({});

useEffect(() => {
    const socket = io('http://localhost:4000', {
        transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        socket.emit('joinHome', sessionStorage.getItem('selected-home-id'));
        startSensorReading();
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
    });

    socket.on('receiveNotification', (data) => {
        setNotifications(prev => [{
            id: Date.now(),
            text: data.message,
            timestamp: new Date(),
            read: false,
            type: data.type
        }, ...prev]);

        console.log('Received notification');
        setNotificationsActivated(true);
        setNotificationsActivatedColor('bg-[#5E85ED]');
    });

    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };
}, []);

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

const saveAlarmAndNotify = useCallback(async (alarmData) => {
    try {
        const response = await fetch('http://localhost:4000/api/mongodb/alarms/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            },
            body: JSON.stringify(alarmData)
        });

        if (response.status === 401 || response.status === 403) {
            setSessionExpired(true);
            return;
        }

        if (response.ok) {
            const notificationText = `${alarmData.type === 'temperature' ? 'Temperature' : 'Humidity'} 
                ${alarmData.status === 'alert' ? 'out of range' : 'returned to normal'}: 
                ${alarmData.value} ${alarmData.type === 'temperature' ? '°C' : '%'}`;

            if (socketRef.current) {
                socketRef.current.emit('newNotification', {
                    homeId: sessionStorage.getItem('selected-home-id'),
                    message: notificationText,
                    type: 'alarm',
                    timestamp: new Date()
                });
            }

            setNotifications(prev => [{
                id: Date.now(),
                text: notificationText,
                timestamp: new Date(),
                read: false,
                type: 'alarm'
            }, ...prev]);
        }
    } catch (error) {
        console.error('Error saving alarm:', error);
    }
}, []);


useEffect(() => {
    if (!socketRef.current) return;

    const handleSensorData = (data) => {
        setSensorValue(data);
        
        const tempOutOfRange = data.temperature < temperatureRange[0] || data.temperature > temperatureRange[1];
        const humOutOfRange = data.humidity < humidityRange[0] || data.humidity > humidityRange[1];

        if (tempOutOfRange && !alarmReasons.temperature) {
            saveAlarmAndNotify({
                type: 'temperature',
                status: 'alert',
                value: data.temperature,
                range: temperatureRange,
                home_id: sessionStorage.getItem('selected-home-id')
            });
            setAlarmReasons(prev => ({
                ...prev,
                temperature: true
            }));
        } else if (!tempOutOfRange && alarmReasons.temperature) {
            saveAlarmAndNotify({
                type: 'temperature',
                status: 'resolved',
                value: data.temperature,
                range: temperatureRange,
                home_id: sessionStorage.getItem('selected-home-id')
            });
            setAlarmReasons(prev => ({
                ...prev,
                temperature: false
            }));
        }

        if (humOutOfRange && !alarmReasons.humidity) {
            saveAlarmAndNotify({
                type: 'humidity',
                status: 'alert',
                value: data.humidity,
                range: humidityRange,
                home_id: sessionStorage.getItem('selected-home-id')
            });
            setAlarmReasons(prev => ({
                ...prev,
                humidity: true
            }));
        } else if (!humOutOfRange && alarmReasons.humidity) {
            saveAlarmAndNotify({
                type: 'humidity',
                status: 'resolved',
                value: data.humidity,
                range: humidityRange,
                home_id: sessionStorage.getItem('selected-home-id')
            });
            setAlarmReasons(prev => ({
                ...prev,
                humidity: false
            }));
        }

        setAlarmActivated(tempOutOfRange || humOutOfRange);
    };

    socketRef.current.on('sensorData', handleSensorData);

    return () => {
        socketRef.current?.off('sensorData', handleSensorData);
    };
}, [temperatureRange, humidityRange, alarmReasons, saveAlarmAndNotify]);


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


    useEffect(() => {
        fetchAlarmSettings();
    }, []); 

    const fetchAlarmSettings = async () => {
        try {
            console.log('Fetching alarm settings for home:', sessionStorage.getItem('selected-home-id'));
            
            const response = await fetch(`http://localhost:4000/api/mongodb/alarms/${sessionStorage.getItem('selected-home-id')}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                }
            });
    
            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch alarm settings');
            }
    
            const data = await response.json();
            console.log('Received alarm data:', data);
            
            if (data && Array.isArray(data.temperatureRange) && Array.isArray(data.humidityRange)) {
                console.log('Setting new ranges:', {
                    temperature: data.temperatureRange,
                    humidity: data.humidityRange
                });
                setTemperatureRange(data.temperatureRange);
                setHumidityRange(data.humidityRange);
            } else {
                console.error('Invalid data format received:', data);
                setTemperatureRange([19, 24]);
                setHumidityRange([40, 60]);
            }
        } catch (error) {
            console.error('Error fetching alarm settings:', error);
            setTemperatureRange([19, 24]);
            setHumidityRange([40, 60]);
        }
    };

    const startSensorReading = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/home/app-start');
            const data = await response.json();
            console.log('Sensor reading started:', data);

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }

        } catch (error) {
            console.error('Error starting sensors:', error);
        }
    };

    const updateDeviceState = useCallback(async (device, newState, newValue, isLocalUpdate = false) => {
        // Zawsze aktualizuj stan lokalny
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
      
        // Nie wysyłaj sygnału jeśli:
        // - to jest aktualizacja lokalna
        // - urządzenie nie jest aktywne
        // - to jest pompa ciepła (nią zarządza HeatPumpController)
        if (isLocalUpdate || device.status !== 'active' || device.name === 'HEAT_PUMP') {
            return;
        }
        
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
    
            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true);
                return;
            }
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error updating device state:', error);
        }
    }, [deviceStates]);

    useEffect(() => {
        let recognition = null;
    
        const createCommands = () => {
            const deviceCommands = !devices ? [] : devices.map(device => {
                const baseCommands = [];
        
                const turnOnCommands = !device.command_on?.toLowerCase().includes('włącz') 
                    ? [`włącz ${device.label}`] 
                    : [];
                    
                const turnOffCommands = !device.command_off?.toLowerCase().includes('wyłącz')
                    ? [`wyłącz ${device.label}`]
                    : [];
    
                // Komendy ustawiania wartości tylko dla świateł i ogrzewania
                let setCommands = [];
                if (device.category === 'Light' || device.category === 'Heating') {
                    setCommands = [`${device.label} ustaw`];
                }
        
                return {
                    type: 'device',
                    device_id: device.device_id,
                    name: device.name,
                    label: device.label,
                    category: device.category,
                    status: device.status,
                    command_on: device.command_on,
                    command_off: device.command_off,
                    commands: [
                        ...baseCommands,
                        ...turnOnCommands,
                        ...turnOffCommands,
                        ...setCommands,
                        device.command_on,
                        device.command_off
                    ].filter(Boolean)
                };
            });
        
            const scenarioCommands = !scenarios ? [] : scenarios.map(scenario => {
                const turnOnCommand = !scenario.scenarioTurnOn?.toLowerCase().includes('włącz')
                    ? [`włącz ${scenario.name}`]
                    : [];
                    
                const turnOffCommand = !scenario.scenarioTurnOff?.toLowerCase().includes('wyłącz')
                    ? [`wyłącz ${scenario.name}`]
                    : [];
        
                return {
                    type: 'scenario',
                    id: scenario._id,
                    name: scenario.name,
                    commands: [
                        ...turnOnCommand,
                        ...turnOffCommand,
                        scenario.scenarioTurnOn,
                        scenario.scenarioTurnOff
                    ].filter(Boolean),
                    devices: scenario.devices
                };
            });
        
            return [...deviceCommands, ...scenarioCommands];
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
    
                    const commands = createCommands();
                    commands.forEach(item => {
                        if (item.commands.some(cmd => transcript.includes(cmd?.toLowerCase()))) {
                            if (item.type === 'device') {
                                console.log('Wykryto komendę dla urządzenia:', item.name);
                                
                                if (item.status !== 'active') {
                                    console.log('Urządzenie nieaktywne');
                                    return;
                                }
    
                                // Sprawdzanie czy wypowiedziana komenda to dokładnie command_on lub command_off
                                if (transcript.includes(item.command_on?.toLowerCase())) {
                                    const value = item.category === 'Light' ? 
                                        deviceStates[item.device_id]?.brightness || 100 :
                                        item.category === 'Heating' ? 
                                        deviceStates[item.device_id]?.temperature || 24 : 
                                        undefined;
                                        
                                    updateDeviceState(item, true, value);
                                } else if (transcript.includes(item.command_off?.toLowerCase())) {
                                    updateDeviceState(item, false);
                                } 
                                // Sprawdzanie standardowych komend włącz/wyłącz
                                else if (transcript.includes('włącz')) {
                                    const value = item.category === 'Light' ? 
                                        deviceStates[item.device_id]?.brightness || 100 :
                                        item.category === 'Heating' ? 
                                        deviceStates[item.device_id]?.temperature || 24 : 
                                        undefined;
                                        
                                    updateDeviceState(item, true, value);
                                } else if (transcript.includes('wyłącz')) {
                                    updateDeviceState(item, false);
                                } else if (transcript.includes('ustaw')) {
                                    const matches = transcript.match(/ustaw (\d+)/);
                                    if (matches && matches[1]) {
                                        const value = parseInt(matches[1]);
                                        
                                        if (item.category === 'Light' && value >= 0 && value <= 100) {
                                            // Dla świateł - jasność 0-100
                                            updateDeviceState(item, true, value);
                                        } else if (item.category === 'Heating' && value >= 10 && value <= 36) {
                                            // Dla ogrzewania - temperatura 10-36
                                            updateDeviceState(item, true, value);
                                        } else {
                                            console.log('Nieprawidłowa wartość dla tego typu urządzenia');
                                        }
                                    }
                                }
                            } else if (item.type === 'scenario') {
                                console.log('Wykryto komendę dla scenariusza:', item.name);
                                
                                if (transcript.includes('włącz') || transcript.includes(item.scenarioTurnOn?.toLowerCase())) {
                                    setScenariosStates(prev => ({
                                        ...prev,
                                        [item.id]: true
                                    }));
    
                                    // Wykonaj akcje dla wszystkich urządzeń w scenariuszu
                                    item.devices.forEach(device => {
                                        if (device.status === 'active') {
                                            updateDeviceState(device, device.actions.state === 1, 
                                                device.category === 'Light' ? device.actions.brightness : 
                                                device.category === 'Heating' ? device.actions.temperature : 
                                                undefined
                                            );
                                        }
                                    });
                                } else if (transcript.includes('wyłącz') || transcript.includes(item.scenarioTurnOff?.toLowerCase())) {
                                    setScenariosStates(prev => ({
                                        ...prev,
                                        [item.id]: false
                                    }));
    
                                    // Wyłącz wszystkie urządzenia w scenariuszu
                                    item.devices.forEach(device => {
                                        if (device.status === 'active') {
                                            updateDeviceState(device, false);
                                        }
                                    });
                                }
                            }
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
    }, [microphoneActivated, devices, scenarios, updateDeviceState, deviceStates]);

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

        if (response.status === 401 || response.status === 403) {
            setSessionExpired(true);
            return;
        }

        const data = await response.json();
        console.log("ponizej dane urzadzen");
        console.log(data);
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
    
      const handleEditDevice = async (device) => {
        const response = await fetch(`http://localhost:4000/api/devices/${device.device_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            },
            body: JSON.stringify({
                label: device.label,
                command_on: device.command_on,
                command_off: device.command_off
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
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update device'
            });
        }
    };
    
    const handleDeleteDevice = async (device) => {
        const response = await fetch(`http://localhost:4000/api/devices/${device.device_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            },
            body:{
                label: device.label,
                room: device.room_id
            }
        });
    
        if (response.status === 401 || response.status === 403) {
            setSessionExpired(true);
            return;
        }

        if (response.ok) {
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Device deleted successfully'
            });
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete device'
            });
        }
    };

      const handleEditScenario = (scenario) => {
        //setSelectedScenario(scenario);
        // edytowanie scenariuszy
        console.log("Edit scenario");
      };

      const handleDeleteScenario = (scenario) => {
         //setSelectedScenario(scenario);
        // usuwanie scenariuszy
        console.log("Delete scenario");
      };

      const handleDeleteCamera = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/mongodb/camera/${sessionStorage.getItem('selected-home-id')}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            }
          });
      
          if (response.status === 401 || response.status === 403) {
            setSessionExpired(true);
            return;
        }

          if (response.ok) {
            setCameraAdded(false);
            setCameraAddress('');
          }
        } catch (error) {
          console.error('Error deleting camera:', error);
        }
      };
      
      const fetchCameraData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/mongodb/camera/${sessionStorage.getItem('selected-home-id')}`, {
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            }
          });

          if (response.status === 401 || response.status === 403) {
            setSessionExpired(true);
            return;
        }

          const data = await response.json();

          if (data) {
            if(data.error == "Camera not found"){
                setCameraAdded(false);
                setCameraAddress('');
            }
            else{
                setCameraAdded(true);
                setCameraAddress(data.camera_url);
            }
          }
        } catch (error) {
          console.error('Error fetching camera data:', error);
          setCameraAdded(false);
          setCameraAddress('');
        }
      };
      
      const handleSaveCamera = async (newUrl) => {
        console.log("handleSaveCamera called with:", newUrl);
        try {
          const response = await fetch('http://localhost:4000/api/mongodb/camera',{
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            },
            body: JSON.stringify({
              home_id: parseInt(sessionStorage.getItem('selected-home-id')),
              camera_url: newUrl
            })
          });
      
          if (response.status === 401 || response.status === 403) {
            setSessionExpired(true);
            return;
        }

          console.log("Response status:", response.status);
          const data = await response.json();
          console.log("Response data:", data);
      
          if (response.ok) {
            setCameraAdded(true);
            setCameraAddress(newUrl);
          }
        } catch (error) {
          console.error('Error saving camera:', error);
        }
      };

      useEffect(() => {
        fetchCameraData();
      }, []);

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return (
                    <div className="flex-1 px-5 py-5 flex flex-col gap-5">
                        <SessionTimedOut 
                            visible={sessionExpired} 
                            setVisible={setSessionExpired}
                        />
                        <HeatPumpController 
                            devices={devices}
                            deviceStates={deviceStates}
                            sensorValue={sensorValue}
                            onUpdateDeviceState={updateDeviceState}
                        />
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
                        <div className={`rounded-xl p-6 min-h-[100px] transition-colors duration-500 ease-in-out
                            ${alarmReasons.temperature ? 'bg-red-600' : 'bg-[#B68CFA]'}`}>
                                {sensorValue !== null && devices.some(device => 
                                    device.status === 'active' && 
                                    device.name === 'temperature and humidity sensor'
                                ) ? (
                                    <div className="flex items-center gap-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32px" viewBox="0 -960 960 960" fill="#e8eaed">
                                            <path d="M520-520v-80h200v80H520Zm0-160v-80h320v80H520ZM320-120q-83 0-141.5-58.5T120-320q0-48 21-89.5t59-70.5v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q38 29 59 70.5t21 89.5q0 83-58.5 141.5T320-120ZM200-320h240q0-29-12.5-54T392-416l-32-24v-280q0-17-11.5-28.5T320-760q-17 0-28.5 11.5T280-720v280l-32 24q-23 17-35.5 42T200-320Z"/>
                                        </svg>
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

                            <div className={`rounded-xl p-6 min-h-[100px] lg:col-start-1 lg:row-start-2 transition-colors duration-500 ease-in-out
                                ${alarmReasons.humidity ? 'bg-red-600' : 'bg-[#CB50CB]'}`}>
                                {sensorValue !== null && devices.some(device => 
                                    device.status === 'active' && 
                                    device.name === 'temperature and humidity sensor'
                                ) ? (
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
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:row-span-2 lg:col-start-2 lg:row-start-1"><CameraStreamComponent cameraAdded={cameraAdded} cameraAddress={cameraAddress} onSaveAddress={handleSaveCamera} onDeleteCamera={handleDeleteCamera} /></div>
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1"><TasksComponent /></div>
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:row-span-2 lg:row-start-3"><SensorAlarmComponent temperatureRange={temperatureRange} humidityRange={humidityRange} setTemperatureRange={setTemperatureRange} setHumidityRange={setHumidityRange} /></div>
                            <div className="bg-[#B68CFA] rounded-xl px-4 py-3 min-h-[100px] lg:col-start-1 lg:row-start-5"><FrontGateComponent onUpdateDeviceState={updateDeviceState} devices={devices} deviceStates={deviceStates} /></div>
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:col-span-2 lg:row-span-3 lg:col-start-2 lg:row-start-3"><ChatComponent /></div>
                            <div className="bg-[#080808] rounded-xl px-4 py-3 min-h-[100px] lg:row-span-2 lg:col-start-4 lg:row-start-3"><StatisticCompomnent /></div>
                            <div className="bg-[#B68CFA] rounded-xl px-4 py-3 min-h-[100px] lg:col-start-4 lg:row-start-5"><ScenarioComponent devices={devices} deviceStates={deviceStates}/></div>
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
                                onSwitchChange={handleSwitchChange}
                                onKnobChange={handleKnobChange}
                                onRefresh={fetchDevices}  
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
            <Toast ref={toast} />
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
