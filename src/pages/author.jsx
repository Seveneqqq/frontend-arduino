import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Author() {
    const [sensorValue, setSensorValue] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io('http://localhost:4000', {
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        socket.on('sensorData', (data) => { 
            setSensorValue(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const startSensorReading = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/home/app-start');
            const data = await response.json();
            console.log('Sensor reading started:', data);
        } catch (error) {
            console.error('Error starting sensors:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Author Page</h1>
            
            <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-white ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>

            <button 
                onClick={startSensorReading}
                className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                Start Sensor Reading
            </button>

            <div className="space-y-4">
                
                {sensorValue !== null  && 
                    <>
                        <h2 className="text-xl font-semibold">Wartość odczytu dystans:     {sensorValue.distance || '-'}cm</h2>
                        <h2 className="text-xl font-semibold">Wartość odczytu nawilżenie:  {sensorValue.humidity || '-'}%</h2>
                        <h2 className="text-xl font-semibold">Wartość odczytu temperatura: {sensorValue.temperature || '-'}℃</h2>
                    </>
                }
            </div>
        </div>
    );
}