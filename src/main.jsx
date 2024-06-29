import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminContextProvider from './Contexts/AdminContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AdminContextProvider>
    <App />
  </AdminContextProvider>
);
