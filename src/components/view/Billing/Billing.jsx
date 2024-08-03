import './Billing.css';
import React, { useRef, useEffect, useState } from 'react';
import { ReactToPrint } from 'react-to-print';
import Table from '../../TableContainer/Table';
import Report from '../../Report/Report';
// import { AgGridReact } from 'ag-grid-react';
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomInput from '../../CustomInput/CustomInput';
import { formatDate } from '../../../Helper/dateHelper.js'
import { CreateBill, GetAllItems } from '../../../APIEndpoints.js'


const Billing = () => {
  // const [maxId, setMaxId] = useState(0);
  // const emptyBillItem = {
  //   "id": maxId, 'itemId': 0, "barcode": '', "itemName": '',
  //   "price": 0, "quantity": 1, "discountAmount": 0
  // }
  const [ipAddress, setIpAddress] = useState(null);
  // const ipAddress = process.env.REACT_APP_backendUrl+"api/"
  const componentRef = useRef(null);
  const reactToPrintRef = useRef();
  const [inputValue, setInputValue] = useState('');
  // const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([{
    // "id": maxId, 
    'itemId': 0, "barcode": '', "itemName": '',
    "price": 0, "quantity": 1, "discountAmount": 0
  }]);
  const [billNumber, setBillNumber] = useState();
  const [customerName, setCustomerName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [shopName, setShopName] = useState('Shop Name Not Found');
  const [shopAddress, setShopAddress] = useState('Address not found');
  const [shopGstNumber, setShopGstNumber] = useState('GST number not found');
  const shallPrintBill = useRef(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmitButtonClick();
    }
  };
  const onClearButtonClick = () => {
    const billItem = {
      // "id": 0, 
      'itemId': 0, "barcode": '', "itemName": '',
      "price": 0, "quantity": 1, "discountAmount": 0
    }
    setBillItems([billItem])
  }

  const addBlankRow = () => {
    const billItem = {
      'itemId': 0, "barcode": '', "itemName": '',
      "price": 0, "quantity": 1, "discountAmount": 0
    }
    // setMaxId(maxId + 1);
    setBillItems([...billItems, billItem]);
  }

  const onSubmitButtonClick = () => {
    if (inputValue.trim() !== '') {
      // console.log(products)
      let dbItem = products.find(x => x.barcode === inputValue)
      // console.log('dbItem'+dbItem)
      if (dbItem !== undefined) {
        let item = billItems.find(x => x.itemId === dbItem.id)
        if (item === undefined) {
          // const id = billItems.length + 1;
          if (billItems.length === 1 && billItems[0].itemName === '' && billItems[0].price === 0) {
            const item = {
              "itemId": dbItem.id, "barcode": dbItem.barcode, "itemName": dbItem.itemName,
              "price": dbItem.mrp, "quantity": 1, "discountPercentage": dbItem.discountPercentage
            }
            setBillItems([item]);
          }
          else {
            const item = {
              // "id": id, 
              "itemId": dbItem.id, "barcode": dbItem.barcode, "itemName": dbItem.itemName,
              "price": dbItem.sellPrice, "quantity": 1, "discountAmount": 0
            }
            setBillItems([item, ...billItems]);
          }
        }
        else {
          item.quantity += 1;
          setBillItems([...billItems])
        }

        setInputValue('');
      }
      else {
        alert('No item found');
      }
    }
  };

  const getTotalSum = () => {
    let sumTotal = 0;
    billItems.forEach(x => sumTotal += x.price * x.quantity);

    return sumTotal;
  };

  const handleCtrlP = () => {
    // handlePrint();
    // createBill(billItems, 0, 'cash', customerName, '', true)
  };

  const handlePrint = () => {
    if (reactToPrintRef.current) {
      reactToPrintRef.current.handlePrint();
    }
  };

  useEffect(() => {
    if (shallPrintBill.current) {
      handlePrint();
    }
  }, [billNumber]);

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
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        setIpAddress(data.backendUrl + 'api/')
        setShopName(data.shopName)
        setShopAddress(data.shopAddress)
        setShopGstNumber(data.shopGSTNumber)
        const url = data.backendUrl + 'api/';
        fetch(url + GetAllItems)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setProducts(data);
            // console.log(process.env.REACT_APP_backendUrl)
          })
          .catch(error => {
            // alert(error);
            const defaultItems = [
              { id: 1, barcode: "101", itemName: 'Saree', price: 500 },
              { id: 2, barcode: "102", itemName: 'Jeans', price: 1500 },
              { id: 3, barcode: "103", itemName: 'Shirt', price: 400 },
              { id: 4, barcode: "104", itemName: 'Socks', price: 150 },
              { id: 5, barcode: "105", itemName: 'Lungi', price: 80 },
            ];
            setProducts(defaultItems)
            // setLoading(false);
          });
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  const handleSubmit = async (bill) => {
    try {
      const response = await fetch(ipAddress + CreateBill, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bill)
      });
      const data = await response.json();
      setCustomerName(data.customerName);
      setDateTime(formatDate(data.createdDateTime));
      shallPrintBill.current = true;
      setBillNumber(data.id);
    } catch (error) {
      // console.error('Error:', error);
      alert(error)
    }
  };

  const createBill = (billItemList, discountAmount, modeOfPayment, customerName, customerAddress, isPrintBillEnable) => {
    try {
      const billItemDto = [];
      billItemList.forEach(ele => {
        billItemDto.push({
          // "id": ele.id,
          "itemId": ele.itemId,
          "billId": 0,
          "barcode": ele.barcode,
          "itemName": ele.itemName,
          "quantity": ele.quantity,
          "price": ele.price,
          "discountAmount": ele.discountAmount,
          "amount": ele.quantity * ele.price - ele.discountAmount,
        });
      });

      let gst = 0;
      let subTotal = 0;
      let totalAmount = 0;
      billItemDto.forEach(x => subTotal += x.amount);
      totalAmount = subTotal - discountAmount + gst;
      const bill = {
        "id": 0,
        "subTotal": subTotal,
        "discountAmount": discountAmount,
        "totalAmount": totalAmount,
        "modeOfPayment": modeOfPayment,
        "customerName": customerName,
        "customerAddress": customerAddress,
        "billItems": billItemDto,
      }

      // console.log('handleSubmit')

      // POST request
      handleSubmit(bill)

    } catch (e) {
      // console.log(e)
    }

  }

  return (
    <div>
      <div id='barcodeControls' className='barcodeControls'>
        <input id='barcodeInput' type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter barcode"
        />
        <button onClick={onSubmitButtonClick}>Submit</button>
        <button onClick={onClearButtonClick}>Clear</button>
        <button onClick={() => createBill(billItems, 0, 'cash', customerName, '', true)}>Create Bill</button>
        <ReactToPrint
          // trigger={() => {
          // return <button>Print Bill</button>;
          // }}
          content={() => componentRef.current}
          ref={reactToPrintRef}
        />
        {/* <div>Customer Details</div> */}

        <br />
        <Table addBlankRow={addBlankRow} items={billItems} setBillItems={setBillItems}
        />
        <div className='customerDetails'>
          <CustomInput className='customInput' label="Name" text={customerName} setText={setCustomerName} />
          {/* <CustomInput className='customInput' label="Mobile Number" />
          <CustomInput className='customInput' label="Address" /> */}
        </div>
      </div>

      {/* print */}
      <div className='print-area'>
        <div ref={componentRef}>
          <Report billNumber={billNumber} customerName={customerName} dateTime={dateTime} billItems={billItems}
            getTotalSum={getTotalSum} shopName={shopName} shopAddress={shopAddress} shopGSTNumber={shopGstNumber} />
        </div>
      </div>
    </div>

  );
};

export default Billing;
