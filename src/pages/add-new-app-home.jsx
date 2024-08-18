import React, { useState,useEffect,useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Panel } from '../components/panel';
import { InputText } from "primereact/inputtext";


export default function AddNewAppHome(){

    const stepperRef = useRef(null);
    
    const [isClicked,clickedButton] = useState(false);
    const [valueHomeName,setValueOfHomeName] = useState('');

    useEffect(() => {
        const storedValue = sessionStorage.getItem('ValueOfHomeName');
        if (storedValue) {
            setValueOfHomeName(storedValue);
        }
    }, []);

    function changeToInput(e){
        
        clickedButton(!isClicked);
    }
    function onChangeSaveData(value){

        setValueOfHomeName(value);
        sessionStorage.setItem('ValueOfHomeName',value);

    }



    return (
    <div className="card flex justify-content-center h-[100vh] w-[100vw] !bg-slate-800" >
        <Stepper ref={stepperRef}  className="w-[100vw] h-[100vh] px-96  !bg-slate-800" >
            <StepperPanel header="Wybierz dom lub mieszkanie">
                <div className="flex flex-column h-[80vh]">
                        <div className="!bg-slate-800 surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            <div className="flex flex-col items-center w-[100%] gap-5 justify-center">

                                
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
                                            <InputText keyfilter="int" placeholder="#123456" maxLength={6}/>
                                            <Button label="Join" icon="pi pi-plus" />
                                        <h2>Or</h2>
                                            <div className="flex flex-col gap-5">
                                                <Button label="Back" icon="pi pi-arrow-left" onClick={()=>changeToInput()}/>
                                            </div>
                                    </>
                                    }
                            </div>
                        </div>
                </div>
                <div className="flex pt-4 justify-end">
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Wybierz urządzenia">
                <div className="flex flex-column h-[80vh]">
                        <div className="!bg-slate-800 surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            Content II
                        </div>
                </div>
                <div className="flex pt-4 justify-between">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                </div>
            </StepperPanel>
            <StepperPanel header="Dodaj domowników">
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