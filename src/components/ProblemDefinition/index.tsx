import { useState } from 'react';
import { OptionItem } from '../OptionItem';
import './styles.css';

export const ProblemDefinition = () => {
  const [option, setOption] = useState<'FIXED' | 'VARIABLE'>('FIXED');
  const handleVariableConfig = () => {
    setOption('VARIABLE');
  };
  const handleFixedConfig = () => {
    setOption('FIXED');
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
            <input type='number' />
          </div>
          <div>
            <h3>Capacidade Máxima</h3>
            <input type='number' />
          </div>
        </div>
      )}
    </div>
  );
};
