import React from 'react';
import ReactDOM from 'react-dom/client';

import { PrimeReactProvider } from 'primereact/api';


import App from './App';
import './index.css';
import 'primeicons/primeicons.css';
//import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-dark-blue/theme.css'

import Tailwind from 'primereact/passthrough/tailwind';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: false , pt: Tailwind}}>
    <App />
    </PrimeReactProvider>
  </React.StrictMode>
);

//value={{  unstyled: false , pt: Tailwind }}