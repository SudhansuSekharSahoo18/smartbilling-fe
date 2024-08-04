import React from 'react';
import './CustomInput.css';

const CustomInput = ({ label, text, type, setText }) => {
    return (
        <div className='customInput'>
            <label>{label} </label>
            <input id={label} type={type} value={text}
                onChange={(e) => setText(type === 'number' ? parseInt(e.target.value) : e.target.value)} />
        </div>
    );
};

export default CustomInput;