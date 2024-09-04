import React, { useState,useEffect,useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';  
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AddNewAppHome(){

    const navigate = useNavigate();
    const stepperRef = useRef(null);
    const toast = useRef(null);
    const [isClicked,clickedButton] = useState(false);
    const [valueHomeName,setValueOfHomeName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState('hidden');
    const [blur, setBlur] = useState('');


    let [panelVisible1, setPanelVisible1] = useState(false);
    let [panelVisible2, setPanelVisible2] = useState(false);

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Succesfully joined into house.',life: 2000,});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Something goes wrong.',life: 2000,});
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


    async function findDevices(){
        
        setBlur('blur-sm');
        setLoading('');

        console.log(sessionStorage.getItem('AuthToken'))

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
            console.log(data);
            if(data.connection == "true"){
                console.log(data.connection);
                
                setTimeout(() => {
                    connected();
                }, 200);
                

                setTimeout(() => {
                    setPanelVisible1(true);
                }, 1250);
                
                //tutaj reszta
            }
            else{
                notConnected();
            }
        }
        else{
            notConnected();
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

    async function AddManually(){
        setPanelVisible2(true);




    }


    function changeToInput(e){
        
        clickedButton(!isClicked);
    }

    function onChangeSaveData(value){

        setValueOfHomeName(value);
        sessionStorage.setItem('ValueOfHomeName',value);

    }

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
        }
        
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

                        <Dialog header="Header" visible={panelVisible1} style={{ width: '50vw' }} onHide={() => {if (!panelVisible1) return; setPanelVisible1(false); }}>
                            <p className="mb-5">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <p className="mb-5">
                                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
                                ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                            </p>
                        </Dialog>

                        <Dialog header="Header" visible={panelVisible2} style={{ width: '50vw' }} onHide={() => {if (!panelVisible2) return; setPanelVisible2(false); }} > 
                            <p className="mb-5">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <p className="mb-5">
                                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
                                ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                            </p>
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