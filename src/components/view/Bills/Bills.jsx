import React, { useRef, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";

const Bills = () => {

  const [showDetail, setShowDetail] = useState(false);
  const [billItems, setBillItems] = useState([]);
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  const pagination = true;
  const paginationPageSize = 20;
  const paginationPageSizeSelector = [20, 50, 100];

  const [colDefs, setColDefs] = useState([
    { field: "id", filter: true },
    { field: "createdDateTime" },
    { field: "totalAmount" },
    { field: "quantity" },
    { field: "tax", editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['5%', '12%', '18%'], } },
  ]);

  const [colDefs2, setColDefs2] = useState([
    { field: "id", filter: true },
    { field: "itemName" },
    { field: "amount" },
    { field: "quantity" },
    { field: "price", editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['5%', '12%', '18%'], } },
  ]);


  const EditButton = (props) => {
    return <button onClick={() => window.alert('clicked')}>Edit</button>;
  };

  const DeleteButton = (props) => {
    return <button onClick={() => window.alert('clicked')}>Delete</button>;
  };

  const onDoubleClick = (event) => {
    // console.log(event.data.id)
    setBillItems(event.data.billItems);
    console.log(event.data.billItems)
    setShowDetail(true)
  }

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        const url = data.backend_url + 'api/';
        fetch(url + 'bill/Get')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // console.log(data)
            setRowData(data);
          })
          .catch(error => {
            const defaultItems = [
              { id: 1, barcode: "101", itemName: 'Saree', price: 500 },
              { id: 2, barcode: "102", itemName: 'Jeans', price: 1500 },
              { id: 3, barcode: "103", itemName: 'Shirt', price: 400 },
              { id: 4, barcode: "104", itemName: 'Socks', price: 150 },
              { id: 5, barcode: "105", itemName: 'Lungi', price: 80 },
            ];
            setRowData(defaultItems)
          });
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return (
    <div  >
      {!showDetail && <div className="ag-theme-quartz" style={{ height: 500 }} >
        <AgGridReact rowData={rowData} columnDefs={colDefs} rowSelection={'multiple'}
          onRowDoubleClicked={(e) => onDoubleClick(e)}
          pagination={pagination} paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>}
      {showDetail &&
        <div>
          <button onClick={() => setShowDetail(false)}>Back</button>
          <label htmlFor="">Barcode </label>
          <input type="text" enterKeyHint='hello' />
          <button>Submit</button>
          <button>Return</button>
          <div className="ag-theme-quartz" style={{ height: 500 }} >
            <AgGridReact rowData={billItems} columnDefs={colDefs2} rowSelection={'multiple'}
              pagination={pagination} paginationPageSize={paginationPageSize}
              paginationPageSizeSelector={paginationPageSizeSelector}
            />
          </div>
        </div>}
    </div>
  );
};

export default Bills;