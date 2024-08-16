import Header from '../components/header.jsx';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function HomePage(){

    const [date, setDate] = useState(null);
    const [value, setValue] = useState(10);

    return(
        <div className="App">
                <div className="bg-[#1E1E2F] w-full h-[100vh] flex flex-col items-center">
                    <Header />
                    
                    <Button label='dziala'/>
 
                </div>
        </div>
    );

}


