import { useState } from 'react';
import { OptionItem } from '../OptionItem';

export const ProblemDefinition = () => {
  const [option, setOption] = useState<'FIXED' | 'VARIABLE'>('FIXED');
  const handleVariableConfig = () => {
    setOption('VARIABLE');
  };
  const handleFixedConfig = () => {
    setOption('FIXED');
  };
  return (
    <div>
      <h3>Definição do Problema</h3>
      <OptionItem
        title={'Configuração Fixa'}
        handleClick={handleFixedConfig}
        checked={option === 'FIXED'}
      />
      <OptionItem
        title={'Configuração Variável'}
        handleClick={handleVariableConfig}
        checked={option === 'VARIABLE'}
      />
      {option === 'VARIABLE' && (
        <>
          <div>
            <h3>Tamanho do Problema</h3>
            <input type="number" />
          </div>
          <div>
            <h3>Capacidade Máxima</h3>
            <input type="number" />
          </div>
        </>
      )}
    </div>
  );
};
