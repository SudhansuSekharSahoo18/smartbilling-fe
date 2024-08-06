import React, { useState, useEffect } from 'react';
import './Table.css';

const Table = ({ addBlankRow, items, setBillItems }) => {

  const [emptyArr, setEmptyArr] = useState([1, 2, 3, 4, 5]);
  const [flag, setFlag] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState([0, 0]);

  const getTotalSum = (items) => {
    let sumTotal = 0;
    items.forEach(x => sumTotal += (100 - x.discountPercentage) * 0.01 * x.price * x.quantity);

    return sumTotal;
  };

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
    else if (event.key === 'ArrowDown' || event.key === 'Enter') {
      if (items.length - 1 === row) {
        addBlankRow();
        setFocusedIndex([row, col])
        setFlag(true)
        return;
      }

      onDownArrowPressed(row, col)
    }
  };

  const onDownArrowPressed = (row, col) => {
    const nextIndex = row + 1;
    const nextInput = document.getElementById(`input-${nextIndex}-${col}`);
    if (nextInput) {
      nextInput.focus();
    }
  }

  const handleInputChange = (e, index, field) => {

    // const index = parseInt((e.target.id).split('-')[1])
    // console.log('index->' + id)
    // console.log('index->' + index)

    // const newData = items.map((item) => {
    //   // console.log(item.id + ' == ' + id)
    //   if (item.id === id) {
    //     return { ...item, [field]: e.target.value };
    //   }
    //   return item;
    // });

    for (let i = 0; i < items.length; i++) {
      if (i === index) {
        if (field === 'itemName') {
          items[i].itemName = e.target.value
        } else if (field === 'price') {
          items[i].price = Number(e.target.value)
        } else if (field === 'quantity') {
          items[i].quantity = Number(e.target.value)
        }
      }
    }

    setBillItems([...items]);
  };

  const handleDelete = (index) => {
    const newDate = items.filter((item, i) => i !== index);
    setBillItems(newDate);
  };

  useEffect(() => {
    if (flag) {
      setFlag(false)
      onDownArrowPressed(focusedIndex[0], focusedIndex[1])
    }
  }, [items]);

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
                <th>Discount %</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 && items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                  <td>{item.barcode}</td>
                  <td>
                    <input type="text"
                      id={`input-${index}-${2}`}
                      onChange={(e) => handleInputChange(e, index, 'itemName')}
                      value={item.itemName}
                      onKeyDown={(e) => handleKeyDown(e, index, 2)}
                    />
                  </td>
                  <td>
                    <input type="number"
                      style={{ textAlign: 'right' }}
                      id={`input-${index}-${3}`}
                      onChange={(e) => handleInputChange(e, index, 'price')}
                      value={item.price}
                      onKeyDown={(e) => handleKeyDown(e, index, 3)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      style={{ textAlign: 'right' }}
                      id={`input-${index}-${4}`}
                      onChange={(e) => handleInputChange(e, index, 'quantity')}
                      value={item.quantity}
                      onKeyDown={(e) => handleKeyDown(e, index, 4)}
                    />
                  </td>
                  <td>
                    <input
                      style={{ textAlign: 'right' }}
                      type="number"
                      id={`input-${index}-${5}`}
                      onChange={(e) => handleInputChange(e, index, 'discountPercentage')}
                      value={item.discountPercentage}
                      onKeyDown={(e) => handleKeyDown(e, index, 5)}
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {(100 - item.discountPercentage) * 0.01 * item.price * item.quantity}
                  </td>
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
                <td></td>
                <td>{getTotalSum(items)}</td>
              </tr>
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default Table;
