import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { useState, useRef } from 'react';
import FastAccesElement  from '../components/fastAccessElement';

export default function PanelDashboard(){

    const [notifications, setNotifications] = useState([]);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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


    return(
        <div className="w-full bg-[#080808]">
            <header className="flex xl:flex-row flex-col justify-between items-center mx-5 mt-3 px-7 py-0 rounded-[100px] bg-[#151513]">
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
                <ul className="flex gap-3 xl:flex-row flex-col text-xl items-center justify-center ">
                    <li className="bg-[#080808] rounded-[100%] p-2 w-[55px] h-[55px] flex items-center justify-center">  
                            <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                                {notifications.length>0?<Badge value={notifications.length} className='bg-[#C7EE7C] !text-[#080808] flex justify-center items-center text-[0.8rem]' />:''}
                            </i>
                    </li>
                    <li className="bg-[#080808] rounded-[100%] w-[55px] h-[55px] flex items-center justify-center">  
                        <Avatar label="S" shape='circle' className="w-full h-[100%] bg-transparent text-[#C7EE7C] text-[1.7rem]" />
                    </li>
                </ul>
            </header>




            <div className="my-0 px-7 py-7 h-fit flex flex-col gap-5">
                <div 
                  ref={scrollRef}
                  className="flex gap-5 overflow-x-hidden select-none"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                    <div className="flex-none w-80 h-48 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none w-80 h-48 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none w-80 h-48 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none w-80 h-48 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none w-80 h-48 bg-[#151513] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none w-80 h-48 bg-[#5E85ED] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                    <div className="flex-none w-80 h-48 bg-[#CB50CB] rounded-xl cursor-grab active:cursor-grabbing">
                    </div>
                </div>

                <div className="w-full bg-[#151513] rounded-xl px-10 py-5">
                    <h2 className="text-xl">Fast access</h2>

                    <div className="flex flex-wrap gap-2">
                        <FastAccesElement deviceName="1" category="Sensor" status="on" />
                        <FastAccesElement deviceName="2" category="Light" status="off" />
                        <FastAccesElement deviceName="1" category="Sensor" status="on" />
                        <FastAccesElement deviceName="2" category="Light" status="off" />
                        <FastAccesElement deviceName="2" category="Light" status="off" />

                        <FastAccesElement deviceName="1" category="Sensor" status="on" />
                        <FastAccesElement deviceName="2" category="Light" status="off" />
                        <FastAccesElement deviceName="1" category="Sensor" status="on" />
                        
                    </div>
                </div>
                
            </div>
        </div>
    );

};