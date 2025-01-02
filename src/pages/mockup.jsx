import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import Header from '../components/header.jsx';

const ImageZoomModal = ({ image, onClose }) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-7xl w-full" onClick={handleContentClick}>
        <Button
          icon="pi pi-times"
          className="absolute -top-12 right-0 p-button-rounded p-button-text text-white"
          onClick={onClose}
        />
        <img 
          src={image.itemImageSrc} 
          alt={image.alt} 
          className="max-h-[90vh] w-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

const devices = [
    {
        id: 'gate',
        title: 'Entry Gate',
        description: 'Smart entry gate with remote control capabilities through the application. The system utilizes advanced safety sensors and can be controlled via voice commands.',
        images: [
            {
                itemImageSrc: '/img/mockup/3d-models/brama1.png',
                thumbnailImageSrc: '/img/mockup/3d-models/brama1.png',
                alt: 'Gate View 1'
            },
            {
                itemImageSrc: '/img/mockup/3d-models/brama2.png',
                thumbnailImageSrc: '/img/mockup/3d-models/brama2.png',
                alt: 'Gate View 2'
            }
        ]
    },
    {
        id: 'heatpump',
        title: 'Heat Pump',
        description: 'Energy-efficient heat pump integrated with the smart home system. Automatically adjusts operation based on weather conditions and user preferences.',
        images: [
            {
                itemImageSrc: '/img/mockup/3d-models/pompa1.png',
                thumbnailImageSrc: '/img/mockup/3d-models/pompa1.png',
                alt: 'Heat Pump View 1'
            },
            {
                itemImageSrc: '/img/mockup/3d-models/pompa2.png',
                thumbnailImageSrc: '/img/mockup/3d-models/pompa2.png',
                alt: 'Heat Pump View 2'
            },
            {
                itemImageSrc: '/img/mockup/3d-models/pompa3.png',
                thumbnailImageSrc: '/img/mockup/3d-models/pompa3.png',
                alt: 'Heat Pump View 3'
            }
        ]
    },
    {
        id: 'sensor',
        title: 'Temperature and Humidity Sensor',
        description: 'Precision sensor monitoring environmental conditions in real-time. Data is used for automatic HVAC system regulation.',
        images: [
            {
                itemImageSrc: '/img/mockup/devices/dht11.png',
                thumbnailImageSrc: '/img/mockup/devices/dht11.png',
                alt: 'DHT11 Sensor'
            }
        ]
    },
    {
        id: 'camera',
        title: 'Security Camera',
        description: 'High-resolution IP camera with motion detection and real-time streaming capabilities. Integrated with ESP32-CAM for efficient processing and connectivity.',
        images: [
            {
                itemImageSrc: '/img/mockup/devices/esp32cam.png',
                thumbnailImageSrc: '/img/mockup/devices/esp32cam.png',
                alt: 'ESP32-CAM Module'
            }
        ]
    },
    {
        id: 'lighting',
        title: 'Lighting',
        description: 'Smart lighting system with the ability to create light scenes and schedules. Controlled by servo motors and optimized with diodes for status indication.',
        images: [
            {
                itemImageSrc: '/img/mockup/devices/servo.webp',
                thumbnailImageSrc: '/img/mockup/devices/servo.webp',
                alt: 'Servo Motor'
            },
            {
                itemImageSrc: '/img/mockup/devices/diode.png',
                thumbnailImageSrc: '/img/mockup/devices/diode.png',
                alt: 'LED Diode'
            }
        ]
    }
];

const schemas = [
    {
        itemImageSrc: '/img/mockup/schemas/01.png',
        thumbnailImageSrc: '/img/mockup/schemas/01.png',
        alt: 'Schema 1'
    },
    {
        itemImageSrc: '/img/mockup/schemas/02.png',
        thumbnailImageSrc: '/img/mockup/schemas/02.png',
        alt: 'Schema 2'
    }
];

