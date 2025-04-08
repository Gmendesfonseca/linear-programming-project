import React from 'react';

interface DataViewProps {
  data: {
    knapsackProblem: number[];
    initialSolution: number[];
    weight: number;
    cost: number;
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
              Problema da Mochila
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.knapsackProblem
                ? JSON.stringify(data.knapsackProblem)
                : '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Solução Inicial
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.initialSolution
                ? JSON.stringify(data.initialSolution)
                : '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Peso Avaliado
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.weight || '--'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              Custo Avaliado
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {data.cost || '--'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
