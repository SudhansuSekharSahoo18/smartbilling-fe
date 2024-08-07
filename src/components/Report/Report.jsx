import React from 'react';
import './Report.css';

const Report = (props) => {

    return (
        <div className='report'>
            <div style={{ fontSize: '50px', margin: '0px', textAlign: 'center' }}>{props.shopName}</div>
            <div style={{ height: '20px' }}></div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', margin: '0px', textAlign: 'center' }}>{props.shopAddress}</div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', margin: '0px', textAlign: 'center' }}>GSTIN: {props.shopGSTNumber}</div>
            <div style={{ height: '20px' }}></div>
            <div style={{ fontSize: '40px', margin: '0px', textAlign: 'center' }}>Retail Invoice</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Bill Number: {props.billNumber}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Date: {props.dateTime}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Name: {props.customerName}</div>
            <table border="1">
                <thead>
                    <tr>
                        {/* <th>Barcode</th> */}
                        <th style={{ fontSize: '15px', fontWeight: 'bold' }}>ItemName</th>
                        <th style={{ fontSize: '15px', fontWeight: 'bold' }}>Price</th>
                        <th style={{ fontSize: '15px', fontWeight: 'bold' }}>Qty</th>
                        <th style={{ fontSize: '15px', fontWeight: 'bold' }}>Discount</th>
                        <th style={{ fontSize: '15px', fontWeight: 'bold' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {props.billItems.length > 0 && props.billItems.map((item, index) => (
                        <tr key={index}>
                            {/* <td>{item.barcode}</td> */}
                            <td style={{ fontSize: '30px', fontWeight: 'bold' }}>{item.itemName}</td>
                            <td style={{ textAlign: 'right', fontSize: '30px', fontWeight: 'bold' }}>{item.price}</td>
                            <td style={{ textAlign: 'right', fontSize: '30px', fontWeight: 'bold' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', fontSize: '30px', fontWeight: 'bold' }}>{item.discountPercentage}</td>
                            <td style={{ textAlign: 'right', fontSize: '30px', fontWeight: 'bold' }}>{(100 - item.discountPercentage) * 0.01 * item.price * item.quantity}</td>
                        </tr>
                    ))}
                    <tr>
                        {/* <td></td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style={{ textAlign: 'right', fontSize: '30px', fontWeight: 'bold' }}>{props.getTotalSum()}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>GST 5% {parseFloat(props.getTotalSum() * 0.05).toFixed(2)}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Total Amount {parseFloat(props.getTotalSum() * 1.05).toFixed(2)}</div>
            <div>------------------------------------------------</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Total {props.getTotalSum()}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>CGST 2.5% {parseFloat(props.getTotalSum() * 0.025).toFixed(2)}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>SGST 2.5% {parseFloat(props.getTotalSum() * 0.025).toFixed(2)}</div>
            <div>------------------------------------------------</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Terms & Conditions:</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Subject to {props.shopName} No cash return No gurantee on the products</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Exchange within 15 days with barcode sticker & bill</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Thank you Shopping with us</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '0px' }}>Visit again!!!</div>
        </div>
    );
};

export default Report;
