import React from 'react';
import './Table.css';

const Table = (props) => {

  const getTotalSum = (items) => {
    let sumTotal = 0;
    items.forEach(x => sumTotal += x.price * x.quantity);

    return sumTotal;
  };

  const addBlankRow = props.addBlankRow;

  const handleKeyDown = (event, row, col) => {
    // console.log("index -> "+row);

    if (event.key === 'ArrowRight') {
      // console.log('Right arrow key pressed');
      const nextIndex = col + 1;
      const nextInput = document.getElementById(`input-${row}-${nextIndex}`);
      if (nextInput) {
          nextInput.focus();
      }
    }
    else if (event.key === 'ArrowLeft') {
      // console.log('Left arrow key pressed');
      const nextIndex = col - 1;
      const nextInput = document.getElementById(`input-${row}-${nextIndex}`);
      if (nextInput) {
          nextInput.focus();
      }
    }
    else if (event.key === 'ArrowUp') {
      // console.log('Up arrow key pressed');
      const nextIndex = row - 1;
      const nextInput = document.getElementById(`input-${nextIndex}-${col}`);
      if (nextInput) {
          nextInput.focus();
      }
    }
    else if (event.key === 'ArrowDown') {
      // console.log('Down arrow key pressed');
      // console.log(props.items.length)
      // console.log(row)
      if(props.items.length - 1 === row)
      {
        addBlankRow();
      }
      
        const nextIndex = row + 1;
        const nextInput = document.getElementById(`input-${nextIndex}-${col}`);
        if (nextInput) {
            nextInput.focus();
        }
      
    }
  };
  const updateBillItem = props.updateBillItem;

  const handleInputChange = (e, id, field) => {
    const newData = props.items.map((item) => {
      if (item.id === id) {
          return { ...item, [field]: e.target.value };
      }
      return item;
    });

    updateBillItem(newData);
  };


  const handleDelete = (index) => {
    const newData = props.items.filter((item, i) => i !== index);
    updateBillItem(newData);
};

  return (
    <div className="table-container">
      {(
        <div className='data-table'>
            <table className=''>
                <thead>
                    <tr>
                        <th></th>
                        <th>Barcode</th>
                        <th>ItemName</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {props.items.length > 0 && props.items.map((item, index) => (
                        <tr key={index}>
                            <td>
                              <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                            <td>
                              {item.barcode}
                            </td>
                            <td>
                              <input type="text"
                                id={`input-${index}-${2}`}
                                value={item.itemName}
                                onChange={(e) => handleInputChange(e, index, 'itemName')}
                                onKeyDown={(e) => handleKeyDown(e, index, 2)}
                                />
                            </td>
                            <td>
                              <input 
                                // type="number"
                                id={`input-${index}-${3}`}
                                value={item.price}
                                onChange={(e) => handleInputChange(e, index, 'price')}
                                onKeyDown={(e) => handleKeyDown(e, index, 3)}
                                />
                            </td>
                            <td>
                              <input 
                                // type="number"
                                id={`input-${index}-${4}`}
                                value={item.quantity}
                                onChange={(e) => handleInputChange(e, index, 'quantity')}
                                onKeyDown={(e) => handleKeyDown(e, index, 4)}
                                />
                            </td>
                            <td>{item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
      <div className='total-sum'>{getTotalSum(props.items)}</div>

    </div>
  );
};

export default Table;
