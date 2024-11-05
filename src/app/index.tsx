import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/ui.css'; 
import  '../../src/output.css'// Import the CSS file

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  const root = createRoot(container);
  root.render(<App />);
});
