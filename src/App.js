import './App.css';
import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Items from './components/view/Items/Items';
import Bills from './components/view/Bills/Bills';
import Barcode from './components/view/Barcode/Barcode';
import Billing from './components/view/Billing/Billing';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [ipAddress, setIpAddress] = useState(null);
  const notify = (message) => toast.success(message);

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        setIpAddress(data.backend_url+'api/')
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return (
    <Router>
      <div className="app">
          <nav className="nav">
              <ul>
                  <li>
                      <Link to="/">Stock</Link>
                  </li>
                  <li>
                      <Link to="/pos">Pos</Link>
                  </li>
                  <li>
                      <Link to="/bills">Bills</Link>
                  </li>
                  <li>
                      <Link to="/generateBarcode">Barcode</Link>
                  </li>
              </ul>
          </nav>
          <ToastContainer />
          <div className='content'>
            <Routes>
                <Route path="/" element={<Items notify={notify} />} />
                <Route path="/pos" element={<Billing notify={notify} />} />
                <Route path="/bills" element={<Bills notify={notify} />} />
                <Route path="/generateBarcode" element={<Barcode notify={notify} ipAddress={ipAddress} />} />
            </Routes>
          </div>
      </div>
    </Router>
  );
};

export default App;
