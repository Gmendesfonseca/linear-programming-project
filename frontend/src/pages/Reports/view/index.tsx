import React from 'react';
import { MethodResult, ProblemConfig } from '../types';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardAction } from '@/components/ui/card';

interface ReportsViewProps {
  loading: boolean;
  config: ProblemConfig;
  methodResults: MethodResult[];
  hasResults: boolean;
  onConfigChange: (field: keyof ProblemConfig, value: string | number) => void;
  onRunExperiments: () => Promise<void>;
  onRunAllMethods: () => Promise<void>;
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
      <Card style={{ padding: '20px', marginBottom: '20px' }}>
        <h2>Configuração do Experimento</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <Label>Tipo do Problema:</Label>
            <Input
              type="text"
              disabled
              value={config.problemType}
              onChange={(e) => onConfigChange('problemType', e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <Label>Tipo de Solução:</Label>
            <Input
              type="text"
              disabled
              value={config.solutionType}
              onChange={(e) => onConfigChange('solutionType', e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <Label>Limite Mínimo:</Label>
            <Input
              type="number"
              value={config.minLimit}
              onChange={(e) =>
                onConfigChange('minLimit', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <Label>Limite Máximo:</Label>
            <Input
              type="number"
              value={config.maxLimit}
              onChange={(e) =>
                onConfigChange('maxLimit', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <Label>Tamanho do Problema:</Label>
            <Input
              type="number"
              value={config.problemSize}
              onChange={(e) =>
                onConfigChange('problemSize', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <Label>Capacidade:</Label>
            <Input
              type="number"
              value={config.capacity}
              onChange={(e) =>
                onConfigChange('capacity', parseInt(e.target.value))
              }
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>

        <CardAction style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
          <Button
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
          </Button>

          <Button
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
          </Button>
        </CardAction>
      </Card>

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
