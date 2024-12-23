import React, { useEffect, useRef, useState } from 'react';

const CameraStreamComponent = ({cameraAdded, cameraAddress, onSaveAddress, onDeleteCamera}) => {
  const streamUrl = cameraAddress;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(!cameraAdded);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (!newAddress) {
      setError('Camera address is required');
      return;
    }
    if (!validateUrl(newAddress)) {
      setError('Please enter a valid URL');
      return;
    }
    console.log("Calling onSaveAddress with:", newAddress);
    onSaveAddress(newAddress);
    setError('');
    setIsEditing(false);
  };

  useEffect(() => {
    setIsEditing(!cameraAdded);
    if (cameraAdded) {
      setNewAddress(cameraAddress);
    }
  }, [cameraAdded, cameraAddress]);

  return (
    <>
      <div className="xl:h-[210px] h-[500px] flex flex-col rounded-xl overflow-hidden">
        <div className="px-4 py-1 border-b border-gray-700 flex-shrink-0 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Camera</h2>
          {cameraAdded && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
          )}
        </div>
        
        {!isEditing ? (
          <img
            src={streamUrl}
            alt="ESP32-CAM Stream"
            className="inset-0 w-full h-full object-contain mt-2"
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
            
            <div className="w-full max-w-md space-y-2">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter camera URL (e.g., http://192.168.1.100:81/stream)"
                className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {cameraAdded ? 'Update Camera' : 'Connect Camera'}
                </button>
                {cameraAdded && (
                  <>
                    <button
                      onClick={() => {
                        onDeleteCamera();
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewAddress(cameraAddress);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            backdropFilter: 'blur(8px)' 
          }}
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