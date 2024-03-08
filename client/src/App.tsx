import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer position='bottom-center' limit={4}></ToastContainer>
        <Outlet/>
    </div>
  )
}

export default App
