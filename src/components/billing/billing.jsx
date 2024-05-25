import './Billing.css';
import React, { useRef,useEffect,useState } from 'react';
import { ReactToPrint } from 'react-to-print';
import Table from '../TableContainer/Table';
import EditableTable from '../EditableTable/EditableTable';

const Billing = () => {
  const ipAddress = "http://192.168.0.106:91/"
  const shopName = 'Nandini Fashion';
  const address = 'Motto, Chandabali, Bhadrak';
  const gstNumber = '2347JDKJDGK&56757';

  const [billNumber, setBillNumber] = useState('12345');
  const [customerName, setCustomerName] = useState('Default');
  const componentRef = useRef(null);
  const reactToPrintRef = useRef();
  const [responseData, setResponseData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  // const [items, setItems] = useState([]);
  const [dbItems, setDbItems] = useState([]);
  const [billItems, setBillItems] = useState([]);

  const onBarcodeTextChange = (event) => {
      setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmitButtonClick();
    }
  };

  const onSubmitButtonClick = () => {
    if (inputValue.trim() !== '') {
      let dbItem = dbItems.find(x => x.barcode === inputValue)
      // console.log('item -> '+dbItem)
      if(dbItem !== undefined)
      {
        let currentItemIndex = billItems.findIndex(x => x.itemId === dbItem.id)
        let item = billItems[currentItemIndex];
        console.log('item -> '+item)

        if(item === undefined)
        {
          const id = billItems.length+1;
          const item = {"id": id, "itemId": dbItem.id, "barcode": dbItem.barcode, "itemName": dbItem.itemName, 
            "price": dbItem.price, "quantity": 1, "discountAmount":0}
          setBillItems([...billItems, item]);
        }
        else
        {
          item.quantity += 1;
          billItems[currentItemIndex] = item;
          console.log(billItems)
          setBillItems([...billItems])
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
    billItems.forEach(x => sumTotal += x.price * x.quantity);

    return sumTotal;
  };

  const handleCtrlP = () => {
    // console.log('Ctrl + P was pressed');
    // alert('Ctrl + P was pressed');
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
    fetch(ipAddress+'item') // Replace with your API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // setData(data);
        // setLoading(false);
        // console.log(data)
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

  const updateBillItem = (updatedBillItem) => {
    setBillItems(updatedBillItem)
  }

  const addBlankRow = () => {
    const id = billItem.length + 1;
    const billItem = {"id": id, 'itemId': 0, "barcode": '', "itemName": '', 
    "price": 0, "quantity": 1, "discountAmount":0}
  setBillItems([...billItems, billItem]);
  }

  const handleSubmit = async (bill) => {
      // event.preventDefault();
      // const postData = {
      //     name: 'John Doe',
      //     email: 'johndoe@example.com'
      // };

      const body = JSON.stringify(bill);
      console.log(body)

      try {
          const response = await fetch(ipAddress+'api/Bill', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(bill)
          });
          console.log(response)
          // if(response.status)
          const data = await response.json();
          //handlePrint();
          setResponseData(data);
      } catch (error) {
          console.error('Error:', error);
          alert(error)
      }
  };

  const createBill = (billItemList, discountAmount, modeOfPayment, customerName, customerAddress, isPrintBillEnable) => {
    try
    {
    const billItemDto = [];
    billItemList.forEach(ele => {
      billItemDto.push({
        "id": ele.id,
        "itemId": ele.itemId,
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
    
    console.log('handleSubmit')
  
    // POST request
    handleSubmit(bill)

    // on success response
    if(isPrintBillEnable)
    {
      handlePrint();
    }
  }catch(e)
  {
    console.log(e)
  }

  }

  return (
    <div>
        <div>
      <input type="text"
        value={inputValue}
        onChange={onBarcodeTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter barcode"
      />
      <button onClick={onSubmitButtonClick}>Submit</button>
      <button onClick={onSubmitButtonClick}>Clear</button>
      <button onClick={() => createBill(billItems, 0, 'cash', 'default', '', false)}>Create Bill</button>
      <ReactToPrint
          trigger={() => {
            return <button>Print Bill</button>;
          }}
          content={() => componentRef.current}
          ref={reactToPrintRef}
        />
      
      <Table items={billItems} updateBillItem={updateBillItem} addBlankRow={addBlankRow}/>
      {/* <EditableTable /> */}
    </div>

      {/* print */}
      <div className='print-area'>
        <div ref={componentRef}>
          <div style={{fontSize:'20px', margin:'0px', textAlign: 'center'}}>{shopName}</div>
          <div style={{fontSize:'15px', margin:'0px', textAlign: 'center'}}>{address}</div>
          <div style={{fontSize:'15px', margin:'0px', textAlign: 'center'}}>GSTIN: {gstNumber}</div>
          <div style={{fontSize:'20px', margin:'0px', textAlign: 'center'}}>Retail Invoice</div>
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
                {billItems.length > 0 && billItems.map((item, index) => (
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
        <div style={{fontSize:'12px', margin:'0px'}}>CGST 2.5% {getTotalSum() * 0.025}</div>
        <div style={{fontSize:'12px', margin:'0px'}}>SGST 2.5% {getTotalSum() * 1.025}</div>
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