export default function Mockup() {
    const [openDevice, setOpenDevice] = useState(null);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 2000); 

        return () => clearTimeout(timer);
    }, []);

    const getAnimationClass = (animation, delay = '') => {
        return isInitialLoad ? `${animation} ${delay}` : '';
    };

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    const itemTemplate = (item) => {
        return (
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={item.itemImageSrc} 
                    alt={item.alt} 
                    className="max-h-96 object-contain rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity"
                    style={{ maxWidth: '600px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(item);
                    }}
                />
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        return (
            <img 
                src={item.thumbnailImageSrc} 
                alt={item.alt} 
                className="w-16 h-16 object-cover rounded"
            />
        );
    };

    return (
        <div className="bg-[#1E1E2F] items-center w-full min-h-screen flex flex-col">
            <Header />
            <div className="mt-8 md:mt-16 px-4 md:px-24 max-w-7xl mx-auto w-full">
                <div className={`text-center mb-12 ${getAnimationClass('animate-slideDown')}`}>
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">
                        Smart Home Scale Model
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Physical representation of home automation system
                    </p>
                </div>

                <div className={`mb-16 text-gray-300 text-lg leading-relaxed ${getAnimationClass('animate-slideRight')}`}>
                    <p className="mb-4">
                        The smart home scale model project was developed to provide a physical demonstration of home automation system capabilities. It represents a complete solution that combines modern technologies with practical applications in everyday life.
                    </p>
                    <p>
                        The model showcases all key system elements, from gates and lighting to sensors and temperature control systems. Each component has been carefully designed and 3D printed to best represent the actual components of a smart home.
                    </p>
                </div>

                <div className={`flex justify-center mb-16 ${getAnimationClass('animate-slideLeft', 'animation-delay-200')}`}>
                    <a
                        href="https://github.com/Seveneqqq/3d-models-arduino"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border border-blue-400 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition-colors"
                    >
                        <i className="pi pi-github text-xl"></i>
                        <span>3D Models on GitHub</span>
                    </a>
                </div>

                <div className={`mb-16 ${getAnimationClass('animate-slideRight', 'animation-delay-300')}`}>
                    <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                        Technical Documentation
                    </h2>
                    <div className="bg-[#1e2039] p-6 rounded-xl flex justify-center">
                        <Galleria 
                            value={schemas}
                            responsiveOptions={responsiveOptions}
                            numVisible={5}
                            style={{ maxWidth: '700px' }}
                            containerClassName="flex justify-center"
                            item={itemTemplate}
                            thumbnail={thumbnailTemplate}
                            showThumbnails
                            showIndicators
                            className="custom-galleria"
                        />
                    </div>
                </div>

                <div className={`mb-12 ${getAnimationClass('animate-slideLeft', 'animation-delay-400')}`}>
                    <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">
                        Model Components
                    </h2>
                    <p className="text-gray-300 mb-8 text-center text-lg">
                        Each element of the model has been equipped with real sensors and actuators, 
                        enabling the demonstration of smart home functions at scale.
                    </p>
                    <div className="space-y-4">
                        {devices.map((device, index) => (
                            <div 
                                key={device.id}
                                className={`bg-[#1e2039] rounded-xl overflow-hidden ${
                                    getAnimationClass('animate-slideRight', `animation-delay-${(index + 5) * 100}`)
                                }`}
                            >
                                <Button
                                    onClick={() => setOpenDevice(openDevice === device.id ? null : device.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-blue-400 hover:bg-[#2a2b4a] transition-colors"
                                    text
                                >
                                    <span className="text-xl font-semibold">{device.title}</span>
                                    <i className={`pi ${openDevice === device.id ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
                                </Button>
                                
                                {openDevice === device.id && (
                                    <div className="px-6 py-4">
                                        <p className="text-gray-300 mb-4">{device.description}</p>
                                        <Galleria 
                                            value={device.images}
                                            responsiveOptions={responsiveOptions}
                                            numVisible={5}
                                            style={{ maxWidth: '100%' }}
                                            item={itemTemplate}
                                            thumbnail={thumbnailTemplate}
                                            showThumbnails
                                            showIndicators
                                            className="custom-galleria"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {zoomedImage && (
                <ImageZoomModal 
                    image={zoomedImage} 
                    onClose={() => setZoomedImage(null)} 
                />
            )}
        </div>
    );
}