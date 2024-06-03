import './Billing.css';
import React, { useRef,useEffect,useState } from 'react';
import { ReactToPrint } from 'react-to-print';
import Table from '../TableContainer/Table';
import Report from '../Report/Report';

const Billing = () => {

  const [ipAddress, setIpAddress] = useState(null);
  // const ipAddress = process.env.REACT_APP_BACKEND_URL+"api/"
  const componentRef = useRef(null);
  const reactToPrintRef = useRef();
  const [responseData, setResponseData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  // const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [billNumber, setBillNumber] = useState('12345');
  const [customerName, setCustomerName] = useState('Default');
  const [dateTime, setDateTime] = useState('');

  const onBarcodeTextChange = (event) => {
      setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmitButtonClick();
    }
  };

  const onClearButtonClick = () => {
    var emptyList = []
    setBillItems([...emptyList])
  }

  const onSubmitButtonClick = () => {
    if (inputValue.trim() !== '') {
      console.log(products)
      let dbItem = products.find(x => x.barcode === inputValue)
       if(dbItem !== undefined)
      {
        let item = billItems.find(x => x.itemId === dbItem.id)
        if(item === undefined)
        {
          const id = billItems.length+1;
          const item = {"id": id, "itemId": dbItem.id, "barcode": dbItem.barcode, "itemName": dbItem.title,
            "price": dbItem.sellPrice, "quantity": 1, "discountAmount":0}
          setBillItems([...billItems, item]);
        }
        else
        {
          item.quantity += 1;
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
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        setIpAddress(data.backend_url+'api/')
        const url = data.backend_url+'api/';
        console.log('url -> '+url)
        fetch(url+'product')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // setData(data);
          // setLoading(false);
          console.log('products api ->')
          console.log(data)
          setProducts(data);
          // console.log(process.env.REACT_APP_BACKEND_URL)
        })
        .catch(error => {
          // alert(error);
          const defaultItems = [
              {id: 1, barcode: "101", itemName: 'Saree', price: 500},
              {id: 2, barcode: "102", itemName: 'Jeans', price: 1500},
              {id: 3, barcode: "103", itemName: 'Shirt', price: 400},
              {id: 4, barcode: "104", itemName: 'Socks', price: 150},
              {id: 5, barcode: "105", itemName: 'Lungi', price: 80},
            ];
          setProducts(defaultItems)
          // setLoading(false);
        });
      })
      .catch(error => console.error('Error fetching config:', error));
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
          const response = await fetch(ipAddress+'bill/create', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(bill)
          });
          const data = await response.json();
          setBillNumber(data.id);
          setCustomerName(data.customerName);
          setDateTime(data.createdDateTime);
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
      <button onClick={onClearButtonClick}>Clear</button>
      <button onClick={() => createBill(billItems, 0, 'cash', 'default', '', true)}>Create Bill</button>
      <ReactToPrint
          // trigger={() => {
          //   // return <button>Print Bill</button>;
          // }}
          content={() => componentRef.current}
          ref={reactToPrintRef}
        />

      <Table items={billItems} updateBillItem={updateBillItem} addBlankRow={addBlankRow}/>
      {/* <EditableTable /> */}
    </div>

      {/* print */}
      <div className='print-area'>
        <div ref={componentRef}>
          <Report billNumber={billNumber} customerName={customerName} dateTime={dateTime} billItems={billItems} getTotalSum={getTotalSum} />
        </div>
      </div>
    </div>

  );
};

export default Billing;
