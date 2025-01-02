import React from 'react';
import { useState } from 'react';
import Header from '../components/header.jsx';
const CV = require('../downloads/CV.pdf');

const technologies = [
    { name: 'HTML', icon: '/img/html.svg' },
    { name: 'CSS', icon: '/img/css.svg' },
    { name: 'JavaScript', icon: '/img/javascript.svg' },
    { name: 'React.js', icon: '/img/reactjs.svg' },
    { name: 'Node.js', icon: '/img/nodejs.svg' },
    { name: 'Express.js', icon: '/img/express2.svg' },
    { name: 'MongoDB', icon: '/img/mongodb.svg' },
    { name: 'MySQL', icon: '/img/mysql.svg' },
    { name: 'Tailwind', icon: '/img/tailwind.svg' },
    { name: 'PHP', icon: '/img/php.svg' },
    { name: 'C#', icon: '/img/csharp.svg' },
    { name: 'Arduino', icon: '/img/arduino.svg' }
];

const certificates = [
    { 
        id: 1,
        name: "C#",
        image: "/certificates/csharp.jpg"
    },
    { 
        id: 2,
        name: "JavaScript basics",
        image: "/certificates/javascript.png"
    },
    { 
        id: 3,
        name: "MongoDB",
        image: "/certificates/mongodb.jpg"
    },
];

const socialLinks = [
    {
        name: 'GitHub',
        url: 'https://github.com/Seveneqqq',
        icon: (
            <svg 
                className="w-12 h-12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
        )
    },
    {
        name: 'HackerRank',
        url: 'https://www.hackerrank.com/seveneqqq',
        icon: (
            <svg 
                className="!w-12 !h-12" 
                viewBox="0 0 32 32" 
                fill="currentColor"
            >
                <path d="M16 0c1.714 0 13 6.516 13.854 8 0.859 1.484 0.859 14.516 0 16s-12.141 8-13.854 8c-1.714 0-13-6.516-13.859-8-0.854-1.484-0.854-14.516 0-16 0.859-1.484 12.146-8 13.859-8zM19.063 9.068c-0.193 0-0.349 0.151-0.349 0.344v5.167h-5.427v-5.37h0.932c0.188 0 0.339-0.151 0.339-0.344 0-0.125-0.068-0.234-0.161-0.292l-2.099-2.010c-0.063-0.089-0.188-0.146-0.302-0.146-0.109 0-0.214 0.057-0.276 0.141l-2.24 2.016c-0.094 0.063-0.161 0.167-0.161 0.292 0 0.188 0.151 0.344 0.344 0.344h0.938l0.010 13.38c0 0.193 0.146 0.344 0.339 0.344h1.99c0.188 0 0.344-0.151 0.344-0.344v-5.339h5.432v5.536h-0.932c-0.193 0-0.344 0.156-0.344 0.344 0 0.125 0.068 0.234 0.161 0.292l2.104 2.016c0.057 0.083 0.188 0.146 0.302 0.146s0.208-0.063 0.276-0.146l2.24-2.016c0.094-0.057 0.161-0.167 0.161-0.292 0-0.188-0.156-0.344-0.344-0.344h-0.938l-0.010-13.375c0-0.198-0.151-0.349-0.339-0.349h-1.99z"/>
            </svg>
        )
    },
    {
        name: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/users/paweboro-9930/',
        icon: (
            <svg 
                className="w-12 h-12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
            </svg>
        )
    }
];


const navigationItems = [
    { id: 'technologies', icon: 'pi pi-code', title: 'Technologies' },
    { id: 'certificates', icon: 'pi pi-trophy', title: 'Certificates' },
    { id: 'links', icon: 'pi pi-external-link', title: 'Links' }
];

