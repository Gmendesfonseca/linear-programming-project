import { useState } from 'react';
import { OptionItem } from '../OptionItem';
import './styles.css';

interface ProblemDefinitionProps {
  initialOption?: 'FIXED' | 'VARIABLE';
  onOptionChange?: (option: 'FIXED' | 'VARIABLE') => void;
  setMax: (value: number) => void;
  setProblemLength: (value: number) => void;
}

export const ProblemDefinition = ({
  initialOption = 'FIXED',
  onOptionChange,
  setMax,
  setProblemLength,
}: ProblemDefinitionProps) => {
  const [option, setOption] = useState<'FIXED' | 'VARIABLE'>(initialOption);

  const handleVariableConfig = () => {
    setOption('VARIABLE');
    onOptionChange?.('VARIABLE');
  };

  const handleFixedConfig = () => {
    setOption('FIXED');
    onOptionChange?.('FIXED');
  };

  return (
    <div className='problem-definition'>
      <h1>Definição do Problema</h1>
      <div className='problem-definition-options'>
        <div>
          <OptionItem
            title={'Configuração Fixa'}
            handleClick={handleFixedConfig}
            checked={option === 'FIXED'}
          />
        </div>
        <div>
          <OptionItem
            title={'Configuração Variável'}
            handleClick={handleVariableConfig}
            checked={option === 'VARIABLE'}
          />
        </div>
      </div>
      {option === 'VARIABLE' && (
        <div className='variable-config'>
          <div>
            <h3>Tamanho do Problema</h3>
            <input
              type='number'
              onChange={(event) => {
                setProblemLength(Number(event.target.value));
              }}
            />
          </div>
          <div>
            <h3>Capacidade Máxima</h3>
            <input
              type='number'
              onChange={(event) => {
                setMax(Number(event.target.value));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
