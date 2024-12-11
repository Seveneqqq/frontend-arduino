import { useState, useRef, useEffect } from 'react';
import { HeaderDashboard } from '../components/dashboard-header'
import ActivityTab from '../components/dashboard-tabs/activity-tab';
import DevicesTab from '../components/dashboard-tabs/devices-tab';
import AutomationTab from '../components/dashboard-tabs/automation-tab';
import SettingsTab from '../components/dashboard-tabs/settings-tab';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from 'primereact/inputswitch';
import { Knob } from 'primereact/knob';

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
       })

       const data = await response.json();
       console.log(data);
       setDevices(data.devices);
       setCategories(data.categories);
       console.log(data.categories);
   }

   useEffect(() => {
       fetchDevices();
   }, [])

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

   const DialogWithDeviceFamily = ({ visible, setVisible }) => {
    const [checked, setChecked] = useState(false);
    const [knobValues, setKnobValues] = useState({});

    useEffect(() => {
        const initialValues = {};
        devices.forEach(device => {
            initialValues[device.device_id] = 100; 
        });
        setKnobValues(initialValues);
    }, [devices]);

    const handleSwitchChange = async (device, newValue) => {
        setChecked(newValue);
        
        try {
            const payload = {
                homeId: device.home_id,
                device: {
                    deviceName: device.name,
                    category: device.category,
                    label: device.label,
                    status: device.status
                },
                actions: {
                    state: newValue ? 1 : 0,
                    brightness: newValue ? 100 : 0
                }
            };
    
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

            if (newValue) {
                setKnobValues(prev => ({
                    ...prev,
                    [device.device_id]: 100
                }));
            }
    
        } catch (error) {
            console.error('Błąd podczas wysyłania stanu:', error);
        }
    };
    
    const handleKnobChange = async (device, newValue) => {

        setKnobValues(prev => ({
            ...prev,
            [device.device_id]: newValue
        }));
    
        if (!checked) {
            return;
        }
    
        try {
            const payload = {
                homeId: device.home_id,
                device: {
                    deviceName: device.name,
                    category: device.category,
                    label: device.label,
                    status: device.status
                },
                actions: {
                    state: 1,
                    brightness: newValue
                }
            };
    
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
            console.error('Błąd podczas wysyłania jasności:', error);
        }
    };

    const filteredDevices = devices
        .filter(device => device.category === dialogCategory)
        .sort((a, b) => {
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (a.status !== 'active' && b.status === 'active') return 1;
            return 0;
        });

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
                {filteredDevices.map((device, index) => (
                    <div 
                        key={index}
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
                                    checked={checked}
                                    onChange={(e) => handleSwitchChange(device, e.value)}
                                />
                            )}
                            {dialogCategory === 'Light' && (
                                <div className="flex items-center">
                                    <Knob 
                                        value={knobValues[device.device_id] || 100}
                                        onChange={(e) => handleKnobChange(device, e.value)}
                                        valueTemplate={'{value}%'}
                                        size={70}
                                        strokeWidth={8}
                                        valueColor="#5E85ED"
                                        disabled={device.status !== 'active'}
                                    />
                                </div>
                            )}
                            <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Dialog>
    );
}
     

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

                       <DialogWithDeviceFamily visible={visible} setVisible={setVisible} />

                       <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-none lg:grid-rows-5 gap-4 bg-[#151513] rounded-xl px-5 py-5 flex-1">
                           <div className="bg-[#B68CFA] rounded-xl p-6 min-h-[100px]">Losowa grupa urzadzen</div>
                           <div className="bg-[#CB50CB] rounded-xl p-6 min-h-[100px] lg:col-start-1 lg:row-start-2">Losowa grupa urzadzen</div>
                           <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:row-span-2 lg:col-start-2 lg:row-start-1">Kamera z mozliwoscia przewijania na inne ?</div>
                           <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1">Taski do zrobienia +dodac w uzytkowniku imie/pseudonim aby sie wyswietlal</div>
                           <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:row-span-2 lg:row-start-3">Jakies losowe urzadzenie w ktorym beda rozne opcje w zaleznosci od urzadzenia</div>
                           <div className="bg-[#be992a] rounded-xl p-6 min-h-[100px] lg:col-start-1 lg:row-start-5">Jeszcze nie wiadomo co - scenariusz albo cos innego</div>
                           <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:col-span-2 lg:row-span-3 lg:col-start-2 lg:row-start-3">Wykres czujnikow z przelaczaniem</div>
                           <div className="bg-[#080808] rounded-xl p-6 min-h-[100px] lg:row-span-2 lg:col-start-4 lg:row-start-3">otwieranie bramy/drzwi</div>
                           <div className="bg-[#B68CFA] rounded-xl p-6 min-h-[100px] lg:col-start-4 lg:row-start-5">Scenariusz</div>
                       </div>
                   </div>
               );
           case 'automation':
               return (
                   <div className="flex-1 px-5 py-5">
                       <div className="bg-[#151513] rounded-xl p-6 h-full">
                           <h2 className="text-2xl mb-4">Automation</h2>
                           <AutomationTab/>
                       </div>
                   </div>
               );
           case 'devices':
               return (
                   <div className="flex-1 px-5 py-5">
                       <div className="bg-[#151513] rounded-xl p-6 h-full">
                           <h2 className="text-2xl mb-4">Devices</h2>
                           <DevicesTab/>
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
       </div>
   );
}