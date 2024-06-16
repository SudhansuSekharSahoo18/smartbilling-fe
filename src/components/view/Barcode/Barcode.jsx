import React, { useRef,useEffect,useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const Barcode = (props) => {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [rowData, setRowData] = useState([
    { itemCode: "101", itemName: "Jeans", price: 1299, quantity: 10 },
    { itemCode: "102", itemName: "Shirt", price: 800, quantity: 10 },
    { itemCode: "103", itemName: "Jacket", price: 3000, quantity: 10 },
  ]);

  const [colDefs, setColDefs] = useState([
    { field: "itemCode", editable: true, filter: true},
    { field: "itemName", editable: true },
    { field: "price", editable: true },
    { field: "quantity", editable: true },
  ]);

  const OnGenerateBarcodeClicked = async () => {
    props.notify('Barcode generated')
    const url = props.ipAddress+'Barcode/GenerateBarcode';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setData(responseData);
      // console.log(responseData);
      
    } catch (error) {
      setError(error.message);
    }
  }

  function EditButton(props) {
    return <button onClick={() => window.alert('clicked')}>Edit</button>;
  }

  const onAddItemButtonClicked = () => {
      const item = { itemCode: "", itemName: "", price: 0, quantity: 0 }
      setRowData([...rowData, item]);
      console.log(rowData)
    }; 

  const onClearItemButtonClicked = () => {
    setRowData([]);
  }; 

  // useEffect(() => {
  //   fetch('/config.json')
  //   .then(response => response.json())
  //   .then(data => {
  //       const url = data.backend_url+'api/';
  //       fetch(url+'bill/Get')
  //       .then(response => {
  //       if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //       })
  //       .then(data => {
  //           console.log(data)
  //           setRowData(data);
  //       })
  //       .catch(error => {
  //         setRowData(defaultItems)
  //       });
  //   })
  //   .catch(error => console.error('Error fetching config:', error));
  // }, []);

    return (
        <div className="ag-theme-quartz" style={{ height: 500 }} >
            <button onClick={()=>OnGenerateBarcodeClicked()}>Generate Barcode</button>
            <button onClick={()=>onAddItemButtonClicked()}>Add Item</button>
            <button onClick={()=>onClearItemButtonClicked()}>Clear</button>
            <AgGridReact rowData={rowData} columnDefs={colDefs} rowSelection={'multiple'}
            />
        </div>
    );
};

export default Barcode;