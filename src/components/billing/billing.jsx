import './Billing.css';
import React, { useRef,useEffect,useState } from 'react';
import { ReactToPrint } from 'react-to-print';
import Grid from '../Grid/Grid';
import Table from '../TableContainer/Table';

const Billing = () => {

  const [shopName, setShopName] = useState('Nandini Fashion');
  const [address, setAddress] = useState('Motto, Chandabali, Bhadrak');
  const [gstNumber, setGstNumber] = useState('2347JDKJDGK&56757');
  const [billNumber, setBillNumber] = useState('12345');
  const [customerName, setCustomerName] = useState('System');
  const componentRef = useRef(null);
  const reactToPrintRef = useRef();
  const [inputValue, setInputValue] = useState('');
  // const [items, setItems] = useState([]);
  const [dbItems, setDbItems] = useState([]);

  const [items, setItems] = useState([]);

  const handleInputChange = (event) => {
      setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };
  const handleClick = () => {
    if (inputValue.trim() !== '') {
      let dbItem = dbItems.find(x => x.barcode === inputValue)
      // console.log('item -> '+dbItem)
      if(dbItem !== undefined)
      {
        let currentItemIndex = items.findIndex(x => x.id === dbItem.id)
        let item = items[currentItemIndex];
        if(item === undefined)
        {
          let item = {id: dbItem.id, barcode: dbItem.barcode, itemName: dbItem.itemName, price: dbItem.price, quantity: 1}
          setItems([...items, item]);
        }
        else
        {
          item.quantity += 1;
          items[currentItemIndex] = item;
          console.log(items)
          setItems([...items])
        }

        setInputValue('');
      }
      else
      {
        alert('No item found');
      }
  }
  };

  const getTotalSum = () => {
    let sumTotal = 0;
    items.forEach(x => sumTotal += x.price * x.quantity);

    return sumTotal;
  };

  const handleCtrlP = () => {
    console.log('Ctrl + P was pressed');
    alert('Ctrl + P was pressed');
    handlePrint();
  };

  const handlePrint = () => {
    if (reactToPrintRef.current) {
      reactToPrintRef.current.handlePrint();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault(); 
            handleCtrlP();
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    fetch('http://192.168.0.106:91/item') // Replace with your API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // setData(data);
        // setLoading(false);
        console.log(data)
        setDbItems(data);
      })
      .catch(error => {
        alert(error);
        const defaultItems = [
            {id: 1, barcode: "101", itemName: 'Saree', price: 500}, 
            {id: 2, barcode: "102", itemName: 'Jeans', price: 1500}, 
            {id: 3, barcode: "103", itemName: 'Shirt', price: 400}, 
            {id: 4, barcode: "104", itemName: 'Socks', price: 150}, 
            {id: 5, barcode: "105", itemName: 'Lungi', price: 80}, 
          ];
        setDbItems(defaultItems)
        // setLoading(false);
      });
  }, []);

  return (
    <div>
        <div>
      <input type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter barcode"
      />
      <button onClick={handleClick}>Submit</button>
      <ReactToPrint
          trigger={() => {
            return <button>Print Bill</button>;
          }}
          content={() => componentRef.current}
          ref={reactToPrintRef}
        />
      
      <Table items={items}/>
    </div>

      {/* print */}
      <div className='print-area'>
        
        <div ref={componentRef}>
          <div style={{fontSize:'20px', margin:'0px'}}>{shopName}</div>
          <div style={{fontSize:'15px', margin:'0px'}}>{address}</div>
          <div style={{fontSize:'15px', margin:'0px'}}>GSTIN: {gstNumber}</div>
          <div style={{fontSize:'20px', margin:'0px'}}>Retail Invoice</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Bill Number: {billNumber}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Date: {billNumber}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Name: {customerName}</div>
          <table border="1">
            <thead>
                <tr>
                    <th>Barcode</th>
                    <th>ItemName</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {items.length > 0 && items.map((item, index) => (
                    <tr key={index}>
                        <td>{item.barcode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price * item.quantity}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div style={{fontSize:'12px', margin:'0px'}}>Total {getTotalSum()}</div>
        <div style={{fontSize:'12px', margin:'0px'}}>GST 5% {getTotalSum() * 0.05}</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Total Amount {getTotalSum() * 1.05}</div>
        <div>------------------------------------------------</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Total {getTotalSum()}</div>
        <div style={{fontSize:'12px', margin:'0px'}}>CGST 2.5%{getTotalSum() * 0.025}</div>
        <div style={{fontSize:'12px', margin:'0px'}}>SGST 2.5%{getTotalSum() * 1.025}</div>
        <div>------------------------------------------------</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Terms & Conditions:</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Subject to {shopName} No cash return No gurantee on the products</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Exchange within 15 days with barcode sticker & bill</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Thank you Shopping with us</div>
        <div style={{fontSize:'12px', margin:'0px'}}>Visit again!!!</div>
        </div>
      </div>
    </div>
    
  );
};

export default Billing;
