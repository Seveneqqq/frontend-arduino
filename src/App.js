import React from "react";
import Header from './components/header.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import AddNewAppHome from "./pages/add-new-app-home.jsx";
import LoginAppHome from "./pages/login-app-home.jsx";
import PanelDashboard from "./pages/panel-dashboard.jsx";
import Author from "./pages/author";
import Details from "./pages/details.jsx";
import Stack from "./pages/stack.jsx";
import Mockup from "./pages/mockup.jsx";
import '@fontsource/inter';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useState } from 'react';

export default function App() {

    return (
        <BrowserRouter>
           <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/author" element={<Author />} />
                <Route path="/details" element={<Details />} />
                <Route path="/stack" element={<Stack />} />
                <Route path="/mockup" element={<Mockup />} />
                <Route path="/add-new-app-home" element={<AddNewAppHome />} />
                <Route path="/login-app-home" element={<LoginAppHome />} />
                <Route path="/panel-dashboard" element={<PanelDashboard/>} />
            </Routes>
        </BrowserRouter>
    );
}




