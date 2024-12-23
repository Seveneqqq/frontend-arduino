import React, { useEffect, useRef, useState } from 'react';

const CameraStreamComponent = ({cameraAdded, cameraAddress}) => {
  const streamUrl = cameraAddress;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="xl:h-[210px] h-[500px] flex flex-col rounded-xl overflow-hidden">
        <div className="px-4 py-1 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold">Camera</h2>
        </div>
        
        {cameraAdded ? (
          <img
            src={streamUrl}
            alt="ESP32-CAM Stream"
            className="inset-0 w-full h-full object-contain mt-2" // w-full h-full object-contain
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <svg 
              className="w-12 h-12 mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-center">
              Camera not added to the system or connection problem occurred
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <img
              src={streamUrl}
              alt="ESP32-CAM Stream Full Screen"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraStreamComponent;