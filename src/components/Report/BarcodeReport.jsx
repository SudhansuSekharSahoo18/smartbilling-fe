import React, { useState } from 'react';
import './Report.css';
import Barcode from 'react-barcode';

const BarcodeReport = ({ barcodeList, shopName }) => {
    return (
        <div className='barcodeReport'>
            {barcodeList.length > 0 && barcodeList.map((item, index) => (
                <div key={index}>
                    <div style={{ fontSize: '20px', margin: '0px', textAlign: 'center' }}>{shopName}</div>
                    <div style={{ fontSize: '20px', margin: '0px', textAlign: 'center' }}>
                        <Barcode height={30} value={item.barcode} />
                    </div>
                    <div style={{ fontSize: '20px', margin: '0px' }}>{item.itemName}</div>
                    <div style={{ fontSize: '20px', margin: '0px' }}>Fixed Price: {item.price}</div>
                    <div style={{ pageBreakAfter: 'always' }}></div>
                </div>
            ))}
        </div>
    );
};

export default BarcodeReport;
