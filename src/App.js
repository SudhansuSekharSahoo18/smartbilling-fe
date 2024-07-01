import './App.css';
import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Items from './components/view/Items/Items';
import Bills from './components/view/Bills/Bills';
import Barcode from './components/view/Barcode/Barcode';
import Billing from './components/view/Billing/Billing';
import SaleReport from './components/view/SaleReport/SaleReport';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [ipAddress, setIpAddress] = useState(null);
  const notify = (message) => toast.success(message);
  // const history = useHistory();

  // const handleNavigate = (url) => {
  //   history.push(url);
  // };

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
                  <li className='selectedNav'>
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
                  <li>
                      <Link to="/saleReport">Sale Report</Link>
                  </li>
              </ul>
          </nav>
          <ToastContainer />
          <div className='content'>
            <Routes>
                <Route path="/" element={<Items notify={notify} ipAddress={ipAddress} />} />
                <Route path="/pos" element={<Billing notify={notify} ipAddress={ipAddress}/>} />
                <Route path="/bills" element={<Bills notify={notify} ipAddress={ipAddress}/>} />
                <Route path="/generateBarcode" element={<Barcode notify={notify} ipAddress={ipAddress} />} />
                <Route path="/saleReport" element={<SaleReport notify={notify} ipAddress={ipAddress} />} />
            </Routes>
          </div>
      </div>
    </Router>
  );
};

export default App;
