import React, { useState,useEffect,useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';  
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';


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
    const [label, setLabel] = useState('');
    const [command_on, setCommand_on] = useState('');
    const [command_off, setCommand_off] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const rooms = [
        'Kitchen',
        'Living room', 
        'Bathroom', 
        'Garden', 
        'Childrens room', 
        'Garage', 
        'Office',
    ];
    
    let [panelVisible1, setPanelVisible1] = useState(false);
    let [panelVisible2, setPanelVisible2] = useState(false);
    let [userDevices, setUserDevices] = useState([]);
    let [devicesList, setDevicesList] = useState([]);

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

                console.log(await devicesList);
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

        //console.log(sessionStorage.getItem('AuthToken'))

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
                
                console.log(data);
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
        
        console.log('1' +error);
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
        setLabel('');          
        setCommand_on('');     
        setCommand_off('');     
        setSelectedRoom(null); 

        let selectedRoomId;

        // tutaj musi być switch który będzie uzupelnial id pokoju

        const newDevice = {
            name: name,
            status: status,
            label: label,
            command_on: command_on,
            command_off: command_off,
            selectedRoom: selectedRoomId
        };
    


        setUserDevices(prevDevices => {
            const updatedDevices = [...prevDevices, newDevice];
            //console.log(updatedDevices); 
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
            
            
            //walidacja
            //wyslanie do api
            //blokowanie urzadzen i opcji 
            //zrobienie sprawdzenia, jezeli urzadzenia zostaly zapsane a bedzie ponowne wejscie 
            //to wtedy alert alert o tym ze to wyczysci urzadzenia i wyczyszczenie wszystkich stanow
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



    function setFields(name,status){
        setFormVisible(true);
        console.log(name,status);
        setName(name);
        setStatus(status);
    }

    return (
    <div className="card flex justify-content-center h-[100vh] w-[100vw] !bg-slate-800" >
        <Stepper ref={stepperRef}  className="w-[100vw] h-[100vh] px-96  !bg-slate-800" >
            <StepperPanel header="Select home">
                <div className="flex flex-column h-[80vh]">
                        <div className="!bg-slate-800 surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            <div className="flex flex-col items-center w-[100%] gap-5 justify-center">
                                <Toast ref={toast} />
                                
                                    {!isClicked ?
                                    <>
                                        <h2>Name of new house</h2>
                                        <InputText placeholder="Name" value={valueHomeName} maxLength={15} onChange={(event)=>onChangeSaveData(event.target.value)}/>
                                        <h2>Or</h2>
                                        <Button label="Join with Code" icon="pi pi-sign-in  " onClick={()=>changeToInput()}/>
                                        
                                    </>
                                    : 
                                    <>
                                        <h2>Join to existing house</h2>
                                            <InputText keyfilter="int" value={inviteCode} id="inviteCode" placeholder="#123456" maxLength={6} onChange={(event) => setInviteCode(event.target.value)}/>
                                            <Button label="Join" icon="pi pi-plus" onClick={()=>joinToHouse()}/>
                                        <h2>Or</h2>
                                            <div className="flex flex-col gap-5">
                                                <Button label="Back" icon="pi pi-arrow-left" onClick={()=>changeToInput()}/>
                                            </div>
                                    </>
                                    }
                            </div>
                        </div>
                </div>
                <div className="flex pt-4 justify-between">
                    <Button label="Choose home" icon="pi pi-home" iconPos="left" onClick={() => navigate('/login-app-home')} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Add devices">
                
                <div className="flex flex-column h-[80vh] items-center justify-center">
                            <div className={`absolute w-[100%] h-[100%] flex justify-center ${loading}`}>
                                <ProgressSpinner strokeWidth={5} className={`absolute flex z-50 top-[45%] ${loading}`}/>
                            </div>
                        <div className={`!bg-slate-800 flex-row gap-[2vw] flex justify-center items-center w-[100%] ${blur}`}>
                            
                            <Toast ref={toast} />
                            
                        <div className="md:w-72 w-48 md:h-72 h-48 bg-slate-500 flex flex-col rounded-xl text-center items-center justify-end transition-[0.5s] hover:transition-[0.5s] hover:bg-slate-600" onClick={() => findDevices()}>
                            <i class="pi pi-search text-9xl w-[100%] h-[65%]"></i>
                            <p className="text-xl mb-5">Find devices</p>
                        </div>
                        <div className="md:w-72 w-48 md:h-72 h-48 bg-slate-500 flex flex-col rounded-xl text-center items-center justify-end transition-[0.5s] hover:transition-[0.5s] hover:bg-slate-600" onClick={() => AddManually()}>
                            <i class="pi pi-plus text-9xl w-[100%] h-[65%]"></i>
                            <p className="text-xl mb-5">Add manually</p>
                        </div>

                        <Dialog header="Founded devices"  visible={panelVisible1} style={{ width: '50vw'}} onHide={() => {if (!panelVisible1) return; setPanelVisible1(false); }}>
                            <div className="flex flex-row w-[100%]">
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
                                    
                                    {formVisible && 
                                    <>
                                        <p class="font-semibold">Set your devices - {name}</p>

                                        <InputText placeholder="label" id="label" value={label} onChange={(e)=>onChangeSetLabel(e)} />

                                        <Dropdown value={selectedRoom} onChange={(e) => setSelectedRoom(e.value)} options={rooms} id="room_id" optionLabel="Room" 
                                            placeholder="Select room" className="w-full md:w-14rem" />

                                        <InputText placeholder="Say to turn on" id="command_on" value={command_on} onChange={(e)=>onChangeSetTurnOn(e)} />

                                        <InputText placeholder="Say to turn off" id="command_off" value={command_off} onChange={(e)=>onChangeSetTurnOff(e)} />

                                        <Button label="Save" onClick={saveDevice}/>
                                    </>
                                    }

                                </div>
                            </div>
                        </Dialog>

                        <Dialog header="Header" visible={panelVisible2} style={{ width: '50vw' }} onHide={() => {if (!panelVisible2) return; setPanelVisible2(false); }} > 
                            



                        </Dialog>

                        </div>
                </div>
                <div className="flex pt-4 justify-between">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Confirm">
                <div className="flex flex-column h-[80vh]">
                        <div className="!bg-slate-800 surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            Content III
                        </div>
                </div>
                <div className="flex pt-4 justify-between">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    <Button label="Save" icon="pi pi-save" iconPos="right" />
                </div>
            </StepperPanel>
        </Stepper>
    </div>
    )
}
