import React, { useState,useEffect, useRef} from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';  
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';



export default function AddNewAppHome(){

    const navigate = useNavigate();
    const stepperRef = useRef(null);
    const toast = useRef(null);
    const [isClicked,clickedButton] = useState(false);
    const [valueHomeName,setValueOfHomeName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState('hidden');
    const [blur, setBlur] = useState('');
    const [devices, setDevices] = useState('');
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

    const rooms = [
        'Kitchen',
        'Living room', 
        'Bathroom', 
        'Garden', 
        'Childrens room', 
        'Garage', 
        'Office',
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

    useEffect(() => {

        const storedValue = sessionStorage.getItem('ValueOfHomeName');
        
        if (storedValue) {
            setValueOfHomeName(storedValue);
        }
    }, []);


    const saveAndCreateNewHome = async() => {

        try{
        const userId = sessionStorage.getItem('UserId');
        const homeName = valueHomeName;

        //userDevices

        const responseNewHome = await fetch(`http://localhost:4000/api/new-home`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
            },
            body: JSON.stringify({
                "userId": userId,
                "homeName": homeName
            })
        })

        const dataNewHome = await responseNewHome.json();

        const homeId = dataNewHome.home_id; 

        console.log('Zwrocony homeId : ' +homeId);

            const responseAddDevices = await fetch(`http://localhost:4000/api/add-new-devices`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    "homeId": homeId,
                    "devices": userDevices
                })
            })

            const dataAddDevices = await responseAddDevices.json();
            console.log(dataAddDevices);

            const responseAddAlarm = await fetch(`http://localhost:4000/api/mongodb/add-alarm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    "home_id": homeId,
                    "temperatureRange": [19, 24],
                    "humidityRange": [40, 60]
                })
            });
    
            const dataAddAlarm = await responseAddAlarm.json();
            console.log('Alarm settings created:', dataAddAlarm);

            if( dataNewHome.success && dataAddDevices.success){

                sessionStorage.setItem('selected-home-id',homeId);
                sessionStorage.setItem('selected-home-name',homeName);

                navigate(`/panel-dashboard`);
            }

        //stworzenie endpointu/polaczenie do istniejace ktory bedzie odpowiadal za stworzenie nowego domu, (dodanei do home i users_home), a nastepnie dodanie do devices urzadzen

        // /api/new-home

        // /api/add-new-devices

        //todo: zapisz dane i przekieruj na strone tego domu

        }
        catch(error){
            console.error('Error', error);
        }

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

            if(data.connection == true){
                
                setDevices(data.devices);

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

    async function joinToHouse(){

        try {

            let joinCode = document.getElementById('inviteCode').value;
            let userId = sessionStorage.getItem('UserId');
            
            let response = await fetch('http://localhost:4000/api/join-to-home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    "user_id": userId,
                    "home_invite_code": joinCode
                })
            });

            if( response.ok){
                let data = await response.json();
                console.log(data);
                if(data.success){
                    showSuccess();
                    setTimeout(() => {
                        navigate('/login-app-home');
                    }, 1000);
                }
                else{
                    showError();
                }
            }
            else{
                showError();
            }
        } catch (error) {
            showError();
            console.log(error);

        }
        
    }

    //https://www.google.com/search?q=smarthome+dashboard+&sca_esv=05826a3c56c67289&sca_upv=1&udm=2&biw=1536&bih=762&sxsrf=ADLYWILD-SP5BW0JZ51WUhsa3bPcMyuN0Q%3A1727801186747&ei=Yif8ZvmkLeipwPAP64vIsAI&ved=0ahUKEwj53en_0O2IAxXoFBAIHesFEiYQ4dUDCBA&uact=5&oq=smarthome+dashboard+&gs_lp=Egxnd3Mtd2l6LXNlcnAiFHNtYXJ0aG9tZSBkYXNoYm9hcmQgMgQQABgeSOgXUNgFWJkXcAF4AJABAJgBTKAB_QWqAQIxMbgBA8gBAPgBAZgCC6ACjAbCAgQQIxgnwgIHEAAYgAQYE8ICCBAAGBMYCBgewgIGEAAYExgemAMAiAYBkgcCMTGgB4YT&sclient=gws-wiz-serp#vhid=tu-J8RDAJQML3M&vssid=mosaic

    function setFields(name,status,category){
        setFormVisible(true);
        setSelectedRoom(null);
        setSelectedProtocol(''); 
        console.log(name,status);
        setName(name);
        setStatus(status);
        setCategory(category);
    }

    return (
      <div className="card flex justify-center h-[100vh] w-[100vw] !bg-slate-800">
        <Stepper
          ref={stepperRef}
          className="md:w-[80vw] w-[100vw] h-[100vh] !bg-slate-800"
        >
          <StepperPanel header="Select home">
            <div className="flex flex-column h-[80vh]">
              <div className="!bg-slate-800 surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div className="flex flex-col items-center w-[100%] gap-5 justify-center">
                  <Toast ref={toast} />

                  {!isClicked ? (
                    <>
                      <h2>Name of new house</h2>
                      <InputText
                        placeholder="Name"
                        value={valueHomeName}
                        maxLength={50}
                        onChange={(event) =>
                          onChangeSaveData(event.target.value)
                        }
                      />
                      <h2>Or</h2>
                      <Button
                        label="Join with Code"
                        icon="pi pi-sign-in  "
                        onClick={() => changeToInput()}
                      />
                    </>
                  ) : (
                    <>
                      <h2>Join to existing house</h2>
                      <InputText
                        keyfilter="int"
                        value={inviteCode}
                        id="inviteCode"
                        placeholder="#123456"
                        maxLength={6}
                        onChange={(event) => setInviteCode(event.target.value)}
                      />
                      <Button
                        label="Join"
                        icon="pi pi-plus"
                        onClick={() => joinToHouse()}
                      />
                      <h2>Or</h2>
                      <div className="flex flex-col gap-5">
                        <Button
                          label="Back"
                          icon="pi pi-arrow-left"
                          onClick={() => changeToInput()}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-between">
              <Button
                label="Choose home"
                icon="pi pi-home"
                iconPos="left"
                onClick={() => navigate("/login-app-home")}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Add devices">
            <div className="flex flex-column h-[80vh] items-center justify-center">
              <div
                className={`absolute w-[100%] h-[100%] flex justify-center ${loading}`}
              >
                <ProgressSpinner
                  strokeWidth={5}
                  className={`absolute flex z-50 top-[45%] ${loading}`}
                />
              </div>
              <div
                className={`!bg-slate-800 flex-row gap-[2vw] flex justify-center items-center w-[100%] ${blur}`}
              >
                <Toast ref={toast} />

                <div
                  className="md:w-72 w-48 md:h-72 h-48 bg-slate-500 flex flex-col rounded-xl text-center items-center justify-end transition-[0.5s] hover:transition-[0.5s] hover:bg-slate-600"
                  onClick={() => findDevices()}
                >
                  <i class="pi pi-search text-9xl w-[100%] h-[65%]"></i>
                  <p className="text-xl mb-5">FIND ARDUINO DEVICES</p>
                </div>
                <div
                  className="md:w-72 w-48 md:h-72 h-48 bg-slate-500 flex flex-col rounded-xl text-center items-center justify-end transition-[0.5s] hover:transition-[0.5s] hover:bg-slate-600"
                  onClick={() => AddManually()}
                >
                  <i class="pi pi-plus text-9xl w-[100%] h-[65%]"></i>
                  <p className="text-xl mb-5">ADD MANUALLY</p>
                </div>

                <Dialog 
    header="Founded devices" 
    className="max-w-3xl"
    style={{width: '1000px'}}
    visible={panelVisible1} 
    onHide={() => {if (!panelVisible1) return; setPanelVisible1(false); }}>
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
    onHide={() => {if (!panelVisible2) return; setPanelVisible2(false); }}>
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
            <div className="flex pt-4 justify-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>
          <StepperPanel header="Confirm">
            <div className="flex flex-column h-[80vh]">
              <div className=" surface-ground flex flex-col items-center gap-5 font-medium w-[100%] p-4">
                {valueHomeName.length > 0 && userDevices.length > 0 ? (
                  <>
                    <h2 className="text-3xl mb-4">
                      House: <strong>{valueHomeName}</strong>
                    </h2>

                    <DataTable
                      value={userDevices}
                      className="w-full md:w-[80%] bg-transparent"
                    >
                      <Column field="name" header="Name" />
                      <Column field="label" header="Label" />
                      <Column field="status" header="Status" />
                      <Column field="selectedRoom" header="Room" />
                      <Column field="command_on" header="Turn On Command" />
                      <Column field="command_off" header="Turn Off Command" />
                      <Column
                        body={(rowData, rowIndex) => (
                          <i
                            className="pi pi-trash text-red-500 text-xl cursor-pointer hover:text-red-700"
                            onClick={() => {
                              const updatedDevices = [...userDevices];
                              updatedDevices.splice(rowIndex, 1);
                              setUserDevices(updatedDevices);
                            }}
                          />
                        )}
                        header="Actions"
                        style={{ width: "50px", textAlign: "center" }}
                      />
                    </DataTable>
                  </>
                ) : (
                  <p className="text-xl">Please fill in the required fields.</p>
                )}
              </div>
            </div>

            <div className="flex pt-4 justify-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
              <Button
                label="Save"
                icon="pi pi-save"
                iconPos="right"
                onClick={saveAndCreateNewHome}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    );
}
    )
}

