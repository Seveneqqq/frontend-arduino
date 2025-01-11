import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Header from '../components/header.jsx';


export default function HomePage() {
    const toast = useRef(null);
    const email = 'pawel.boron01@interia.pl';

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        toast.current.show({
            severity: 'success',
            summary: 'Email copied!',
            detail: 'Email address has been copied to clipboard',
            life: 3000
        });
    };

    const showPortfolioMessage = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Portfolio unavailable',
            detail: 'Portfolio website is currently under development',
            life: 3000
        });
    };

    return (
        <div className="App">
            <Toast ref={toast} />
            <div className="bg-[#1E1E2F] w-full min-h-screen items-center flex flex-col">
                <Header />
                
                <div className='mt-24 px-4 md:px-0'>
                    <div className="flex items-center gap-2 rounded-full px-6 py-3 bg-blue-900/30 w-fit mb-6 opacity-0 translate-y-4 animate-slideDown">
                        <i className='pi pi-graduation-cap text-sky-400' style={{ fontSize: '1rem' }} />
                        <span className="text-sky-400 text-sm md:text-base">Bachelor's Engineering Thesis</span>
                    </div>

                    <div className='flex flex-col md:flex-row w-full'>
                        <div className="w-full flex flex-col gap-6">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-6xl font-bold text-white opacity-0 -translate-x-4 animate-slideRight">
                                    Smart Home
                                </h1>
                                <h2 className="text-4xl md:text-6xl font-bold text-blue-400 opacity-0 -translate-x-4 animate-slideRight animation-delay-200">
                                    System
                                </h2>
                                <p className="text-lg md:text-xl text-gray-300 opacity-0 -translate-x-4 animate-slideRight animation-delay-300">
                                    Powered by Arduino
                                </p>
                            </div>

                            <p className="text-gray-400 max-w-lg opacity-0 -translate-x-4 animate-slideRight animation-delay-400">
                                Implementation of a Smart Home System
                            </p>

                            <div className="flex flex-wrap md:flex-nowrap gap-3 opacity-0 -translate-x-4 animate-slideRight animation-delay-500">
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">React</span>
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">Prime-react</span>
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">Tailwind</span>
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">Node.js</span>
                            </div>

                            <div className="flex flex-wrap md:flex-nowrap gap-4 opacity-0 -translate-x-4 animate-slideRight animation-delay-600">
                                <button 
                                    onClick={showPortfolioMessage}
                                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all"
                                >
                                    Projects
                                    <i className="pi pi-external-link" style={{ fontSize: '0.9rem' }}></i>
                                </button>
                                <button 
                                    onClick={copyEmail}
                                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all"
                                >
                                    Contact
                                    <i className="pi pi-envelope" style={{ fontSize: '0.9rem' }}></i>
                                </button>
                            </div>

                            <div className="flex gap-4 opacity-0 -translate-x-4 animate-slideRight animation-delay-700">
                                <a href="https://github.com/Seveneqqq" target="_blank" aria-label="Visit my GitHub profile" className="p-3 rounded-full bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    <i className="pi pi-github" style={{ fontSize: '1.25rem' }}></i>
                                </a>
                                <a href="https://www.linkedin.com/in/seveneqqq" target="_blank" aria-label="Connect with me on LinkedIn" className="p-3 rounded-full bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    <i className="pi pi-linkedin" style={{ fontSize: '1.25rem' }}></i>
                                </a>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-end mt-8 md:mt-0 opacity-0 translate-x-4 animate-slideLeft animation-delay-final">
                            <img src={'img/uno-r4.png'} className='w-full md:w-[70%] h-auto' alt="Arduino Board" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}