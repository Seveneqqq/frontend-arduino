import React, { useState } from 'react';
import Header from '../components/header.jsx';

export default function Stack() {
    const [expandedCard, setExpandedCard] = useState(null);

    const stackData = [
        {
            category: "Development & Collaboration",
            technologies: [
                {
                    name: "VS Code & Extensions",
                    icon: "/img/vscode.svg",
                    description: "Primary IDE for development with essential extensions for React, Node.js, and Arduino development. Enhanced with ESLint, Prettier, and Git integration for better code quality and version control."
                },
                {
                    name: "Git & GitHub",
                    icon: "/img/github.svg",
                    description: "Version control system and platform for code collaboration. Used for source code management, feature branching, and project documentation through README files and GitHub features."
                },
                {
                    name: "Postman",
                    icon: "/img/postman.svg",
                    description: "API development and testing tool. Used for testing endpoints, creating API documentation, and validating request/response cycles during development."
                }
            ]
        },
        {
            category: "Frontend",
            technologies: [
                {
                    name: "React 18",
                    icon: "/img/reactjs.svg",
                    description: "Core framework used for building the user interface. Utilizing React 18's features including concurrent rendering and automatic batching for better performance. Enhanced with React Router DOM for navigation and state management."
                },
                {
                    name: "PrimeReact & PrimeFlex",
                    icon: "/img/primereact.svg",
                    description: "Comprehensive UI component library that provides advanced components like data tables, calendars (FullCalendar integration), and animations. PrimeFlex adds flexible grid system and responsive utilities."
                },
                {
                    name: "Tailwind CSS",
                    icon: "/img/tailwind.svg",
                    description: "Utility-first CSS framework used for custom styling and responsive design. Enhanced with tailwind-merge for dynamic class composition and better maintainability."
                }
            ]
        },
        {
            category: "Backend",
            technologies: [
                {
                    name: "Express.js",
                    icon: "/img/express2.svg",
                    description: "Node.js web application framework handling HTTP requests, routing, and middleware integration. Provides RESTful API endpoints for frontend-backend communication."
                },
                {
                    name: "MongoDB & Mongoose",
                    icon: "/img/mongodb.svg",
                    description: "NoSQL database used for storing application data with Mongoose ODM for schema definition and data validation. Used alongside MySQL for specific data requirements."
                },
                {
                    name: "Socket.IO",
                    icon: "/img/socketio.svg",
                    description: "Real-time bidirectional event-based communication between devices and server. Enables instant updates for device states and user interactions."
                }
            ]
        },
        {
            category: "Integrations & Testing",
            technologies: [
                {
                    name: "Google Gemini AI",
                    icon: "/img/gemini.svg",
                    description: "AI integration using Google's Generative AI for intelligent assistant features and natural language processing capabilities."
                },
                {
                    name: "SerialPort",
                    icon: "/img/arduino.svg",
                    description: "Node.js library for serial port communication with Arduino devices. Handles low-level communication between server and hardware components."
                },
                {
                    name: "Jest & Supertest",
                    icon: "/img/jest.svg",
                    description: "Testing framework for both frontend and backend code. Includes API testing with Supertest and MongoDB memory server for integration tests."
                }
            ]
        },
    ];

    return (
        <>
            <div className="bg-[#1E1E2F] w-full min-h-screen items-center flex flex-col">
                <Header />
                <div className="mt-8 md:mt-16 px-4 md:px-24 max-w-7xl mx-auto w-full">
                    {/* Title Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 opacity-0 animate-slideDown">
                            Technology Stack
                        </h1>
                        <p className="text-gray-400 mt-2 opacity-0 animate-slideDown animation-delay-200">
                            Complete technical stack powering the Smart Home System
                        </p>
                    </div>

                    {/* Stack Categories */}
                    <div className="space-y-6 mb-10">
                        {stackData.map((category, categoryIndex) => (
                            <div 
                                key={category.category}
                                className="opacity-0 animate-slideRight"
                                style={{ animationDelay: `${(categoryIndex + 1) * 200}ms` }}
                            >
                                <h2 className="text-2xl font-bold text-blue-400 mb-4">{category.category}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {category.technologies.map((tech, techIndex) => (
                                        <div
                                            key={tech.name}
                                            className={`bg-[#1e2039] rounded-xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-[#232442] ${expandedCard === `${category.category}-${tech.name}` ? 'md:col-span-3' : ''}`}
                                            onClick={() => setExpandedCard(expandedCard === `${category.category}-${tech.name}` ? null : `${category.category}-${tech.name}`)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <img 
                                                        src={tech.icon} 
                                                        alt={tech.name} 
                                                        className="w-8 h-8 mr-3"
                                                    />
                                                    <h3 className="text-lg font-medium text-blue-400">
                                                        {tech.name}
                                                    </h3>
                                                </div>
                                                <svg 
                                                    className={`w-5 h-5 text-blue-400 transform transition-transform duration-300 ${expandedCard === `${category.category}-${tech.name}` ? 'rotate-180' : ''}`}
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            <div className={`overflow-hidden transition-all duration-300 ${expandedCard === `${category.category}-${tech.name}` ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {tech.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}