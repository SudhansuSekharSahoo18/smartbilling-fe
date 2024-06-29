import React,{useState} from 'react';
import './Table.css';

const Table = (props) => {

  const [emptyArr, setEmptyArr] = useState([1, 2, 3, 4]);
  const getTotalSum = (items) => {
    let sumTotal = 0;
    items.forEach(x => sumTotal += x.price * x.quantity);

    return sumTotal;
  };

  const addBlankRow = props.addBlankRow;

  const handleKeyDown = (event, row, col) => {

    if (event.key === 'ArrowRight') {
      const nextIndex = col + 1;
      const nextInput = document.getElementById(`input-${row}-${nextIndex}`);
      if (nextInput) {
          nextInput.focus();
      }
    }
    else if (event.key === 'ArrowLeft') {
      const nextIndex = col - 1;
      const nextInput = document.getElementById(`input-${row}-${nextIndex}`);
      if (nextInput) {
          nextInput.focus();
      }
    }
    else if (event.key === 'ArrowUp') {
      const nextIndex = row - 1;
      const nextInput = document.getElementById(`input-${nextIndex}-${col}`);
      if (nextInput) {
          nextInput.focus();
      }
    }
    else if (event.key === 'ArrowDown') {
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

  const handleInputChange = (e, id, field) => {
    console.log(e.target.value)
    console.log(id)
    console.log(field)
    const newData = props.items.map((item) => {
      if (item.id === id) {
          return { ...item, [field]: e.target.value };
      }
      return item;
    });

    props.updateBillItem(newData);
  };


  const handleDelete = (index) => {
    const newData = props.items.filter((item, i) => i !== index);
    props.updateBillItem(newData);
};

  return (
    <div className="table-container">
      {(
        <div className='data-table'>
            <table>
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
                            <td>{item.barcode}</td>
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
                    {emptyArr.length > 0 && emptyArr.map((item, index) => (
                        <tr key={index}>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{getTotalSum(props.items)}</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
      )}
    </div>
  );
};

export default Table;
