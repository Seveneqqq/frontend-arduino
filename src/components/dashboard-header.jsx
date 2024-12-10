import React from 'react';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';

export function HeaderDashboard({ 
    microphoneActivatedColor, 
    notificationsActivatedColor, 
    microphoneActivate, 
    op, 
    activateNofitications, 
    notifications,
    onTabChange,
    activeTab
}) {
    return (
        <header className="flex xl:flex-row flex-col justify-between items-center mx-5 mt-3 px-7 py-0 xl:rounded-[100px] rounded-md bg-[#151513]">
            <ul className="flex gap-3 xl:flex-row flex-col">
                <li 
                    onClick={() => onTabChange('dashboard')}
                    className={`rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer ${activeTab === 'dashboard' ? 'text-[#080808] bg-[#C7EE7C]' : ''}`}
                >
                    <p>Dashboard</p>
                </li>
                <li 
                    onClick={() => onTabChange('automation')}
                    className={`rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer ${activeTab === 'automation' ? 'text-[#080808] bg-[#C7EE7C]' : ''}`}
                >
                    <p>Automation</p>
                </li>
                <li 
                    onClick={() => onTabChange('devices')}
                    className={`rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer ${activeTab === 'devices' ? 'text-[#080808] bg-[#C7EE7C]' : ''}`}
                >
                    <p>Devices</p>
                </li>
                <li 
                    onClick={() => onTabChange('activity')}
                    className={`rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer ${activeTab === 'activity' ? 'text-[#080808] bg-[#C7EE7C]' : ''}`}
                >
                    <p>Activity</p>
                </li>
                <li 
                    onClick={() => onTabChange('settings')}
                    className={`rounded-[100px] w-[150px] my-2 py-2 flex justify-center items-center text-xl hover:cursor-pointer ${activeTab === 'settings' ? 'text-[#080808] bg-[#C7EE7C]' : ''}`}
                >
                    <p>Settings</p>
                </li>
            </ul>
            <ul className="flex gap-3 xl:flex-row flex-col text-xl items-center justify-center">
                <li 
                    className={`${microphoneActivatedColor} rounded-[100%] p-2 w-[55px] h-[55px] flex items-center justify-center hover:cursor-pointer cursor-default transition ease-out duration-500`} 
                    onClick={microphoneActivate}
                >
                    <i className='pi pi-microphone transition before:ease-out before:delay-150 before:duration-150 text-[1.5em]' />
                </li>
                <li 
                    className={`bg-[#080808] ${notificationsActivatedColor} rounded-[100%] p-2 w-[55px] h-[55px] flex items-center justify-center transition ease-out duration-500`} 
                    onClick={(e) => {op.current.toggle(e); activateNofitications();}}
                >
                    <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                        <OverlayPanel 
                            ref={op} 
                            className='bg-[#151513]'
                            onHide={() => activateNofitications(true)}
                        >
                            <div className="flex flex-col">
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
    );
}