import author from "../icons/author.svg";
import code from "../icons/code.svg";
import database from "../icons/database.svg";
import home from "../icons/home.svg";
import mic from "../icons/mic.svg";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState } from "react";
import {InputText } from 'primereact/inputtext';


const items = [
    {
        text: "Home",
        img: home,
        path: "/home"
    },
    {
        text: "Author",
        img: author,
        path: "/author"
    },
    {
        text: "Speech Api",
        img: mic,
        path: "/speech-api"
    },
    {
        text: "Stack",
        img: code,
        path: "/stack"
    },
    {
        text: "Database",
        img: database,
        path: "/database"
    },
];

//<img className="fill-white h-[48%]" src={item.img} alt={item.text}/>


export default function ListItem() {

    const [visible, setVisible] = useState(false);
    const [singIn, setSingIn] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");
    const navigate = useNavigate();


    async function submitLogin() {

        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;

        // console.log(username);
        // console.log(password);

    try{
        const request = new Request("http://localhost:4000/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                login: username,
                password: password
            }),
          });
          
          const response = await fetch(request);
          const data = await response.json();
          //console.log(data);

            if(data.error) {
                console.log(data.error);
                setLoginMessage(data.error); 
            }
            if(data.success) {
                console.log(data.success);
                sessionStorage.setItem('AuthToken',data.token);
                sessionStorage.setItem('UserId',data.user);
                navigate('/login-app-home');
            }
        }   
        catch(error){
            console.error('Error', error);
            return;
        }
    }
    async function submitRegister(){

        let username = document.querySelector('#username').value;
        let email = document.querySelector('#email').value;
        let password = document.querySelector('#password').value;
        let repeatPassword = document.querySelector('#repeat-password').value;

        // console.log(username);
        // console.log(email);
        // console.log(password);
        // console.log(repeatPassword);


        try{
            const request = new Request("http://localhost:4000/api/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    username: username,
                    password: password,
                    repeatPassword: repeatPassword 
                }),
              });

              const response = await fetch(request);
              const data = await response.json();
              //console.log(data);
              
                if(data.error){
                    console.log(data.error);   
                }
                if(data.success){
                    console.log(data.success);
                    sessionStorage.setItem('AuthToken',data.token);
                    sessionStorage.setItem('UserId',data.user);
                    navigate('/add-new-app-home');    
                }

        }
        catch(error){
            console.error('Error', error);
            return;
        }
    }
    
    return (
        <ul className=" flex-row justify-between h-full w-full gap-6 items-center z-3 flex">
            {items.map(item => {
                return (
                    <Link to={item.path} className="flex flex-col text-[16px] transition duration-500 hover:duration-500 font-bold items-center text-larablue py-1 justify-center w-[6vw] h-[85%] rounded-[100px] focus:shadow-menuActive hover:bg-[#35363C] active:bg-[#35363C] z-3">   
                        <li key={item.path}>
                            {item.text} 
                        </li>
                    </Link>
                );
            })}
            <div className="card flex justify-content-center">
            <Button label="Login" icon="pi pi-user" className="!text-larablue !px-4 !py-4 border-transparent bg-transparent rounded-[100px] hover:bg-[#35363C] active:bg-[#35363C] z-3 " onClick={() => setVisible(true)} />
            {!singIn ? (<Dialog
                visible={visible}
                modal
                className=" w-96"
                onHide={() => {if (!visible) return; setVisible(false); }}
                content={({ hide }) => (
                    <div className="flex flex-col px-8 py-5 gap-4 bg-[#1E1E2F]" style={{ borderRadius: '12px'}}>
                        <h1 className="text-xl font-bold text-center w-full">Log-in<br/></h1>
                        <div className="inline-flex flex-col gap-2">
                            <label htmlFor="username" className="text-primary-50 font-semibold">
                                Username
                            </label>
                            <InputText id="username" label="Username" className="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
                        </div>
                        <div className="inline-flex flex-col gap-2">
                            <label htmlFor="password" className="text-primary-50 font-semibold">
                                Password
                            </label>
                            <InputText id="password" label="Password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password"></InputText>
                            <p className="text-red-600 text-sm">{loginMessage}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button label="Login" onClick={()=>{submitLogin()}} className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Sign In" onClick={() => setSingIn(true)} text className="p-3 w-full text-nowrap text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => {hide(e); setLoginMessage("")}} text  className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}> 
            </Dialog>
            ):(
                <Dialog
                visible={visible}
                modal
                className=" w-96"
                onHide={() => {if (!visible) return; setVisible(false); }}
                content={({ hide }) => (
                    <div className="flex flex-col px-8 py-5 gap-4 bg-[#1E1E2F]" style={{ borderRadius: '12px'}}>
                        <h1 className="text-xl font-bold text-center w-full">Sign-in<br/></h1>
                        <div className="inline-flex flex-col gap-2">
                            <label htmlFor="username" className="text-primary-50 font-semibold">
                                Username
                            </label>
                            <InputText id="username" label="Username" className="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
                        </div>
                        <div className="inline-flex flex-col gap-2">
                            <label htmlFor="email" className="text-primary-50 font-semibold">
                                Email
                            </label>
                            <InputText id="email" label="Email" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="email"></InputText>
                        </div>
                        <div className="inline-flex flex-col gap-2">
                            <label htmlFor="password" className="text-primary-50 font-semibold">
                                Password
                            </label>
                            <InputText id="password" label="Password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password"></InputText>
                        </div>
                        <div className="inline-flex flex-col gap-2">
                            <label htmlFor="repeat-password" className="text-primary-50 font-semibold">
                                Repeat password
                            </label>
                            <InputText id="repeat-password" label="Repeat-password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password"></InputText>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button label="Sign-in" onClick={()=>{submitRegister()}} className="p-3 w-full text-nowrap text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Login" onClick={() => setSingIn(false)} text className="p-3 w-full text-nowrap text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-nowrap text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}> 
            </Dialog>
            )}
        </div>
        </ul>
    );
}