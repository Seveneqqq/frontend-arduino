import Navbar from './navbar';

export default function Header(){

    return(
        <>
            <div className="w-full h-[10vh] text-white text-4xl  items-center px-10 flex justify-between">
                
                <h2>ArduinoHome</h2>
                
                <Navbar/>

            </div>
        </>
    );

}