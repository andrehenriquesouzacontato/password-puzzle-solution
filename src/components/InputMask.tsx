
import React, { useState, ChangeEvent } from 'react';
import { formatCPF, formatPhone, formatCurrency, parseCurrencyInput } from '../utils/formatters';
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
      // Remove o prefixo R$ se existir
      const valueWithoutPrefix = inputValue.replace(/^R\$\s?/, '');
      
      // Remove caracteres não numéricos, exceto vírgula e ponto
      const sanitized = valueWithoutPrefix.replace(/[^\d,.]/g, '');
      
      if (sanitized === '' || sanitized === ',' || sanitized === '.') {
        onChange('');
        return;
      }
      
      // Substituir pontos por nada (para considerar apenas vírgulas como separador decimal)
      const withoutDots = sanitized.replace(/\./g, '');
      
      // Substituir vírgulas por pontos para operações matemáticas
      const withDecimalPoint = withoutDots.replace(',', '.');
      
      // Converter para número e formatar
      const numericValue = parseFloat(withDecimalPoint);
      if (!isNaN(numericValue)) {
        // Formatar com o formatCurrency, mas remover o prefixo R$ para o input
        const formatted = formatCurrency(numericValue).replace('R$', '').trim();
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
        value={type === 'currency' ? `${value}` : value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent ${
          type === 'currency' ? 'pl-8' : ''
        } ${className}`}
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
