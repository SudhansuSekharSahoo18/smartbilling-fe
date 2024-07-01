import React, { useRef, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomInput from '../../CustomInput/CustomInput';
import './Items.css';
import Dropdown from '../../Dropdown/Dropdown';
import { postRequest } from '../../../Helper/apiHelper.js';

const Items = (props) => {
  const gridRef = useRef(null);
  const [barcode, setBarcode] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('Pieces');
  const [costPrice, setCostPrice] = useState();
  const [sellPrice, setSellPrice] = useState();
  const [tax, setTax] = useState();
  const [selectedId, setSelectedId] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  const [items, setItems] = useState([]);
  const unitOptions = [
    { value: 1, label: 'Pieces' },
    { value: 2, label: 'Boxes' },
    { value: 3, label: 'Meters' },
  ];

  const handleSelectedUnit = (option) => {
    setSelectedUnit(option);
  };
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 50, 100, 200];

  // const EditButton = (props) => {
  //   return <button onClick={() => window.alert('clicked')}>Edit</button>;
  // };

  // const DeleteButton = (props) => {
  //   return <button className='deleteButton' onClick={() => {
  //     console.log(props.id)
  //     // const userConfirmed = window.confirm('Are you sure you want to delete this item?');
  //     // if (userConfirmed) {
  //     //   const newData = props.items.filter((item, i) => i !== index);
  //     //   setItems(newData)
  //     // }
  //   }}>Delete</button>;
  // };

  const [colDefs, setColDefs] = useState([
    // { field: "button", flex: 1, cellRendererFramework: p => <DeleteButton id={p.id} />, },
    // { field: "", flex: 1, cellRenderer: EditButton },
    { field: "id", flex: 1, filter: true },
    { field: "barcode", flex: 1, filter: true },
    { field: "itemName", flex: 1 },
    { field: "quantity", flex: 1 },
    // { field: "Unit", flex:1 },
    { field: "sellPrice", flex: 1 },
    { field: "tax", flex: 1, editable: true, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['5%', '12%', '18%'], } },
  ]);

  const OnAddItemClicked = async () => {

    const itemDto = { 'barcode': barcode, 'itemName': itemName, 'quantity': quantity, 'unit': selectedUnit, 'costPrice': costPrice, 'sellPrice': sellPrice, 'tax': tax, 'categoryId': 1 };
    // console.log(itemDto)
    const response = await postRequest(props.ipAddress + 'Product/create', itemDto)
    // console.log('response')
    // console.log(response)
    if (response.ok) {
      const data = await response.json();
      // console.log(data)
      setItems([...items, data])
      OnClearButtonClicked()
      props.notify('Item added')
    }
  }

  const OnClearButtonClicked = () => {
    setIsEditMode(false)

    setBarcode('')
    setItemName('')
    setQuantity(1)
    setCostPrice(0)
    setSellPrice(0)
    setTax(0)

    console.log(items)
  }


  const OnEditButtonClicked = () => {
    // console.log('selected' + selectedId)
    if (isEditMode) {
      const updatedData = items.map(row =>
        row.id === selectedId ? {
          ...row, barcode: barcode, itemName: itemName, quantity: quantity, costPrice: costPrice,
          sellPrice: sellPrice, tax: tax
        } : row
      );

      setItems(updatedData);
      OnClearButtonClicked()
    }
    setIsEditMode(!isEditMode)
  }

  const OnDeleteButtonClicked = () => {
    if (selectedId === 0) {
      alert('Please select a record to delete')
      return;
    }
    const newData = items.filter((item) => item.id !== selectedId);
    setItems(newData)
    setSelectedId(0);
  }

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    if (selectedNodes.length > 0) {
      const selectedData = selectedNodes.map(node => node.data);
      const temp = selectedData[0];
      setSelectedId(temp['id']);
    }
  };

  const onRowDoubleClicked = (e) => {
    setSelectedId(e.data['id']);
    const item = items.filter((item) => item.id === selectedId)[0];
    console.log(item)
    setBarcode(item.barcode)
    setItemName(item.itemName)
    setQuantity(item.quantity)
    setCostPrice(item.costPrice)
    setSellPrice(item.sellPrice)
    setTax(item.tax)

    setIsEditMode(!isEditMode)
  };

  useEffect(() => {
    // setItemName('test6');
    // setQuantity(5);
    // setCostPrice(100);
    // setSellPrice(200);
    // setTax(5);

    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        const url = data.backend_url + 'api/';
        fetch(url + 'Item')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // data.length = 5
            setItems(data);
          })
          .catch(error => {
            const defaultItems = [
              { id: 1, barcode: "101", itemName: 'Saree', price: 500 },
              { id: 2, barcode: "102", itemName: 'Jeans', price: 1500 },
              { id: 3, barcode: "103", itemName: 'Shirt', price: 400 },
              { id: 4, barcode: "104", itemName: 'Socks', price: 150 },
              { id: 5, barcode: "105", itemName: 'Lungi', price: 80 },
            ];
            setItems(defaultItems)
          });
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return (
    <div className='itemsPage'>
      <div className='inputForm'>
        <CustomInput className='customInput' label={'Barcode'} text={barcode} setText={setBarcode} />
        <CustomInput className='customInput' label={'ItemName'} text={itemName} setText={setItemName} />
        <CustomInput className='customInput' label={'Quantity'} text={quantity} setText={setQuantity} />
        <Dropdown label={'Select Unit'} options={unitOptions} onSelect={handleSelectedUnit} />
        <CustomInput className='customInput' label={'CostPrice'} text={costPrice} setText={setCostPrice} />
        <CustomInput className='customInput' label={'SellPrice'} text={sellPrice} setText={setSellPrice} />
        <CustomInput className='customInput' label={'Tax'} text={tax} setText={setTax} />
        <label>%</label>
      </div>
      {!isEditMode && <button onClick={OnAddItemClicked}>Add Item</button>}
      {isEditMode && <button onClick={OnEditButtonClicked}>Update</button>}
      <button onClick={OnClearButtonClicked}>{isEditMode ? 'Cancel' : 'Clear'}</button>
      {!isEditMode && <button onClick={OnDeleteButtonClicked}>Delete</button>}
      {!isEditMode && <div className="ag-theme-quartz" >
        <AgGridReact rowData={items} columnDefs={colDefs}
          ref={gridRef}
          rowSelection={'single'}
          onSelectionChanged={() => onSelectionChanged()}
          onRowDoubleClicked={(e) => onRowDoubleClicked(e)}
          pagination={pagination} paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
        />
      </div>}
    </div>
  );
};

export default Items;



