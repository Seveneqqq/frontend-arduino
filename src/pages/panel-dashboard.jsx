import { Badge } from 'primereact/badge';
import { useState } from 'react';

export default function PanelDashboard(){

    const [notifications, setNotifications] = useState([]);

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
                    <li className="bg-[#080808] rounded-[100%] p-2 w-[60px] h-[60px] flex items-center justify-center">  
                            <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                                {!notifications.length>0?<Badge value={notifications.length} className='bg-[#C7EE7C] !text-[#080808] flex justify-center items-center text-[0.8rem]' />:''}
                            </i>
                    </li>
                    <li className="bg-[#080808] rounded-[100%] p-2 w-[60px] h-[60px] flex items-center justify-center">  
                            <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                                {/* <Badge value="0"></Badge> */}
                            </i>
                    </li>
                </ul>
            </header>

            <div className="my-0 px-7 py-7 h-[90vh] flex flex-col gap-5">
                <div className="flex gap-5">
                    <div className="w-full h-48 bg-[#151513] rounded-xl ">

                    </div>
                    <div className="w-full h-48 bg-[#151513] rounded-xl ">

                    </div>
                    <div className="w-full h-48 bg-[#151513] rounded-xl ">

                    </div>
                    <div className="w-full h-48 bg-[#151513] rounded-xl ">

                    </div>
                    <div className="w-full h-48 bg-[#151513] rounded-xl ">

                    </div>
                </div>

                <div className="w-full h-[75%] bg-[#151513] rounded-xl px-10 py-6">
                    <h2 className="text-xl">Fast access</h2>
                </div>
                
            </div>
        </div>
    );

};