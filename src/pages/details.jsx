import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import Header from '../components/header.jsx';

export default function Details() {
    const [images, setImages] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const responsiveOptions = [
        { breakpoint: '991px', numVisible: 4 },
        { breakpoint: '767px', numVisible: 3 },
        { breakpoint: '575px', numVisible: 1 }
    ];

    const galleryImages = [
        {
            itemImageSrc: '/details/1.png',
            thumbnailImageSrc: '/details/1.png',
            alt: 'Smart Home Dashboard',
            title: 'Main Dashboard View'
        },
        {
            itemImageSrc: '/details/2.png',
            thumbnailImageSrc: '/details/2.png',
            alt: 'Automation Settings',
            title: 'Automation Configuration'
        },
        {
            itemImageSrc: '/details/3.png',
            thumbnailImageSrc: '/details/3.png',
            alt: 'Device Control Panel',
            title: 'Device Management Interface'
        },
        {
            itemImageSrc: '/details/4.png',
            thumbnailImageSrc: '/details/4.png',
            alt: 'Alarms and history Monitoring',
            title: 'Alarms and history monitoring'
        },
        {
            itemImageSrc: '/details/5.png',
            thumbnailImageSrc: '/details/5.png',
            alt: 'Security Controls',
            title: 'Security System Overview'
        },
        {
            itemImageSrc: '/details/6.png',
            thumbnailImageSrc: '/details/6.png',
            alt: 'System Settings',
            title: 'Advanced System Configuration'
        }
    ];

    useEffect(() => {
        setImages(galleryImages);
    }, []);

    const itemTemplate = (item) => {
        return (
            <div className="cursor-pointer" onClick={() => setSelectedImage(item)}>
                <img src={item.itemImageSrc} alt={item.alt} className="w-full rounded-lg" />
                <div className="text-center mt-2 text-blue-400">{item.title}</div>
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        return <img src={item.thumbnailImageSrc} alt={item.alt} className="rounded" />
    };

    return (
        <>
            <div className="bg-[#1E1E2F] w-full min-h-screen items-center flex flex-col">
                <Header />
                <div className="mt-4 md:mt-6 px-4 md:px-24 max-w-7xl mx-auto w-full">
                    
                    <div className="text-center mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 opacity-0 animate-slideDown">
                            Smart Home System
                        </h1>
                        <p className="text-gray-400 mt-2 opacity-0 animate-slideDown animation-delay-200">
                            Advanced home automation platform with Arduino integration
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-[#1e2039] p-6 rounded-xl opacity-0 animate-slideRight animation-delay-400">
                            <h2 className="text-2xl font-bold text-blue-400 mb-4">About the System</h2>
                            <p className="text-gray-300 leading-relaxed">
                            The Smart Home System offers comprehensive home automation with advanced features like customizable scenarios for different situations and detailed device management with room assignment capabilities. The integrated security system includes camera connectivity and multi-level user roles for enhanced access control. All API endpoints are secured using JWT (JSON Web Token) authentication and protected by custom middleware that verifies token validity for each request, ensuring secure access to system resources. What makes this system unique is its intelligent assistant powered by Gemini AI, which provides personalized guidance and recommendations to users. The system supports both voice control for devices and scenarios, making it intuitive and hands-free to use. Through its modern web interface, users can easily monitor and control all aspects of their smart home, from device states to automation scenarios.
                            </p>
                        </div>

                        <div className="bg-[#1e2039] p-6 rounded-xl opacity-0 animate-slideLeft animation-delay-500">
                            <h2 className="text-2xl font-bold text-blue-400 mb-4">Key Features</h2>
                            <ul className="text-gray-300 space-y-3">
                            <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Voice Control
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Custom Scenarios
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Room-Based Device Management
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    AI Assistant (Gemini) Integration
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Security System with Cameras
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Multi-level User Roles
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Secured API with JWT Authentication
                                </li>
                            </ul>
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-blue-400 mb-6">Project Repositories</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <a 
                                        href="https://github.com/Seveneqqq/frontend-arduino" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="border border-blue-400 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Frontend
                                    </a>
                                    <a 
                                        href="https://github.com/Seveneqqq/backend-arduino" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="border border-blue-400 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Backend
                                    </a>
                                    <a 
                                        href="https://github.com/Seveneqqq/smarthome-code-arduino" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="border border-blue-400 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        Arduino Code
                                    </a>
                                    <a 
                                        href="https://github.com/Seveneqqq/3d-models-arduino" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="border border-blue-400 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-colors text-center whitespace-nowrap"
                                    >
                                        3D Models
                                    </a>

                                </div>
                                </div>
                        </div>
                    </div>

                    

                    <div className="opacity-0 animate-slideRight animation-delay-300">
                        <div className="bg-[#1e2039] p-6 rounded-xl">
                            <Galleria 
                                value={images} 
                                responsiveOptions={responsiveOptions}
                                numVisible={5}
                                className="max-w-8xl mx-auto"
                                item={itemTemplate}
                                thumbnail={thumbnailTemplate}
                                showThumbnails={true}
                                showIndicators
                                showItemNavigators
                                circular
                                autoPlay
                                transitionInterval={3000}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-7xl w-full bg-[#1e2039] rounded-xl p-4">
                        <button
                            className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage.itemImageSrc}
                            alt={selectedImage.alt}
                            className="w-full h-auto rounded-lg"
                        />
                        <p className="text-blue-400 text-xl text-center mt-4">{selectedImage.title}</p>
                    </div>
                </div>
            )}
        </>
    );
}