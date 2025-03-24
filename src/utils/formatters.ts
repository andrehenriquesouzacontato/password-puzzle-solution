
// Format currency to Brazilian Real (R$)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format CPF (Brazilian ID) as 000.000.000-00
export const formatCPF = (cpf: string): string => {
  const cpfDigits = cpf.replace(/\D/g, '');
  if (cpfDigits.length <= 3) return cpfDigits;
  if (cpfDigits.length <= 6) return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3)}`;
  if (cpfDigits.length <= 9) return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6)}`;
  return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(6, 9)}-${cpfDigits.slice(9, 11)}`;
};

// Format phone number as (00) 00000-0000
export const formatPhone = (phone: string): string => {
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length <= 2) return phoneDigits;
  if (phoneDigits.length <= 7) return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2)}`;
  if (phoneDigits.length <= 11) return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 7)}-${phoneDigits.slice(7)}`;
  return `(${phoneDigits.slice(0, 2)}) ${phoneDigits.slice(2, 7)}-${phoneDigits.slice(7, 11)}`;
};

// Validate CPF format
export const isValidCPF = (cpf: string): boolean => {
  const cpfDigits = cpf.replace(/\D/g, '');
  return cpfDigits.length === 11;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Parse currency input (remove R$ and transform commas)
export const parseCurrencyInput = (value: string): number => {
  // Remove R$ e espaços
  const withoutSymbol = value.replace(/R\$\s?/g, '');
  // Remove pontos de milhar
  const withoutThousandSep = withoutSymbol.replace(/\./g, '');
  // Substitui vírgula por ponto para converter para número
  const withDot = withoutThousandSep.replace(',', '.');
  // Converte para número
  return parseFloat(withDot) || 0;
};
