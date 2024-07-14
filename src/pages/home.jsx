import Header from '../components/header.jsx';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';

export default function HomePage(){

    const [date, setDate] = useState(null);

    return(
        <div className="App">
                <div className="bg-[#1E1E2F] w-full h-[100vh] flex flex-col items-center">
                    <Header />
                    <Calendar value={date} onChange={(e) => setDate(e.value)} />
                    <Button label='dziala'/>
                </div>
            </div>
    );

}


