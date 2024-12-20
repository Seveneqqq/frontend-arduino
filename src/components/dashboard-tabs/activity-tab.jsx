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

function DevicesTab(){

}

function ScenariosTab(){

}

function UsersTab(){

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
