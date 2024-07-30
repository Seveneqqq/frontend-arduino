import Header from '../components/header.jsx';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';
import { Knob } from 'primereact/knob';

export default function HomePage(){

    const [date, setDate] = useState(null);
    const [value, setValue] = useState(10);

    return(
        <div className="App">
                <div className="bg-[#1E1E2F] w-full h-[100vh] flex flex-col items-center">
                    <Header />
                    <Calendar value={date} onChange={(e) => setDate(e.value)} />
                    <Button label='dziala'/>
                    <div className="card flex justify-content-center">
                    <Knob value={value} onChange={(e) =>  setValue(e.value)} min={-50} max={50} />
                    </div>  
                </div>
        </div>
    );

}


