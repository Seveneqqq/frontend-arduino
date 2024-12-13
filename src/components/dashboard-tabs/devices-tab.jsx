import React, { useState,useRef, useEffect } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { Knob } from 'primereact/knob';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';  
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';

export default function DevicesTab({ devices, deviceStates, onEditDevice, onDeleteDevice, onSwitchChange, onKnobChange }) {
  
      const toast = useRef(null);
      const [isClicked,clickedButton] = useState(false);
      const [valueHomeName,setValueOfHomeName] = useState('');
      const [inviteCode, setInviteCode] = useState('');
      const [loading, setLoading] = useState('hidden');
      const [blur, setBlur] = useState('');
      const [newDevices, setNewDevices] = useState('');
      const [name, setName] = useState('');
      const [status, setStatus] = useState('');
      const [category, setCategory] = useState('');
      const [label, setLabel] = useState('');
      const [command_on, setCommand_on] = useState('');
      const [command_off, setCommand_off] = useState('');
      const [selectedRoom, setSelectedRoom] = useState(null);
      const [selectedCategory, setSelectedCategory] = useState(null);
      const [selectedProtocol, setSelectedProtocol] = useState(null);
      const [formVisible, setFormVisible] = useState(false);
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

      let [panelVisible1, setPanelVisible1] = useState(false);
      let [panelVisible2, setPanelVisible2] = useState(false);
      let [userDevices, setUserDevices] = useState([]);
      let [devicesList, setDevicesList] = useState([]);
  
      const showFormFields = () => {
              
              if(selectedProtocol){
                  switch (selectedProtocol) {
      
                      case 'Zigbee':
                          return zigbeeProtocol();
                      break;
                      case 'Wifi':
                          return wifiProtocol();
                      break;
                      case 'Bluetooth':
                          return bluetoothProtocol();
                      break;
                      case 'Z-Wave':
                          return zwaveProtocol();
                      break;
                      case 'MQTT':
                          return mqttProtocol();
                      break;
                  
                  }
              }
          };
      
          const zigbeeProtocol = () =>{
              return(
                  <>
                      {clearFields}
                      <InputText placeholder="Zigbee ID" value={zigbeeId} maxLength={15} onChange={(event) => setZigbeeId(event.target.value)} />
                      <InputText placeholder="Zigbee channel" value={zigbeeChannel} maxLength={30} onChange={(event) => setZigbeeChannel(event.target.value)} />
                      <InputText placeholder="Zigbee group ID" value={zigbeeGroupId} maxLength={15} onChange={(event) => setZigbeeGroupId(event.target.value)} />
                      <InputText placeholder="Zigbee binding central hub" value={zigbeeHub} maxLength={30} onChange={(event) => setZigbeeHub(event.target.value)} />
                  </>
              );
          }
          
          const wifiProtocol = () =>{
              return(
                  <>
                      {clearFields}
                      <InputText placeholder="WiFi IP address" value={ipAddress} maxLength={50} onChange={(event) => setIpAddress(event.target.value)} />
                      <InputText placeholder="WiFi MAC address" value={macAddress} maxLength={50} onChange={(event) => setMacAddress(event.target.value)} />
                      <InputText placeholder="WiFi SSID" value={ssid} maxLength={50} onChange={(event) => setSsid(event.target.value)} />
                      <InputText placeholder="WiFi password" value={password} maxLength={50} onChange={(event) => setPassword(event.target.value)} />
                  </>
              );
          }
          const bluetoothProtocol = () =>{
              return(
                  <>
                      {clearFields}
                      <InputText placeholder="Bluetooth BLE UUID" value={bleUuid} maxLength={30} onChange={(event) => setBleUuid(event.target.value)} />
                      <InputText placeholder="Bluetooth connection" value={bleConnection} maxLength={30} onChange={(event) => setBleConnection(event.target.value)} />
                  </>
              );
          }
          const zwaveProtocol = () =>{
              return(
                  <>
                      {clearFields}
                      <InputText placeholder="Z-wave device ID" value={zwaveDeviceId} maxLength={15} onChange={(event) => setZwaveDeviceId(event.target.value)} />
                      <InputText placeholder="Z-wave network key" value={zwaveNetworkKey} maxLength={30} onChange={(event) => setZwaveNetworkKey(event.target.value)} />
                      <InputText placeholder="Z-wave group ID" value={zwaveGroupId} maxLength={15} onChange={(event) => setZwaveGroupId(event.target.value)} />
                  </>
              );
          }
          const mqttProtocol = () =>{
              return(
                  <>
                      {clearFields}
                      <InputText placeholder="MQTT broker URL" value={mqttBrokerUrl} maxLength={150} onChange={(event) => setMqttBrokerUrl(event.target.value)} />
                      <InputText placeholder="MQTT topic ON" value={mqttTopicOn} maxLength={50} onChange={(event) => setMqttTopicOn(event.target.value)} />
                      <InputText placeholder="MQTT topic OFF" value={mqttTopicOff} maxLength={50} onChange={(event) => setMqttTopicOff(event.target.value)} />
                      <InputText placeholder="MQTT device ID" value={mqttDeviceId} maxLength={15} onChange={(event) => setMqttDeviceId(event.target.value)} />
                  </>
              );
          }

          const showSuccess = () => {
            toast.current.show({severity:'success', summary: 'Success', detail:'Succesfully joined into house.',life: 2000,});
        }
        const accesForbidden = () => {
            toast.current.show({severity:'error', summary: 'Dennied', detail:'Forbdden, please log in.',life: 2000,});
        }
        const showError = () => {
            toast.current.show({severity:'error', summary: 'Error', detail:'Something goes wrong.',life: 2000,});
        }
        const devicesSaved = () => {
            toast.current.show({severity:'success', summary: 'Success', detail:'Succesfully devices are saved',life: 1000,});
        }
        const connected = () =>{
            toast.current.show({severity:'success', summary: 'Success', detail:'Succesfully founded devices',life: 1000,});
        }
        const notConnected = () =>{
            toast.current.show({severity:'error', summary: 'Error', detail:'Cannot find any device',life: 1000,});
        }

        async function AddManually(){
        
                setBlur('blur-sm');
                setLoading('');
        
                setPanelVisible2(true);
        
                try {
                    
                    fetchDeviceList();
        
                    async function fetchDeviceList(){
        
                        let response = await fetch("http://localhost:4000/api/devices-list", {
                            headers: {
                                'Content-Type': 'application/json', 
                                'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                            },
                        });
        
                        let list = await response.json();
                        let devicesArr = list.devices;
                        setDevicesList(devicesArr);
        
                        //console.log(await devicesList);
                    }
                } catch (error) {
                    
                    showError();
                    console.error(error);
        
                }finally{
                    setBlur('');
                    setLoading('hidden');
                }
            }
        
            async function findDevices(){
                
        
        
                setBlur('blur-sm');
                setLoading('');
        
                try{
        
                let response = await fetch('http://localhost:4000/api/find-devices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                        'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                    },
                });
                
                if( response.ok){
        
                    let data = await response.json();
        
                    if(data.connection == "true"){
                        
                        setNewDevices(data.devices);
        
                        setTimeout(() => {
                            connected();
                        }, 200);
                        
        
                        setTimeout(() => {
                            setPanelVisible1(true);
                        }, 1250);
        
                    }
                    else{
                        
                        notConnected();
                    }
                }
                else{
                    accesForbidden();
                }
            } catch (error) {
                
                console.log(error);
                notConnected();
            }
            finally{
                setBlur('');
                setLoading('hidden');
            }
        }
        
            function changeToInput(e){
                
                clickedButton(!isClicked);
            }
        
            function onChangeSaveData(value){
        
                setValueOfHomeName(value);
                sessionStorage.setItem('ValueOfHomeName',value);
        
            }
        
            const onChangeSetCategory = (e) =>{
                selectedCategory(e.target.value);
            }
        
            const onChangeSelectedRoom = (e) =>{
                setSelectedRoom(e.target.value);
            }
        
            const onChangeSetTurnOn = (e) =>{
                setCommand_on(e.target.value);
            }
            const onChangeSetTurnOff = (e) =>{
                setCommand_off(e.target.value);
            }
            const onChangeSetLabel = (e) =>{
                setLabel(e.target.value);
            }
        
            const saveDevice = () => {
        
                let foundDevice = devices.find(device => device.name === name);
                
                foundDevice.hidden="true";
                let selectedRoomId;
        
                // tutaj musi być switch który będzie uzupelnial id pokoju
        
                const newDevice = {
                    name: name,
                    status: status,
                    label: label,
                    command_on: command_on,
                    command_off: command_off,
                    selectedRoom: selectedRoom,
                    category: selectedCategory
                };
            
                setLabel('');          
                setCommand_on('');     
                setCommand_off('');     
                setSelectedRoom(null); 
                setSelectedCategory(null);
        
                setUserDevices(prevDevices => {
                    const updatedDevices = [...prevDevices, newDevice];
                    //console.log(updatedDevices); 
                    return updatedDevices;
                });        
            };
        
            const saveDeviceManually = () => {
                
                let foundDevice = devicesList.find(device => device.name === name);
                const category = foundDevice.category;
                foundDevice.hidden = "true";
                
                const newDevice = {
                    name: name,
                    category: category,
                    status: "not-active",
                    label: label,
                    command_on: command_on,
                    command_off: command_off,
                    selectedRoom: selectedRoom,
                    protocol: selectedProtocol, 
                    protocolConfig: {} 
                };
        
                switch (selectedProtocol) {
                    case 'Zigbee':
                        newDevice.protocolConfig = {
                            zigbeeId: zigbeeId,
                            zigbeeChannel: zigbeeChannel,
                            zigbeeGroupId: zigbeeGroupId,
                            zigbeeHub: zigbeeHub
                        };
                        break;
                    case 'Wifi':
                        newDevice.protocolConfig = {
                            ipAddress: ipAddress,
                            macAddress: macAddress,
                            ssid: ssid,
                            password: password
                        };
                        break;
                    case 'Bluetooth':
                        newDevice.protocolConfig = {
                            bleUuid: bleUuid,
                            bleConnection: bleConnection
                        };
                        break;
                    case 'Z-Wave':
                        newDevice.protocolConfig = {
                            zwaveDeviceId: zwaveDeviceId,
                            zwaveNetworkKey: zwaveNetworkKey,
                            zwaveGroupId: zwaveGroupId
                        };
                        break;
                    case 'MQTT':
                        newDevice.protocolConfig = {
                            mqttBrokerUrl: mqttBrokerUrl,
                            mqttTopicOn: mqttTopicOn,
                            mqttTopicOff: mqttTopicOff,
                            mqttDeviceId: mqttDeviceId
                        };
                        break;
                }
        
                setLabel('');          
                setCommand_on('');     
                setCommand_off('');     
                setSelectedRoom(null);
                setSelectedProtocol(null); 
                clearFields();
            
                setUserDevices(prevDevices => {
                    const updatedDevices = [...prevDevices, newDevice];
                    return updatedDevices;
                });        
            };
            
            useEffect(() => {
                console.log('Updated userDevices:', userDevices);
        
                if(userDevices.length == devices.length && devices.length != 0) {
                    
                    setPanelVisible1(false);
        
                    setTimeout(() => {
                        devicesSaved(); 
                    }, 500);
                    
                }
        
            }, [userDevices]);
        

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
        };

        function setFields(name,status,category){
          setFormVisible(true);
          setSelectedRoom(null);
          setSelectedProtocol(''); 
          console.log(name,status);
          setName(name);
          setStatus(status);
          setCategory(category);
      }

  const rooms = [
    'Kitchen',
    'Living room',
    'Bathroom',
    'Garden',
    'Children\'s room',
    'Garage',
    'Office'
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
  'MQTT', 
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
      <div className="flex xl:flex-row flex-col xl:gap-0 gap-4 justify-between items-center mb-4">
        <h2 className="text-2xl">Devices</h2>
        <div className='flex gap-4'>
          <Button label="Arduino devices" icon="pi pi-plus" className="p-button-success" onClick={() => findDevices()}/>
          <Button label="Other devices" icon="pi pi-plus" className="p-button-success" onClick={() => AddManually()} />
        </div>
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
                    <div className={`w-3 h-3 rounded-full ${device.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
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

         <div className="flex flex-column h-[80vh] items-center justify-center">
                      <div
                        className={`absolute w-[100%] h-[100%] flex justify-center ${loading}`}
                      >
                        <ProgressSpinner
                          strokeWidth={5}
                          className={`absolute flex z-50  ${loading}`}
                        />
                      </div>
                      <div
                        className={`!bg-slate-800 flex-row gap-[2vw] flex justify-center items-center w-[100%] ${blur}`}
                      >
                        <Toast ref={toast} />
        
                        
        
                        <Dialog 
                            header="Founded devices" 
                            className="max-w-3xl"
                            style={{width: '1000px'}}
                            visible={panelVisible1} 
                            onHide={() => {if (!panelVisible1) return; setPanelVisible1(false); }}
                            contentStyle={{ backgroundColor: '#151513' }}
                            headerStyle={{ backgroundColor: '#151513' }}
                            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
                        >
                
            <div className="flex flex-row">
                <div className="w-[40%]">
                    {devices=="" ? 
                        <h1>Loading...</h1> 
                        :
                        <>
                        <div className="grid grid-cols-2 font-semibold px-2 py-4"><p>Name</p><p>Status</p></div>
                        {devices.map(el=>{
                            return <div className={`grid grid-cols-2 px-2 py-2 border-y-[1px] border-slate-600 hover:bg-slate-700 ${el.hidden ? "hidden" : ""}`} onClick={()=>setFields(el.name,el.status)}><p>{el.name}</p><p>{el.status}</p></div>
                        })}
                        </>
                    }
                </div>
                <div className="px-2 pt-4 gap-4 flex flex-col items-center w-[60%]">
                    <>
                        <p className="font-semibold">Set your devices - {name}</p>
        
                        <InputText placeholder="label" id="label" value={label} onChange={(e)=>onChangeSetLabel(e)} />
        
                        <Dropdown value={selectedRoom} onChange={(e) => setSelectedRoom(e.value)} options={rooms} id="room_id" optionLabel="Room" 
                            placeholder="Select room" className="!w-56" />
        
                        <Dropdown value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categories} id="category_id" optionLabel="Device category" 
                            placeholder="Select device category" className="!w-56" />
        
                        <InputText placeholder="Say to turn on" id="command_on" value={command_on} onChange={(e)=>onChangeSetTurnOn(e)} />
        
                        <InputText placeholder="Say to turn off" id="command_off" value={command_off} onChange={(e)=>onChangeSetTurnOff(e)} />
        
                        <Button label="Save" onClick={saveDevice}/>
                    </>
                </div>
            </div>
        </Dialog>
        
        <Dialog 
            header="Add devices from list" 
            className="max-w-3xl"
            style={{width: ''}}
            visible={panelVisible2} 
            onHide={() => {if (!panelVisible2) return; setPanelVisible2(false); }}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
        >
            <div className="flex flex-row">
                <div className="w-[40%]">
                    {devicesList=="" ? 
                        <h1>Loading...</h1> 
                        :
                        <>
                        <div className="grid grid-cols-2 font-semibold px-2 py-4"><p>Name</p><p>Category</p></div>
                            <div className="">
                            {devicesList.map(el=>{
                                return <div className={`grid grid-cols-2 px-2 gap-6 py-2 border-y-[1px] border-slate-600 hover:bg-slate-700`} onClick={()=>setFields(el.name,"not-active",el.category)}><p>{el.name}</p><p>{el.category}</p></div>
                            })}
                            </div>
                        </>
                    }
                </div>
                <div className="px-2 pt-4 gap-4 flex flex-col items-center w-[60%]">
                    <>
                        {formVisible ? <p className="font-semibold">Set your devices - {name}</p> : <p className="font-semibold">Select device</p>}
        
                        <InputText placeholder="label" id="label" value={label} onChange={(e)=>onChangeSetLabel(e)} />
        
                        <Dropdown value={selectedRoom} onChange={(e) => setSelectedRoom(e.value)} options={rooms} id="room_id" optionLabel="Room" 
                            placeholder="Select room" className="!w-56" />
        
                        <InputText placeholder="Say to turn on" id="command_on" value={command_on} onChange={(e)=>onChangeSetTurnOn(e)} />
        
                        <InputText placeholder="Say to turn off" id="command_off" value={command_off} onChange={(e)=>onChangeSetTurnOff(e)} />
                        
                        <Dropdown value={selectedProtocol} onChange={(e) => setSelectedProtocol(e.value)} options={protocols} id="protocol_id" optionLabel="Protocol" 
                            placeholder="Select protocol" className="!w-56" />
                        {selectedProtocol && showFormFields()}
                        {formVisible ? <Button label="Save" onClick={saveDeviceManually}/> : "" }
                    </>
                </div>
            </div>
        </Dialog>
                      </div>
                    </div>
                    



    </>
  );
}
