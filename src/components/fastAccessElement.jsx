import { useState } from "react";

export default function FastAccessElement({deviceName,category,status}) {

    let backgroundColor = '';

    switch (category) {
        case 'Light':
                backgroundColor = '#151513';
                break;
        case 'Sensor':
                backgroundColor = '#5E85ED';
                break;
        case 'Gate':
                backgroundColor = '#CB50CB';
                break;
        case 'Lock':
                backgroundColor = '#CB50CB'; 
                break;        
        case 'Security':
                backgroundColor = '#151513';
                break;
        case 'Wifi':
                backgroundColor = '#151513';
                break;
        case 'Kitchen devices':
                backgroundColor = '#151513';
                break;
        case 'Heating':
                backgroundColor = '#151513';  
                break;  
        case 'Camera':
                backgroundColor = '#151513';
                break;
        case 'Vacuum devices':
                backgroundColor = '#151513';
                break;
        case 'Multimedia devices':
                backgroundColor = '#151513';
                break;
            
    }

    return(
        <div className='rounded-xl p-10 flex-grow basis-64 min-w-0 h-44' style={{backgroundColor: backgroundColor}}>
            <h1>{deviceName} {backgroundColor}</h1>
        </div>
    );
}