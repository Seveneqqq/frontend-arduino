import { Tag } from 'primereact/tag';
import Header from '../components/header.jsx';
const uno = require('../img/uno-r4.png');

export default function HomePage() {
    return (
        <div className="App">
            <div className="bg-[#1E1E2F] w-full min-h-screen items-center flex flex-col">
                <Header />
                
                <div className='mt-24'>
                    <div className="flex items-center gap-2 rounded-full px-6 py-3 bg-blue-900/30 w-fit mb-6">
                        <i className='pi pi-graduation-cap text-sky-400' style={{ fontSize: '1rem' }} />
                        <span className="text-sky-400">Bachelor's Engineering Thesis</span>
                       
                    </div>

                    <div className='flex flex-row w-full'>
                        <div className="w-full flex flex-col gap-6">
                            <div className="space-y-4">
                                <h1 className="text-6xl font-bold text-white">Smart Home</h1>
                                <h2 className="text-6xl font-bold text-blue-400">System</h2>
                                <p className="text-xl text-gray-300">Powered by Arduino</p>
                            </div>

                            <p className="text-gray-400 max-w-lg">
                                Implementation of a Smart Home System
                            </p>

                            <div className="flex gap-3">
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">React</span>
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">Prime-react</span>
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">Tailwind</span>
                                <span className="px-4 py-2 rounded-lg bg-blue-900/20 text-gray-300">Node.js</span>
                            </div>
                            
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    Projects
                                    <i className="pi pi-external-link" style={{ fontSize: '0.9rem' }}></i>
                                </button>
                                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    Contact
                                    <i className="pi pi-envelope" style={{ fontSize: '0.9rem' }}></i>
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <a href="#" className="p-3 rounded-full bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    <i className="pi pi-github" style={{ fontSize: '1.25rem' }}></i>
                                </a>
                                <a href="#" className="p-3 rounded-full bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    <i className="pi pi-linkedin" style={{ fontSize: '1.25rem' }}></i>
                                </a>
                                <a href="#" className="p-3 rounded-full bg-blue-900/20 text-white hover:bg-blue-800/30 transition-all">
                                    <i className="pi pi-instagram" style={{ fontSize: '1.25rem' }}></i>
                                </a>
                            </div>

                        </div>

                        <div className="w-full flex items-center justify-end">
                            <img src={uno} className='w-[70%] h-auto' alt="Arduino Board" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}