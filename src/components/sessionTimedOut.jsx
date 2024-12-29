import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function SessionTimedOut({ visible, setVisible }) {
    const [loginMessage, setLoginMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function submitLogin() {
        try {
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

            if(data.error) {
                setLoginMessage(data.error); 
            }
            if(data.success) {
                sessionStorage.setItem('AuthToken', data.token);
                sessionStorage.setItem('UserId', data.user);
                setVisible(false);
                window.location.reload();
            }
        } catch(error) {
            console.error('Error', error);
            setLoginMessage('Connection error');
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('AuthToken');
        sessionStorage.removeItem('UserId');
        sessionStorage.removeItem('selected-home-id');
        navigate('/');
    };

    return (
        <Dialog
            visible={visible}
            modal
            className="w-96 bg-[#1E1E2F]"
            closable={false}
            contentStyle={{ background: '#1E1E2F', padding: 0 }}
            headerStyle={{ backgroundColor: '#1E1E2F', display: 'none'}}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
        >
            <div className="flex flex-col px-8 py-10 gap-6 bg-[#1E1E2F]" style={{ borderRadius: '12px'}}>
                <h1 className="text-xl font-bold text-center w-full">Session Expired<br/></h1>
                <p className="text-primary-50 text-center">Your session has expired. Please log in again.</p>
                <div className="inline-flex flex-col gap-2">
                    <label htmlFor="username" className="text-primary-50 font-semibold">
                        Username
                    </label>
                    <InputText 
                        id="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white-alpha-20 border-none p-3 text-primary-50"
                    />
                </div>
                <div className="inline-flex flex-col gap-2">
                    <label htmlFor="password" className="text-primary-50 font-semibold">
                        Password
                    </label>
                    <InputText 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white-alpha-20 border-none p-3 text-primary-50" 
                        type="password"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                submitLogin();
                            }
                        }}
                    />
                    <p className="text-red-600 text-sm">{loginMessage}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        label="Login" 
                        onClick={submitLogin}
                        className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                    />
                    <Button 
                        label="Logout" 
                        onClick={handleLogout}
                        className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                    />
                </div>
            </div>
        </Dialog> 
    );
}