import React, { useState } from 'react';
import './Report.css';

const Report = (props) => {

  const shopName = 'Nandini Fashion';
  const address = 'Motto, Chandabali, Bhadrak';
  const gstNumber = '2347JDKJDGK&56757';

  const [billNumber, setBillNumber] = useState('12345');
  const [customerName, setCustomerName] = useState('Default');

    return (
       <div className='report'>
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
                {props.billItems.length > 0 && props.billItems.map((item, index) => (
                    <tr key={index}>
                        <td>{item.barcode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price * item.quantity}</td>
                    </tr>
                ))}
                <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{props.getTotalSum()}</td>
                    </tr>
            </tbody>
          </table>
          {/* <div style={{fontSize:'12px', margin:'0px', textAlign: 'right'}}>Total {props.getTotalSum()}</div> */}
          <div style={{fontSize:'12px', margin:'0px'}}>GST 5% {props.getTotalSum() * 0.05}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Total Amount {props.getTotalSum() * 1.05}</div>
          <div>------------------------------------------------</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Total {props.getTotalSum()}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>CGST 2.5% {props.getTotalSum() * 0.025}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>SGST 2.5% {props.getTotalSum() * 1.025}</div>
          <div>------------------------------------------------</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Terms & Conditions:</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Subject to {shopName} No cash return No gurantee on the products</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Exchange within 15 days with barcode sticker & bill</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Thank you Shopping with us</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Visit again!!!</div>
       </div>
    );
};

export default Report;
