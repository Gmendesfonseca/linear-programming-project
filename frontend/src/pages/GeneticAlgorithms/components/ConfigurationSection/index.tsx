import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

export const ConfigurationSection = ({ config, handleConfigChange }) => {
  return (
    <CardContent>
      <h2 className="text-xl font-semibold mb-4">
        Configuração do AG/Problema
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho do Problema
          </Label>
          <Input
            type="number"
            min="5"
            max="100"
            value={config.problemSize}
            onChange={(e) =>
              handleConfigChange('problemSize', parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidade das Mochilas
          </Label>
          <Input
            type="number"
            min="10"
            max="200"
            value={config.capacity}
            onChange={(e) =>
              handleConfigChange('capacity', parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho da População
          </Label>
          <Input
            type="number"
            min="10"
            max="1000"
            value={config.populationSize}
            onChange={(e) =>
              handleConfigChange('populationSize', parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Taxa de Cruzamento
          </Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={config.crossoverRate}
            onChange={(e) =>
              handleConfigChange('crossoverRate', parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Taxa de Mutação
          </Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.001"
            value={config.mutationRate}
            onChange={(e) =>
              handleConfigChange('mutationRate', parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Gerações
          </Label>
          <Input
            type="number"
            min="1"
            max="10000"
            value={config.generations}
            onChange={(e) =>
              handleConfigChange('generations', parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Intervalo de Geração
          </Label>
          <Input
            type="number"
            min="1"
            max="1000"
            value={config.generationInterval}
            onChange={(e) =>
              handleConfigChange('generationInterval', parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Manter Indivíduos (%)
          </Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={config.keepIndividuals}
            onChange={(e) =>
              handleConfigChange('keepIndividuals', parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </CardContent>
  );
};
