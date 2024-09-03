import React, { useState,useRef, useEffect } from "react";
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";

export default function LoginAppHome(){

    const [fetchData, setFetchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() =>{
        const getDataFromApi = async () =>{
            const response = await fetch('http://localhost:4000/api/user-homes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    "user_id": sessionStorage.getItem('UserId'),
                })
            });

            setFetchData(await response.json());
            console.log(await fetchData);
            setLoading(false);
        };
        getDataFromApi();
    },[]);
 
    if(loading){
        return(
            <h1>Ładowanie</h1>
        );
    }

    function goToRegister(){
        
        navigate('/add-new-app-home');
    }

    function homeSelected(homeId,homeName){
        sessionStorage.setItem('selected-home-id',homeId);
        sessionStorage.setItem('selected-home-name',homeName);

        navigate('/panel-dashboard');
    }   

    const itemCount = fetchData.length;
    const alignContentClass = itemCount <= 4 ? 'content-center' : 'content-start';

    return (

        <div className="card flex flex-col justify-content-center w-[100vw] h-[100vh] !bg-slate-800">
        <div className="flex flex-col gap-[6vw] justify-center text-center w-[100%] mt-[5%] text-4xl">
            <h1>Select home</h1>
                <div className="px-[20%]">
                <div className={`custom-scrollbar flex gap-[2vw] flex-col ${alignContentClass} justify-center mx-auto flex-wrap max-h-56 overflow-y-auto`}>
                    { fetchData && fetchData.map(el =>(
                    <div className="md:w-56 w-36 md:h-56 h-36 bg-slate-500 rounded-lg flex flex-col justify-end hover:bg-slate-600 transition-[0.5s] hover:transition-[0.5s]" onClick={() => homeSelected(el.home_id,el.name)}>
                        <i class="pi pi-home text-9xl w-[100%] h-[65%]"></i>
                        <p className="text-xl">Nazwa : {el.name}</p>
                        <p className="text-xl">ID : {el.home_id}</p>
                    </div>
                    ))}
                </div>
            </div>
            <p>Create or join new house</p>
            <Button className="w-30 flex self-center" label="Create" icon="pi pi-plus" onClick={() => goToRegister()} />
        </div>
    </div>  

    )
}


{/* <h1>Select account</h1>
<h1>Or</h1>
<h1>Continue register</h1>
<Button label="Continue " icon="pi pi-user" onClick={()=>goToRegister()}/> */}