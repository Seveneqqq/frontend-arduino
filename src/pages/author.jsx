import React from 'react';
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

const navigationItems = [
    { id: 'technologies', icon: 'pi pi-code', title: 'Technologies' },
    { id: 'certificates', icon: 'pi pi-trophy', title: 'Certificates' },
    { id: 'links', icon: 'pi pi-external-link', title: 'Links' }
];

export default function Author() {
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
                    <h2 id="certificates" className="text-4xl md:text-5xl font-bold text-center text-blue-400 mb-12 opacity-0 animate-slideDown animation-delay-final">Certificates</h2>
                    
                </div>
            </div>

            <div className="w-full min-h-screen bg-[#1E1E2F] py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h2 id="links" className="text-4xl md:text-5xl font-bold text-center text-blue-400 mb-12 opacity-0 animate-slideDown animation-delay-final">Links</h2>
                   
                </div>
            </div>
        </>
    );
}