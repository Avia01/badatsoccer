import React from 'react';
import '../styles/DropdownMenu.css'

const DropdownMenu = ({list = [], isOpen, closeDropdown, toggleDropdown}) => {
    const handleOnOptionClick = (item) => {
        closeDropdown()
        if (typeof item.fn === 'function') {
            item.fn();
        }
    }

    return (
        <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-button">
                Actions
            </button>
            {isOpen && list.map(item => {
                return (
                    <ul className="dropdown-menu">
                        <li className="dropdown-item" onClick={() => handleOnOptionClick(item)}>{item.option}</li>
                    </ul>
                )
            })}
        </div>
    );
}

export default DropdownMenu;