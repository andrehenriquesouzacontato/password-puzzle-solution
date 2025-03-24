
import React, { useState, ChangeEvent } from 'react';
import { formatCPF, formatPhone, formatCurrency } from '../utils/formatters';
import { Eye, EyeOff } from 'lucide-react';

interface InputMaskProps {
  value: string;
  onChange: (value: string) => void;
  type: 'cpf' | 'phone' | 'currency' | 'password' | 'text' | 'email';
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const InputMask: React.FC<InputMaskProps> = ({
  value,
  onChange,
  type,
  placeholder,
  className = '',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (type === 'cpf') {
      // Remove non-digits and format
      const digits = inputValue.replace(/\D/g, '');
      onChange(formatCPF(digits));
    } 
    else if (type === 'phone') {
      // Remove non-digits and format
      const digits = inputValue.replace(/\D/g, '');
      onChange(formatPhone(digits));
    }
    else if (type === 'currency') {
      // Process currency input
      const digits = inputValue.replace(/[^\d,]/g, '');
      if (digits === '') {
        onChange('');
      } else {
        // Format as currency
        const parsed = parseFloat(digits.replace(',', '.')) || 0;
        const formatted = formatCurrency(parsed).replace('R$', '').trim();
        onChange(formatted);
      }
    }
    else {
      // For regular text, email, and password
      onChange(inputValue);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    if (type === 'email') return 'email';
    return 'text';
  };

  return (
    <div className="relative w-full">
      <input
        type={getInputType()}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input-mask ${className}`}
        required={required}
      />
      
      {type === 'currency' && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          R$
        </span>
      )}
      
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default InputMask;
