import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "primereact/slider";
import { Toast } from 'primereact/toast';

export default function SensorAlarmComponent({temperatureRange, humidityRange, setTemperatureRange, setHumidityRange}) {

    const toast = useRef(null);
    const [valueTemperature, setValueTemperature] = useState(temperatureRange);
    const [valueHumidity, setValueHumidity] = useState(humidityRange);

  return (
    <div>
        <Toast ref={toast} />
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Tasks</h2>
        </div>
        
    </div>
  )
}
