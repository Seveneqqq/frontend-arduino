import React, { useState,useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Panel } from '../components/panel';
import { InputText } from "primereact/inputtext";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

export default function LoginAppHome(){

    const stepperRef = useRef(null);
    const navigate = useNavigate();

    const [isClicked,clickedButton] = useState(false);

    function goToRegister(){
        
        navigate('/add-new-app-home');
    }

    const itemCount = 4;
    const alignContentClass = itemCount <= 4 ? 'content-center' : 'content-start';

    return (
        <div className="card flex flex-col justify-content-center w-[100vw] h-[100vh] !bg-slate-800">
        <div className="flex flex-col gap-[6vw] justify-center text-center w-[100%] mt-[5%] text-4xl">
            <h1>Select home</h1>
                <div className="px-[20%]">
                <div className={`custom-scrollbar flex gap-[2vw] flex-col ${alignContentClass} justify-center mx-auto flex-wrap max-h-56 overflow-y-auto`}>
                    <div className="md:w-56 w-36 md:h-56 h-36 bg-slate-500"></div>
                    <div className="md:w-56 w-36 md:h-56 h-36 bg-slate-500"></div>
                    <div className="md:w-56 w-36 md:h-56 h-36 bg-slate-500"></div>
                    <div className="md:w-56 w-36 md:h-56 h-36 bg-slate-500"></div>
                </div>
            </div>
            <p>Create or join new house</p>
            <Button className="w-36 flex self-center" label="Continue" icon="pi pi-user" onClick={() => goToRegister()} />
        </div>
    </div>
    
    )
}


{/* <h1>Select account</h1>
<h1>Or</h1>
<h1>Continue register</h1>
<Button label="Continue " icon="pi pi-user" onClick={()=>goToRegister()}/> */}