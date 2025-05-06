import { useState } from 'react';
import './styles.css';

interface MethodsProps {
  options: { value: string; label: string }[];
}

export const Methods = ({ options }: MethodsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMethod(event.target.value);
  };

  return (
    <div className="methods">
      <h1>Métodos Básicos</h1>
      <select onChange={handleMethodChange} disabled>
        <option value="">Selecione um método</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedMethod && (
        <div className="method-details">
          <h2>Detalhes do Método</h2>
          <p>Você selecionou: {selectedMethod}</p>
        </div>
      )}
    </div>
  );
};
