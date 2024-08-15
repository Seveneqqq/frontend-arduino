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

    //panele takie jak w netflixie, a pod spodem przeycisk dokoncz rejestracje

    return (
    <div className="card flex justify-content-center h-[100vh] w-[100vw] !bg-slate-800" >
        <div>
            <h1>Select account</h1>
            <h1>Or</h1>
            <h1>Continue register</h1>
            <Button label="Continue " icon="pi pi-user" onClick={()=>goToRegister()}/>
        </div>
    </div>
    )
}