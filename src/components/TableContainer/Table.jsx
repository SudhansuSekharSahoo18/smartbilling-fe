import React from 'react';
import './Table.css';

const Table = (props) => {

  const getTotalSum = (items) => {
    let sumTotal = 0;
    items.forEach(x => sumTotal += x.price * x.quantity);

    return sumTotal;
  };

  return (
    <div className="table-container">
      {(
        <div className='data-table'>
            <table className=''>
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
                    {props.items.length > 0 && props.items.map((item, index) => (
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
        </div>
      )}
      <div className='total-sum'>{getTotalSum(props.items)}</div>

    </div>
  );
};

export default Table;
