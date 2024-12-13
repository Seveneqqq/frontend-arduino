import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export default function AutomationTab({ automations = [], deviceStates }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAutomations = automations.filter(automation =>
    automation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex xl:flex-row flex-col xl:gap-0 gap-4 justify-between items-center mb-4">
        <h2 className="text-2xl">Automation</h2>
        <div className="flex md:flex-row flex-col gap-4 items-center">
          <IconField iconPosition="left" className='flex items-center'>
            <InputIcon className="pi pi-search" />
            <InputText 
              placeholder="Search..." 
              value={searchQuery}
              className='px-10 text-slate-50'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </IconField>
          <Button 
            label="Add new" 
            icon="pi pi-plus" 
            className="p-button-success md:w-[unset] w-[100%]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAutomations.map(automation => (
          <div 
            key={automation._id} 
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{automation.name}</h3>
            <div className="space-y-2">
              {automation.devices.map(device => (
                <div key={device._id} className="text-sm text-gray-600">
                  {device.device_name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}