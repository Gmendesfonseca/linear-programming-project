import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { ProblemConfig } from '../../types';

interface ConfigurationPanelProps {
  loading: boolean;
  config: ProblemConfig;
  onConfigChange: (field: keyof ProblemConfig, value: string | number) => void;
  onRunExperiments: () => Promise<void>;
  onRunAllMethods: () => Promise<void>;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  loading,
  config,
  onConfigChange,
  onRunExperiments,
  onRunAllMethods,
}) => {
  return (
    <Card style={{ padding: '20px', marginBottom: '20px' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Configuração do Experimento
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure os parâmetros do problema antes de executar os
            experimentos
          </p>
        </div>
        <div className="text-sm text-gray-500">⚙️ Configurações</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Limite Mínimo
          </Label>
          <Input
            type="number"
            value={config.minLimit}
            onChange={(e) =>
              onConfigChange('minLimit', parseInt(e.target.value))
            }
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500">Peso mínimo dos itens</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Limite Máximo
          </Label>
          <Input
            type="number"
            value={config.maxLimit}
            onChange={(e) =>
              onConfigChange('maxLimit', parseInt(e.target.value))
            }
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500">Peso máximo dos itens</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Tamanho do Problema
          </Label>
          <Input
            type="number"
            value={config.problemSize}
            onChange={(e) =>
              onConfigChange('problemSize', parseInt(e.target.value))
            }
            min="5"
            max="100"
          />
          <p className="text-xs text-gray-500">Número de itens por mochila</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Capacidade
          </Label>
          <Input
            type="number"
            value={config.capacity}
            onChange={(e) =>
              onConfigChange('capacity', parseInt(e.target.value))
            }
            min="10"
            max="200"
          />
          <p className="text-xs text-gray-500">Capacidade das mochilas</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 !pt-4">
        <Button
          onClick={onRunExperiments}
          disabled={loading}
          className="flex items-center space-x-2 !px-4"
        >
          <span>📈</span>
          <span>{loading ? 'Executando...' : 'Métodos Básicos'}</span>
        </Button>

        <Button
          onClick={onRunAllMethods}
          disabled={loading}
          variant="outline"
          className="flex items-center space-x-2 !px-4"
        >
          <span>🔄</span>
          <span>{loading ? 'Executando...' : 'Todos os Métodos'}</span>
        </Button>

        <div className="ml-auto text-xs text-gray-500 flex items-center">
          <span>
            💡 Dica: Execute todos os métodos para comparação completa
          </span>
        </div>
      </div>
    </Card>
  );
};
