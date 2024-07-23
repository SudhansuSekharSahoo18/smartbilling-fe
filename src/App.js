import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Items from './components/view/Items/Items';
import Bills from './components/view/Bills/Bills';
import BarcodeView from './components/view/Barcode/BarcodeView';
import Billing from './components/view/Billing/Billing';
import SaleReport from './components/view/SaleReport/SaleReport';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [ipAddress, setIpAddress] = useState(null);
  const [selectedTab, setSelectedTab] = useState('');
  const notify = (message) => toast.success(message);
  // const history = useHistory();

  // const handleNavigate = (url) => {
  //   history.push(url);
  // };

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        if (process.env.REACT_APP_ENVIRONMENT === 'DEVELOPMENT')
          setIpAddress(data.backend_url + 'api/')
        else if (process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION')
          setIpAddress(data.backend_url_PROD + 'api/')

        throw new Error('Please setup the env to PRODUCTION');
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <ul>
            <li className={selectedTab === '' ? 'selectedNav' : ''}>
              <Link to="/"><div onClick={() => setSelectedTab('')}>Stock</div></Link>
            </li>
            <li className={selectedTab === 'pos' ? 'selectedNav' : ''}>
              <Link to="/pos"><div onClick={() => setSelectedTab('pos')}>Billing</div></Link>
            </li>
            <li className={selectedTab === 'bills' ? 'selectedNav' : ''}>
              <Link to="/bills"><div onClick={() => setSelectedTab('bills')}>Bills</div></Link>
            </li>
            <li className={selectedTab === 'generateBarcode' ? 'selectedNav' : ''}>
              <Link to="/generateBarcode"><div onClick={() => setSelectedTab('generateBarcode')}>Barcode</div></Link>
            </li>
            <li className={selectedTab === 'saleReport' ? 'selectedNav' : ''}>
              <Link to="/saleReport"><div onClick={() => setSelectedTab('saleReport')}>Sale Report</div></Link>
            </li>
          </ul>
        </nav>
        <ToastContainer />
        <div className='content'>
          <Routes>
            <Route path="/" element={<Items notify={notify} ipAddress={ipAddress} />} />
            <Route path="/pos" element={<Billing notify={notify} ipAddress={ipAddress} />} />
            <Route path="/bills" element={<Bills notify={notify} ipAddress={ipAddress} />} />
            <Route path="/generateBarcode" element={<BarcodeView notify={notify} ipAddress={ipAddress} />} />
            <Route path="/saleReport" element={<SaleReport notify={notify} ipAddress={ipAddress} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
