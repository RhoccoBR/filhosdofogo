import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Mounting React application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
} else {
  // Use a small timeout to ensure the DOM is fully ready
  setTimeout(() => {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React application mounted successfully');
  }, 0);
}
