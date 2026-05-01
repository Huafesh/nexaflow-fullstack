import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCountryCallingCode } from 'react-phone-number-input';

export default function CustomCountrySelect({ value, onChange, options, iconComponent: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="custom-country-select" ref={ref}>
      <button 
        type="button" 
        className="country-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        title={selectedOption?.label || "Select country"}
      >
        {Icon && value && <Icon country={value} label={selectedOption?.label} />}
        {!value && <span className="country-select-placeholder">🌍</span>}
        <ChevronDown size={14} className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="country-select-menu">
          {options.map((option, index) => (
            option.divider ? (
              <div key={`divider-${index}`} className="country-select-divider" />
            ) : (
              <button
                key={option.value || 'ZZ'}
                type="button"
                className={`country-select-option ${option.value === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {Icon && option.value && (
                  <span className="country-option-icon">
                    <Icon country={option.value} label={option.label} />
                  </span>
                )}
                {!option.value && <span className="country-option-icon">🌍</span>}
                <span className="country-name">{option.label}</span>
                {option.value && (
                  <span className="country-code">+{getCountryCallingCode(option.value)}</span>
                )}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
