import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { Toaster } from 'sonner';






ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <App />
    <Toaster richColors theme='dark' position='bottom-right' closeButton/>
  </>
  // </React.StrictMode>
)
