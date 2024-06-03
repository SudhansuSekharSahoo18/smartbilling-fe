import React from 'react';
import './Report.css';

const Report = (props) => {

    return (
       <div className='report'>
        <div style={{fontSize:'20px', margin:'0px', textAlign: 'center'}}>{props.shopName}</div>
          <div style={{fontSize:'15px', margin:'0px', textAlign: 'center'}}>{props.shopAddress}</div>
          <div style={{fontSize:'15px', margin:'0px', textAlign: 'center'}}>GSTIN: {props.shopGSTNumber}</div>
          <div style={{fontSize:'20px', margin:'0px', textAlign: 'center'}}>Retail Invoice</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Bill Number: {props.billNumber}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Date: {props.dateTime}</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Name: {props.customerName}</div>
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
          <div style={{fontSize:'12px', margin:'0px'}}>Subject to {props.shopName} No cash return No gurantee on the products</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Exchange within 15 days with barcode sticker & bill</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Thank you Shopping with us</div>
          <div style={{fontSize:'12px', margin:'0px'}}>Visit again!!!</div>
       </div>
    );
};

export default Report;
