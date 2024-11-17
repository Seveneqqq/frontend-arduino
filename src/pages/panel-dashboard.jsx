import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';


import FastAccesElement from '../components/fastAccessElement';

export default function PanelDashboard() {
    
    const scrollRef = useRef(null);
    const op = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [microphoneActivated, setMicrophoneActivated] = useState(false);
    const [microphoneActivatedColor, setMicrophoneActivatedColor] = useState('bg-[#080808]');
    

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.1;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const microphoneActivate = () =>{
        setMicrophoneActivated(!microphoneActivated);
        setMicrophoneActivatedColor(microphoneActivated? 'bg-[#080808]' : 'bg-[#5E85ED]');
    }

    return (
        <div className="w-full bg-[#080808] min-h-screen flex flex-col">
            <header className="flex xl:flex-row flex-col justify-between items-center mx-5 mt-3 px-7 py-0 xl:rounded-[100px] rounded-md bg-[#151513]">
                <ul className="flex gap-3 xl:flex-row flex-col">
                    <li className="rounded-[100px] text-[#080808] bg-[#C7EE7C] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer cursor-default">
                        <p>Dashboard</p>
                    </li>
                    <li className="rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer cursor-default">
                        <p>Automation</p>
                    </li>
                    <li className="rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer cursor-default">
                        <p>Devices</p>
                    </li>
                    <li className="rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer cursor-default">
                        <p>Activity</p>
                    </li>
                    <li className="rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer cursor-default">
                        <p>Settings</p>
                    </li>
                </ul>
                <ul className="flex gap-3 xl:flex-row flex-col text-xl items-center justify-center">
                    <li className={`${microphoneActivatedColor} rounded-[100%] p-2 w-[55px] h-[55px] flex items-center justify-center hover:cursor-pointer cursor-default transition ease-out delay-150 duration-500`} onClick={microphoneActivate}>
                        <i className='pi pi-microphone transition before:ease-out before:delay-150 before:duration-150 text-[1.5em]' />
                    </li>
                    <li className="bg-[#080808] rounded-[100%] p-2 w-[55px] h-[55px] flex items-center justify-center" onClick={(e) => op.current.toggle(e)}>
                        <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                            {/* {notifications.length > 0 ? (
                                <Badge 
                                    value={notifications.length} 
                                    className='bg-[#C7EE7C] !text-[#080808] flex justify-center items-center text-[0.8rem]' 
                                />
                            ) : ''} */}
                             <OverlayPanel ref={op} className='bg-[#151513]'>
                                <div classname="flex flex-col">
                                    {notifications.length > 0 ? (
                                        <span className='text-[1rem]'>Notification 1</span>
                                    ) : (
                                        <span className='text-[1rem]'>Nothing to show</span>
                                    )}
                                </div>
                            </OverlayPanel>
                        </i>
                    </li>
                    <li className="bg-[#080808] rounded-[100%] w-[55px] h-[55px] flex items-center justify-center">
                        <Avatar 
                            label="S" 
                            shape='circle' 
                            className="w-full h-[100%] bg-transparent text-[#C7EE7C] text-[1.7rem]" 
                        />
                    </li>
                </ul>
            </header>

            <div className="flex-1 px-5 py-5 flex flex-col gap-5">
                <div
                    ref={scrollRef}
                    className="flex gap-5 md:overflow-x-hidden overflow-x-scroll  select-none px-2"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#5E85ED] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none lg:w-80 sm:w-96 w-[18.4rem] lg:h-40 h-56 bg-[#CB50CB] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-none lg:grid-rows-5 gap-4 bg-[#151513] rounded-xl px-5 py-5 flex-1">
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px]">Losowa grupa urzadzen</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:col-start-1 lg:row-start-2">Losowa grupa urzadzen</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:row-span-2 lg:col-start-2 lg:row-start-1">Kamera z mozliwoscia przewijania na inne ?</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-1">Taski do zrobienia +dodac w uzytkowniku imie/pseudonim aby sie wyswietlal</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:row-span-2 lg:row-start-3">Jakies losowe urzadzenie w ktorym beda rozne opcje w zaleznosci od urzadzenia</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:col-start-1 lg:row-start-5">Jeszcze nie wiadomo co - scenariusz albo cos innego</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:col-span-2 lg:row-span-3 lg:col-start-2 lg:row-start-3">Wykres czujnikow z przelaczaniem</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:row-span-2 lg:col-start-4 lg:row-start-3">otwieranie bramy/drzwi</div>
                    <div className="bg-[#080808] rounded-xl p-4 min-h-[100px] lg:col-start-4 lg:row-start-5">Scenariusz</div>
                </div>
            </div>
        </div>  
    );
}