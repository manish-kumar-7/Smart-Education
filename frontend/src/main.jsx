import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom'
import './App.css'
import App from './App.jsx'
import 'react-toastify/ReactToastify.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
    <App />
   </BrowserRouter>
  </StrictMode>,
)
