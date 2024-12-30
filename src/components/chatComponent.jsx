import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import SessionTimedOut from './sessionTimedOut';

const ChatComponent = () => {

    const [sessionExpired, setSessionExpired] = useState(false);
    const [messages, setMessages] = useState([{
        text: "Hello! I am your Smart Home Assistant. I can help you with quick answers about recipes, mathematical calculations, and general knowledge questions. Note that while I can provide information and guidance, I cannot directly control your home devices. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
    }]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            text: inputMessage,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/assistant/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('AuthToken')
                },
                body: JSON.stringify({ prompt: inputMessage })
            });

            if (response.status === 401 || response.status === 403) {
                setSessionExpired(true); 
                return;
            }

            const data = await response.json();

            if (data.success) {
                const assistantMessage = {
                    text: data.response,
                    isUser: false,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                text: 'Sorry, I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="xl:h-[342px] h-[500px] flex flex-col rounded-xl overflow-hidden">
            <SessionTimedOut 
                visible={sessionExpired} 
                setVisible={setSessionExpired}
            />
            <div className="px-4 py-1 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-lg font-semibold">Smart Home Assistant</h2>
            </div>
            
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                message.isUser 
                                    ? 'bg-[#5E85ED] text-white'
                                    : 'bg-[#2A2A28] text-gray-100'
                            }`}
                        >
                            <div className="text-sm">{message.text}</div>
                            <div className="text-xs mt-1 opacity-70">
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[#2A2A28] text-gray-100 rounded-2xl px-4 py-1">
                            <i className="pi pi-spin pi-spinner" />
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-2 border-t border-gray-700 flex-shrink-0">
                <div className="flex gap-2">
                    <InputText
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button
                        icon="pi pi-send"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="p-button-rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;