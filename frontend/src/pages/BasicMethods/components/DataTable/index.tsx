import { DataInterface } from '../DataView';
import { Method, MethodsLabels } from '@/pages/BasicMethods/helpers';

interface DataTableProps extends DataInterface {
  index: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  index,
  costs,
  method,
  weights,
  newValue,
  newSolution,
  currentValues,
  initialSolution,
}) => {
  const bagCount = initialSolution.length;
  const formatArr = (arr: number[]) => arr.map((v) => v.toFixed(2)).join(', ');

  const rows = [
    {
      abbr: 'SI',
      full: 'Solução Inicial',
      values: initialSolution.map(formatArr),
    },
    { abbr: 'P', full: 'Peso Avaliado', values: weights.map(formatArr) },
    { abbr: 'C', full: 'Custo Avaliado', values: costs.map(formatArr) },
    {
      abbr: 'V',
      full: 'Valor da Solução',
      values: currentValues.map((v) => v?.toFixed(2) ?? '--'),
    },
    {
      abbr: 'SA',
      full: 'Solução Atual',
      values: newSolution
        ? newSolution.map(formatArr)
        : Array.from({ length: bagCount }).map(() => '--'),
    },
    {
      abbr: 'VA',
      full: 'Valor Atual',
      values: newValue
        ? newValue.map((v) => v?.toFixed(2) ?? '--')
        : Array.from({ length: bagCount }).map(() => '--'),
    },
  ];

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <h3>Resultados - Iteração {index}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>
              Descrição
            </th>
            {Array.from({ length: bagCount }).map((_, i) => (
              <th
                key={i}
                title={`Mochila ${i + 1}`}
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                M{i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                title={row.full}
              >
                <strong>{row.abbr}</strong>
              </td>
              {row.values.map((val, i) => (
                <td
                  key={i}
                  style={{ border: '1px solid #ddd', padding: '8px' }}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td
              style={{ border: '1px solid #ddd', padding: '8px' }}
              title="Método Selecionado"
            >
              <strong>Método</strong>
            </td>
            <td
              colSpan={bagCount}
              style={{ border: '1px solid #ddd', padding: '8px' }}
            >
              {method !== 'default' && MethodsLabels[method as Method]
                ? MethodsLabels[method as Method]
                : '--'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
