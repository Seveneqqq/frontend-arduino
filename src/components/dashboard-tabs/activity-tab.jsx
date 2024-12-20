import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';

export default function ActivityTab() {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Alarms', icon: 'pi pi-bell' },
        { label: 'Devices', icon: 'pi pi-video' },
        { label: 'Scenarios', icon: 'pi pi-moon' },
        { label: 'Users', icon: 'pi pi-user' }
    ];

    return (
        <div className="card bg-transparent menu-bg-transparent">
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />
            <div className="tab-content">
                {activeIndex === 0 && <AlarmsTab />}
                {activeIndex === 1 && <DevicesTab />}
                {activeIndex === 2 && <ScenariosTab />}
                {activeIndex === 3 && <UsersTab />}
            </div>
        </div>
    );
}

function DevicesTab() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevicesHistory();
    }, []);

    const fetchDevicesHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/mongodb/devices/history/${sessionStorage.getItem('selected-home-id')}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setDevices(data);
            }
        } catch (error) {
            console.error('Error fetching devices history:', error);
        } finally {
            setLoading(false);
        }
    };

    const actionBodyTemplate = (rowData) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
            ${rowData.action === 'added' ? 'bg-[#C7EE7C] text-[#080808]' : 'bg-red-100 text-red-800'}`}>
            {rowData.action.toUpperCase()}
        </span>
    );

    const statusBodyTemplate = (rowData) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
            ${rowData.device_status === 'active' ? 'bg-[#C7EE7C] text-[#080808]' : 'bg-red-100 text-red-800'}`}>
            {rowData.device_status.toUpperCase()}
        </span>
    );

    const dateBodyTemplate = (rowData) => (
        <span className="text-sm">{new Date(rowData.timestamp).toLocaleString()}</span>
    );

    return (
        <div className="card mt-4">
            <DataTable 
                value={devices}
                showGridlines
                paginator 
                rows={20}
                rowsPerPageOptions={[10, 20, 50]}
                loading={loading}
                sortField="timestamp" 
                sortOrder={-1}
                className="bg-[#151513]"
                emptyMessage="No activity found"
                style={{
                    backgroundColor: '#151513',
                    borderRadius: '0.5rem'
                }}
                paginatorClassName="bg-[#151513]"
            >
                <Column style={{ backgroundColor: '#151513' }} field="timestamp" header="Date & Time" sortable body={dateBodyTemplate} />
                <Column style={{ backgroundColor: '#151513' }} field="device_name" header="Device" sortable />
                <Column style={{ backgroundColor: '#151513' }} field="action" header="Action" sortable body={actionBodyTemplate} />
                <Column style={{ backgroundColor: '#151513' }} field="device_status" header="Status" sortable body={statusBodyTemplate} />
                <Column style={{ backgroundColor: '#151513' }} field="room" header="Room" sortable />
                <Column style={{ backgroundColor: '#151513' }} field="category" header="Category" sortable />
            </DataTable>
        </div>
    );
}

