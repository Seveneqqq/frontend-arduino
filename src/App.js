import React from "react";
import Header from './components/header.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import AddNewAppHome from "./pages/add-new-app-home.jsx";
import LoginAppHome from "./pages/login-app-home.jsx";
// import Author from "../pages/author";
// import SpeechApi from "../pages/speechApi.jsx";
// import Stack from "../pages/stack.jsx";
// import Database from "../pages/database.jsx";
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
               {/* <Route path="/author" element={<Author />} />
               <Route path="/speech-api" element={<SpeechApi />} />
               <Route path="/stack" element={<Stack />} />
               <Route path="/database" element={<Database />} />*/}
               <Route path="/add-new-app-home" element={<AddNewAppHome />} />
               <Route path="/login-app-home" element={<LoginAppHome />} />
            </Routes>
        </BrowserRouter>
    );
}




