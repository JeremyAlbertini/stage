import { useState } from 'react'

export default function Dropdown({ trigger, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="dropdown-container"
            onMouseEnter={() => setIsOpen(true)}
        >
            {trigger}
            
            {isOpen && (
                <div 
                    className="dropdown-menu"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}