function ScenariosTab() {
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScenariosHistory();
    }, []);

    const fetchScenariosHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/mongodb/scenarios/history/${sessionStorage.getItem('selected-home-id')}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setScenarios(data);
            }
        } catch (error) {
            console.error('Error fetching scenarios history:', error);
        } finally {
            setLoading(false);
        }
    };

    const actionBodyTemplate = (rowData) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
            ${rowData.action === 'added' ? 'bg-[#C7EE7C] text-[#080808]' : 'bg-red-100 text-red-800'}`}>
            {rowData.action.toUpperCase()}
        </span>
    );

    const dateBodyTemplate = (rowData) => (
        <span className="text-sm">{new Date(rowData.timestamp).toLocaleString()}</span>
    );

    return (
        <div className="card mt-4">
            <DataTable 
                value={scenarios}
                showGridlines
                paginator 
                rows={20}
                rowsPerPageOptions={[10, 20, 50]}
                loading={loading}
                sortField="timestamp" 
                sortOrder={-1}
                className="bg-[#151513]"
                emptyMessage="No activity found"
                style={{
                    backgroundColor: '#151513',
                    borderRadius: '0.5rem'
                }}
                paginatorClassName="bg-[#151513]"
            >
                <Column style={{ backgroundColor: '#151513' }} field="timestamp" header="Date & Time" sortable body={dateBodyTemplate} />
                <Column style={{ backgroundColor: '#151513' }} field="scenario_name" header="Scenario" sortable />
                <Column style={{ backgroundColor: '#151513' }} field="action" header="Action" sortable body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
}

function UsersTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsersHistory();
    }, []);

    const fetchUsersHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/mongodb/users/history/${sessionStorage.getItem('selected-home-id')}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users history:', error);
        } finally {
            setLoading(false);
        }
    };

    const actionBodyTemplate = (rowData) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
            ${rowData.action === 'joined' ? 'bg-[#C7EE7C] text-[#080808]' : 'bg-red-100 text-red-800'}`}>
            {rowData.action.toUpperCase()}
        </span>
    );

    const dateBodyTemplate = (rowData) => (
        <span className="text-sm">{new Date(rowData.timestamp).toLocaleString()}</span>
    );

    return (
        <div className="card mt-4">
            <DataTable 
                value={users}
                showGridlines
                paginator 
                rows={20}
                rowsPerPageOptions={[10, 20, 50]}
                loading={loading}
                sortField="timestamp" 
                sortOrder={-1}
                className="bg-[#151513]"
                emptyMessage="No activity found"
                style={{
                    backgroundColor: '#151513',
                    borderRadius: '0.5rem'
                }}
                paginatorClassName="bg-[#151513]"
            >
                <Column style={{ backgroundColor: '#151513' }} field="timestamp" header="Date & Time" sortable body={dateBodyTemplate} />
                <Column style={{ backgroundColor: '#151513' }} field="user_id" header="User ID" sortable />
                <Column style={{ backgroundColor: '#151513' }} field="action" header="Action" sortable body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
}

function AlarmsTab() {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlarmHistory();
    }, []);

    const fetchAlarmHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/mongodb/alarms/history/${sessionStorage.getItem('selected-home-id')}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setAlarms(data);
            }
        } catch (error) {
            console.error('Error fetching alarm history:', error);
        } finally {
            setLoading(false);
        }
    };

    const typeBodyTemplate = (rowData) => (
        <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                ${rowData.type === 'temperature' ? 'bg-[#E3EEFF] text-[#5E85ED]' : 'bg-[#FFE3FF] text-[#CB50CB]'}`}
        >
            {rowData.type.toUpperCase()}
        </span>
    );

    const statusBodyTemplate = (rowData) => (
        <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                ${rowData.status === 'alert' ? 'bg-red-100 text-red-800' : 'bg-[#C7EE7C] text-[#080808]'}`}
        >
            {rowData.status.toUpperCase()}
        </span>
    );

    const valueBodyTemplate = (rowData) => (
        <span className="text-sm">
            {rowData.value}
            {rowData.type === 'temperature' ? '°C' : '%'}
        </span>
    );

    const rangeBodyTemplate = (rowData) => (
        <span className="text-sm">
            {rowData.range[0]} - {rowData.range[1]}
            {rowData.type === 'temperature' ? '°C' : '%'}
        </span>
    );

    const dateBodyTemplate = (rowData) => (
        <span className="text-sm">{new Date(rowData.timestamp).toLocaleString()}</span>
    );

    return (
        <div className="card mt-4">
            <DataTable
                value={alarms}
                showGridlines
                stripedRows
                paginator
                rows={20}
                rowsPerPageOptions={[10, 20, 50]}
                loading={loading}
                sortField="timestamp"
                sortOrder={-1}
                className="bg-[#151513]"
                emptyMessage="No activity found"
                style={{
                    backgroundColor: '#151513',
                    borderRadius: '0.5rem'
                }}
                paginatorClassName="bg-[#151513]"
            >
                <Column
                    field="timestamp"
                    header="Date & Time"
                    sortable
                    body={dateBodyTemplate}
                    style={{ backgroundColor: '#151513' }}
                />
                <Column
                    field="type"
                    header="Type"
                    sortable
                    body={typeBodyTemplate}
                    style={{ backgroundColor: '#151513' }}
                />
                <Column
                    field="status"
                    header="Status"
                    sortable
                    body={statusBodyTemplate}
                    style={{ backgroundColor: '#151513' }}
                />
                <Column
                    field="value"
                    header="Value"
                    sortable
                    body={valueBodyTemplate}
                    style={{ backgroundColor: '#151513' }}
                />
                <Column
                    field="range"
                    header="Acceptable Range"
                    body={rangeBodyTemplate}
                    style={{ backgroundColor: '#151513' }}
                />
            </DataTable>
        </div>
    );
}
