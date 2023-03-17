import React from 'react'
import { Routes, Route } from "react-router-dom";
import App from './App';
import Menu from './Menu';
import Serene from './Serene';

function AppRouter() {
  return (
    <div>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path="/kiosk" element={<App />} />
          <Route path="/serene" element={<Serene />} />
          <Route path="*" element={<App />} />
      </Routes>
    </div>
  )
}

export default AppRouter