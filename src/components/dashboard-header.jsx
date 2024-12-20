import React from 'react';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';


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
                    <i className='pi pi-microphone text-[1.5em]' />
                </li>
                <li 
                    className={`bg-[#080808] ${notificationsActivatedColor} rounded-[100%] p-2 w-[55px] h-[55px] flex items-center justify-center hover:cursor-pointer transition ease-out duration-500`} 
                    onClick={(e) => {op.current.toggle(e); activateNofitications();}}
                >
                    <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                    {notifications.length > 0 ? <Badge value={notifications.length} className='bg-[#CB50CB]'></Badge> : ""}
                    <OverlayPanel 
                        ref={op} 
                        className='bg-[#151513] w-80'  
                        onHide={() => activateNofitications(true)}
                    >
                        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        className={`p-3 rounded-lg ${notification.type === 'alarm' ? 'bg-red-900/30' : 'bg-[#1E1E1C]'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </span>
                                            {!notification.read && (
                                                <span className="w-2 h-2 rounded-full bg-[#C7EE7C]"></span>
                                            )}
                                        </div>
                                        <p className="text-sm mt-1">{notification.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-400">
                                    No notifications to show
                                </div>
                            )}
                        </div>
                    </OverlayPanel>
                    </i>
                </li>
                <li className={`${activeTab === 'account' ? 'text-[#080808] bg-[#C7EE7C]' : ''} rounded-[100%] w-[50px] h-[50px] flex items-center justify-center hover:cursor-pointer`} onClick={() => onTabChange('account')}>
                    <i className='pi pi-user' style={{ fontSize: '1.5rem' }}></i>
                </li>
            </ul>
        </header>
    );
}