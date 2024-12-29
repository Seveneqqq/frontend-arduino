import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "primereact/slider";
import { Toast } from 'primereact/toast';
import _ from 'lodash';
import SessionTimedOut from './sessionTimedOut';

export default function SensorAlarmComponent({temperatureRange, humidityRange, setTemperatureRange, setHumidityRange}) {

    const toast = useRef(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [valueTemperature, setValueTemperature] = useState(temperatureRange || [19, 24]);
    const [valueHumidity, setValueHumidity] = useState(humidityRange || [40, 60]);

    useEffect(() => {
        if (temperatureRange && temperatureRange.length === 2) {
            setValueTemperature(temperatureRange);
        }
    }, [temperatureRange]);

    useEffect(() => {
        if (humidityRange && humidityRange.length === 2) {
            setValueHumidity(humidityRange);
        }
    }, [humidityRange]);

    const saveAlarmSettings = async (newTempRange, newHumidityRange) => {
        try {
            const response = await fetch(`http://localhost:4000/api/mongodb/update-alarm/${sessionStorage.getItem('selected-home-id')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({
                    temperatureRange: newTempRange,
                    humidityRange: newHumidityRange
                })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true); 
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to update alarm settings');
            }

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Alarm settings updated successfully',
                life: 3000
            });

        } catch (error) {
            console.error('Error updating alarm settings:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update alarm settings',
                life: 3000
            });
        }
    };

    const debouncedSave = useRef(_.debounce((tempRange, humidRange) => {
        saveAlarmSettings(tempRange, humidRange);
    }, 500)).current;

    const handleTemperatureChange = (e) => {
        const newTemp = e.value;
        setValueTemperature(newTemp);
        setTemperatureRange(newTemp);
        debouncedSave(newTemp, valueHumidity);
    };

    const handleHumidityChange = (e) => {
        const newHumidity = e.value;
        setValueHumidity(newHumidity);
        setHumidityRange(newHumidity);
        debouncedSave(valueTemperature, newHumidity);
    };

    return (
        <div>
            <Toast ref={toast} />
            <SessionTimedOut 
                visible={sessionExpired} 
                setVisible={setSessionExpired}
            />
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Alarm Settings</h2>
            </div>
            <div className='border-t border-gray-700'>
                <div className="card flex flex-col gap-10 mt-8">
                    <div>
                        <h3 className="text-md mb-2">Temperature Range ({valueTemperature[0]}°C - {valueTemperature[1]}°C)</h3>
                        <Slider 
                            value={valueTemperature}
                            onChange={handleTemperatureChange}
                            className="w-full"
                            range
                            min={15}
                            max={35}
                        />
                    </div>
                    <div>
                        <h3 className="text-md mb-2">Humidity Range ({valueHumidity[0]}% - {valueHumidity[1]}%)</h3>
                        <Slider 
                            value={valueHumidity}
                            onChange={handleHumidityChange}
                            className="w-full"
                            range
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}