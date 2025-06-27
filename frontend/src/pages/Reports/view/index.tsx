import React from 'react';

interface ProblemConfig {
  problemType: string;
  solutionType: string;
  minLimit: number;
  maxLimit: number;
  problemSize: number;
  capacity: number;
}

interface StatResult {
  min: number;
  max: number;
  avg: number;
  std: number;
}

interface MethodResult {
  name: string;
  data: number[];
  stats: StatResult;
}

interface ReportsViewProps {
  loading: boolean;
  config: ProblemConfig;
  methodResults: MethodResult[];
  hasResults: boolean;
  onConfigChange: (field: keyof ProblemConfig, value: string | number) => void;
  onRunExperiments: () => Promise<void>;
  onRunAllMethods: () => Promise<any>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  loading,
  config,
  methodResults,
  hasResults,
  onConfigChange,
  onRunExperiments,
  onRunAllMethods,
}) => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Relatórios de Experimentos</h1>

      {/* Configuration Panel */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h2>Configuração do Experimento</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label>Tipo do Problema:</label>
            <input
              type="text"
              value={config.problemType}
              onChange={(e) => onConfigChange('problemType', e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label>Tipo de Solução:</label>
            <input
              type="text"
              value={config.solutionType}
              onChange={(e) => onConfigChange('solutionType', e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label>Limite Mínimo:</label>
            <input
              type="number"
              value={config.maxLimit}
              onChange={(e) =>
                onConfigChange('maxLimit', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label>Limite Máximo:</label>
            <input
              type="number"
              value={config.maxLimit}
              onChange={(e) =>
                onConfigChange('maxLimit', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label>Tamanho do Problema:</label>
            <input
              type="number"
              value={config.problemSize}
              onChange={(e) =>
                onConfigChange('problemSize', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label>Capacidade:</label>
            <input
              type="number"
              value={config.capacity}
              onChange={(e) =>
                onConfigChange('capacity', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
          <button
            onClick={onRunExperiments}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Executando...' : 'Executar Experimentos'}
          </button>

          <button
            onClick={onRunAllMethods}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Executando...' : 'Executar Todos os Métodos'}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {hasResults && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <h2>Resultados dos Experimentos</h2>

          {/* Statistics Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'left',
                  }}
                >
                  Método
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  Mínimo
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  Máximo
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  Média
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  Desvio Padrão
                </th>
              </tr>
            </thead>
            <tbody>
              {methodResults.map((method) => {
                console.log(method.stats);
                if (Object.values(method.stats).every((value) => value === 0))
                  return null;
                return (
                  <tr key={method.name}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {method.name}
                    </td>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {method.stats.min.toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {method.stats.max.toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {method.stats.avg.toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {method.stats.std.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
