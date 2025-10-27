import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Import Page Components
import HomePage from './pages/HomePage.jsx';
import ApiDataPage from './pages/ApiDataPage.jsx';

// Define the routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the main layout
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/api-data',
        element: <ApiDataPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);