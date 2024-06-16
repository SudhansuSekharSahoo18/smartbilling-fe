import React, { useRef,useEffect,useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";

const Items = (props) => {
  const [items, setItems] = useState([]);
  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  const [colDefs, setColDefs] = useState([
    // { field: "button", cellRenderer: EditButton },
    // { field: "button", cellRenderer: DeleteButton },
    { field: "barcode", filter:true},
    { field: "title" },
    { field: "quantity" },
    { field: "Unit" },
    { field: "sellPrice" },
    { field: "tax", editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['5%', '12%', '18%'], } },
  ]);


  const EditButton = (props) => {
    return <button onClick={() => window.alert('clicked') }>Edit</button>;
  };

  const DeleteButton = (props) => {
    return <button onClick={() => window.alert('clicked') }>Delete</button>;
  };
//   const [columnDefs, setColumnDefs] = useState([
//     { headerName: "Make & Model", valueGetter: p => p.make + ' ' + p.model},
//     { field: "price" },
// ]);

  const handleEdit = (index) =>{

  }
  
  const OnAddItemClicked = (index) =>{

  }

  useEffect(() => {
    fetch('/config.json')
    .then(response => response.json())
    .then(data => {
        const url = data.backend_url+'api/';
        fetch(url+'product')
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            console.log(data)
            setItems(data);
        })
        .catch(error => {
        const defaultItems = [
            {id: 1, barcode: "101", itemName: 'Saree', price: 500},
            {id: 2, barcode: "102", itemName: 'Jeans', price: 1500},
            {id: 3, barcode: "103", itemName: 'Shirt', price: 400},
            {id: 4, barcode: "104", itemName: 'Socks', price: 150},
            {id: 5, barcode: "105", itemName: 'Lungi', price: 80},
            ];
        setItems(defaultItems)
        });
    })
    .catch(error => console.error('Error fetching config:', error));
  }, []);

    return (
        <div className="ag-theme-quartz" style={{ height: 500 }} >
            <button onClick={() => props.notify('Add Item')}>Add Item</button>
            <AgGridReact rowData={items} columnDefs={colDefs} rowSelection={'multiple'}
                pagination={pagination} paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
            />
        </div>
        // Replace this with online data table
        // <div className='data-table'>
        //     <table className=''>
        //         <thead>
        //             <tr>
        //                 <th>Barcode</th>
        //                 <th>ItemName</th>
        //                 <th>Unit</th>
        //                 <th>Quantity</th>
        //                 <th>SellPrice</th>
        //                 <th>Tax</th>
        //                 <th>Category</th>
        //                 <th></th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {items.length > 0 && items.map((item, index) => (
        //                 <tr key={index}>
        //                     <td>
        //                         {item.barcode}
        //                     </td>
        //                     <td>{item.title}</td>
        //                     <td>pices</td>
        //                     <td>100</td>
        //                     <td>{item.SellPrice}</td>
        //                     <td>5%</td>
        //                     <td>Cloths</td>
        //                     <td>
        //                         <button onClick={() => handleEdit(index)}>Edit</button>
        //                     </td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    );
};

export default Items;