export default function Author() {

    const [selectedCert, setSelectedCert] = useState(null);
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <div className="bg-[#1E1E2F] w-full min-h-screen items-center flex flex-col">
                <Header />
                <div className="mt-16 md:mt-32 px-4 md:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start gap-8 md:gap-0">
                        <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8">
                            <div className="space-y-4 md:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white opacity-0 animate-slideRight text-center md:text-left">
                                    Hello
                                </h1>
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-blue-400 opacity-0 animate-slideRight animation-delay-200 text-center md:text-left">
                                    I'm Paweł 👋
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-gray-300 opacity-0 animate-slideRight animation-delay-300 text-center md:text-left">
                                    Junior fullstack developer
                                </p>
                            </div>
                            <p className="text-gray-400 max-w-lg opacity-0 animate-slideRight animation-delay-400 mt-2 md:mt-4 text-center md:text-left">
                                Computer Science student at the University <br /> of Silesia in Katowice
                            </p>
                            <div className="flex justify-center md:justify-start flex-wrap md:flex-nowrap gap-3 opacity-0 animate-slideRight animation-delay-500">
                                <a 
                                    href={CV}
                                    download="CV_Pawel_Boron.pdf"
                                    className="group relative inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-500/10 rounded-lg text-blue-400 font-medium transition-all duration-300 hover:bg-blue-500/20"
                                >
                                    <svg 
                                        className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                        />
                                    </svg>
                                    Download CV
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-8 md:mt-0 opacity-0 animate-slideLeft animation-delay-600">
                            <div className="relative">
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-blue-500/10 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <svg 
                                        className="w-24 h-24 md:w-32 md:h-32 text-blue-400 transition-transform duration-300 group-hover:scale-110" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="1.5"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 md:mt-20 flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center px-4 md:px-0">
                        {navigationItems.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="relative flex flex-col justify-between w-full h-24 md:h-32 px-8 py-6 bg-[#1a1b30] rounded-xl text-blue-400 transition-all duration-300 hover:bg-[#232442] opacity-0 animate-slideDown cursor-pointer"
                                style={{ animationDelay: `${1700 + (index * 200)}ms` }}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-xl md:text-2xl">{item.title}</span>
                                    <i className={`${item.icon}`} style={{ fontSize: '1.5rem' }}></i>
                                </div>
                                <i className="pi pi-angle-double-down flex w-full text-end align-bottom" style={{ fontSize: '1rem' }}></i>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full min-h-screen bg-[#1E1E2F] py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h2 id="technologies" className="text-4xl md:text-5xl font-bold text-center text-blue-400 mb-16 opacity-0 animate-slideDown animation-delay-final">Technologies</h2>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-22">
                            {technologies.map((tech, index) => (
                                <div
                                    key={tech.name}
                                    className="bg-[#1e2039] w-56 h-56 p-6 rounded-xl transform transition-all duration-300 hover:scale-105 hover:bg-[#232442] group flex flex-col items-center justify-between opacity-0 animate-slideDown"
                                    style={{ animationDelay: `${2000 + (index * 100)}ms` }}
                                >
                                    <div className="flex-1 flex items-center justify-center w-full">
                                        <img
                                            src={tech.icon}
                                            alt={tech.name}
                                            className="w-36 h-36 object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-center text-blue-400 font-medium text-sm mt-2">{tech.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full min-h-screen bg-[#1E1E2F] py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 id="certificates" className="text-4xl md:text-5xl font-bold text-center text-blue-400 mb-12 opacity-0 animate-slideDown animation-delay-final">
                    Certificates
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert, index) => (
                        <div
                            key={cert.id}
                            className="bg-[#1e2039] flex flex-col justify-between rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-[#232442] cursor-pointer opacity-0 animate-slideRight"
                            style={{ animationDelay: `${2000 + (index * 100)}ms` }}
                            onClick={() => setSelectedCert(cert)}
                        >
                            <div className="aspect-w-16 aspect-h-9 mb-4">
                                <img
                                    src={cert.image}
                                    alt={cert.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <h3 className="text-blue-400 font-medium text-lg text-center">
                                {cert.name}
                            </h3>
                        </div>
                    ))}
                </div>

                {selectedCert && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedCert(null)}
                    >
                        <div 
                            className="relative max-w-4xl w-full bg-[#1e2039] rounded-xl p-4 animate-slideDown"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors"
                                onClick={() => setSelectedCert(null)}
                            >
                                <svg 
                                    className="w-6 h-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                </svg>
                            </button>
                            <img
                                src={selectedCert.image}
                                alt={selectedCert.name}
                                className="w-full h-auto rounded-lg"
                            />
                            <h3 className="text-blue-400 font-medium text-xl text-center mt-4">
                                {selectedCert.name}
                            </h3>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="w-full min-h-screen bg-[#1E1E2F] py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 id="links" className="text-4xl md:text-5xl font-bold text-center text-blue-400 mb-12 opacity-0 animate-slideDown animation-delay-final">
                    Links
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {socialLinks.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1e2039] rounded-xl p-8 transform transition-all duration-300 hover:scale-105 hover:bg-[#232442] group opacity-0 animate-slideRight flex items-center justify-center"
                            style={{ animationDelay: `${2000 + (index * 100)}ms` }}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-300">
                                    {link.icon}
                                </div>
                                <h3 className="text-blue-400 font-medium text-xl text-center group-hover:text-blue-300">
                                    {link.name}
                                </h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}