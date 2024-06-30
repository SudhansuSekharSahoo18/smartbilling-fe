import React from 'react';
import './CustomInput.css';

const CustomInput = ({ label, text, setText }) => {
    return (
        <div className='customInput'>
            <label>{label} </label>
            <input id={label} type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
    );
};

export default CustomInput;