import { useState } from 'react';
import { getData, sendData } from '../scripts/api.js';

export default function ApiButtons(){

    let [content,setContent] = useState("");

    
    
        let getDataFromApi = () =>{
                if(content === "" || content.includes('Wyslano')){
                    getData().then((value) => setContent(value));
                }
                else{
                    setContent("");   
                }
        }

        let sendDataToApi = () =>{
            if(content === "" || content.includes('Odebrano')){
                sendData("cos").then((value) => setContent(value));
            }
            else{
                setContent("");
            }
        }
        
    


    return(
    <>
        <button className="flex h-fit w-fit px-5 text-4xl p-5 border-2 bg-slate-500 rounded-2xl text-white  border-slate-700" onClick={()=>sendDataToApi()}>SendData</button>
        <button className="flex h-fit w-fit px-5 text-4xl p-5 border-2 bg-slate-500 rounded-2xl text-white border-slate-700" onClick={()=>getDataFromApi()}>GetData</button>
        
        <h1>{content}</h1>
    </>
    );

}