import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Permet de charger Tailwind

// Cette ligne va chercher la div #root que l'on voit sur ton image et y injecte <App />
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)