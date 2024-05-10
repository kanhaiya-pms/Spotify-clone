'use client'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';




function App() {


  return (
    <>
  


    <Router>
      <div>
        <nav>
          <ul className='flex justify-between px-10 bg-amber-400 items-center'>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>

    </>

      );
}

export default App;