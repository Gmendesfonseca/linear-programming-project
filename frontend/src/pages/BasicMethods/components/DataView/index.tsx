import React from 'react';
import { MethodsLabels, Method } from '@/pages/BasicMethods';

interface DataViewProps {
  data: {
    method: Method | 'default';
    costs: number[][];
    weights: number[][];
    newValue?: number[][];
    currentValues: number[];
    newSolution?: number[][];
    initialSolution: number[][];
  };
}

export const DataView: React.FC<DataViewProps> = ({ data }) => {
  return (
    <div
      style={{
        marginTop: '20px',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <h3>Resultados</h3>
      <table style={{ width: '800px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>
              Descrição
            </th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Solução Inicial
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              [
              {data.initialSolution
                ? JSON.stringify(data.initialSolution.join(', '))
                : '--'}
              ]
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Peso Avaliado
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.weights
                .map(
                  (weight) => `[${weight.map((w) => w.toFixed(2)).join(', ')}]`
                )
                .join(' | ') || '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Custo Avaliado
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.costs
                .map((cost) => `[${cost.map((c) => c.toFixed(2)).join(', ')}]`)
                .join(' | ') || '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Valor da Solução
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.currentValues.map((value) => value.toFixed(2)).join(', ') ||
                '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Método Selecionado
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.method !== 'default' && MethodsLabels[data.method as Method]
                ? MethodsLabels[data.method as Method]
                : '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Nova Solução
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.newSolution || '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Novo Valor da Solução
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.newValue || '--'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
