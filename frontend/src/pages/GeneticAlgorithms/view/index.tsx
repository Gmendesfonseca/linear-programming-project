import { FC } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { GeneticAlgorithmResponse, KnapsackProblem } from '@/service/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardAction, CardContent } from '@/components/ui/card';
import { AGConfig, ExtendedGeneticAlgorithmResponse } from '../types';

interface GeneticAlgorithmsViewProps {
  config: AGConfig;
  result?: ExtendedGeneticAlgorithmResponse | null;
  isLoading?: boolean;
  isGeneratingProblem?: boolean;
  handleConfigChange: (key: keyof AGConfig, value: number) => void;
  generateProblem: () => void;
  executeAG: () => void;
  analyzeAG: () => void;
  knapsackProblem: KnapsackProblem;
  initialSolution: number[][];
  currentValues: number[];
  knapsacksLengths: number[];
  problemGenerated: boolean;
  calculateBestValue: (
    solutions: GeneticAlgorithmResponse['solutions'],
  ) => number;
  calculateTotalValue: (
    solutions: GeneticAlgorithmResponse['solutions'],
  ) => number;
}

export const GeneticAlgorithmsView: FC<GeneticAlgorithmsViewProps> = ({
  config,
  handleConfigChange,
  isGeneratingProblem,
  isLoading,
  result,
  analyzeAG,
  executeAG,
  generateProblem,
  knapsackProblem,
  initialSolution,
  currentValues,
  knapsacksLengths,
  problemGenerated,
  calculateBestValue,
  calculateTotalValue,
}) => {
  return (
    <MainLayout>
      <Card style={{ padding: '20px', marginBottom: '20px' }}>
        <h1 className="text-3xl font-bold mb-6">Algoritmo Genético</h1>

        {/* Configuration Section */}
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
                  handleConfigChange(
                    'crossoverRate',
                    parseFloat(e.target.value),
                  )
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
                  handleConfigChange(
                    'generationInterval',
                    parseInt(e.target.value),
                  )
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
                  handleConfigChange(
                    'keepIndividuals',
                    parseFloat(e.target.value),
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardAction>
          <h2 className="text-xl font-semibold mb-4">Ações</h2>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={generateProblem}
              disabled={isGeneratingProblem}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGeneratingProblem ? 'Gerando...' : 'Gerar Problema'}
            </Button>

            <Button
              onClick={executeAG}
              disabled={isLoading || !problemGenerated}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Executando...' : 'Executar AG'}
            </Button>

            <Button
              onClick={analyzeAG}
              disabled={isLoading || !problemGenerated}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analisando...' : 'Analisar AG'}
            </Button>
          </div>
        </CardAction>

        {/* Problem Data Display */}
        {problemGenerated && knapsackProblem.costs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Dados do Problema</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Custos</h3>
                <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(knapsackProblem.costs, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Pesos</h3>
                <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(knapsackProblem.weights, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Tamanhos das Mochilas
                </h3>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="text-sm">
                    {JSON.stringify(knapsacksLengths, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Solução Inicial
                </h3>
                <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
                  <pre className="text-sm">
                    {JSON.stringify(initialSolution, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">
                Valores Iniciais
              </h3>
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-sm">
                  {JSON.stringify(currentValues, null, 2)}
                </pre>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Valor Total Inicial:{' '}
                {currentValues.reduce((sum, val) => sum + val, 0)}
              </p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Resultado do Algoritmo Genético
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">
                  Soluções Encontradas
                </h3>
                <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
                  <div className="space-y-2">
                    {result.solutions.map((solution, index) => (
                      <div key={index} className="border-b pb-2">
                        <p className="text-sm font-medium">
                          Mochila {index + 1}:
                        </p>
                        <p className="text-xs text-gray-600">
                          Solução Inicial: [
                          {solution.initial_solution.join(', ')}] (Valor:{' '}
                          {solution.initial_value})
                        </p>
                        <p className="text-xs text-gray-600">
                          Solução Final: [{solution.final_solution.join(', ')}]
                          (Valor: {solution.final_value})
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Melhoria:{' '}
                          {solution.final_value - solution.initial_value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {result.analysis && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Análise Comparativa
                  </h3>
                  <div className="bg-gray-50 p-3 rounded max-h-64 overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">População</th>
                          <th className="text-left py-2">Taxa Cruzamento</th>
                          <th className="text-left py-2">Taxa Mutação</th>
                          <th className="text-left py-2">Gerações</th>
                          <th className="text-left py-2">Melhor Valor</th>
                          <th className="text-left py-2">Valor Total</th>
                          <th className="text-left py-2">Melhoria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.analysis.map((item, index) => {
                          const initialTotal = item.result.solutions.reduce(
                            (sum, sol) => sum + sol.initial_value,
                            0,
                          );
                          const finalTotal = calculateTotalValue(
                            item.result.solutions,
                          );
                          const improvement = finalTotal - initialTotal;

                          return (
                            <tr key={index} className="border-b">
                              <td className="py-2">
                                {item.config.populationSize}
                              </td>
                              <td className="py-2">
                                {item.config.crossoverRate}
                              </td>
                              <td className="py-2">
                                {item.config.mutationRate}
                              </td>
                              <td className="py-2">
                                {item.config.generations}
                              </td>
                              <td className="py-2">
                                {calculateBestValue(item.result.solutions)}
                              </td>
                              <td className="py-2">{finalTotal}</td>
                              <td className="py-2 text-green-600 font-medium">
                                +{improvement}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded">
                <h3 className="font-medium text-blue-800 mb-2">Estatísticas</h3>
                <p className="text-sm text-blue-700">
                  Valor Total: {calculateTotalValue(result.solutions)}
                </p>
                <p className="text-sm text-blue-700">
                  Melhor Valor: {calculateBestValue(result.solutions)}
                </p>
                <p className="text-sm text-blue-700">
                  Número de Mochilas: {result.solutions.length}
                </p>
                <p className="text-sm text-blue-700">
                  Melhoria Média:{' '}
                  {(
                    result.solutions.reduce(
                      (sum, sol) => sum + (sol.final_value - sol.initial_value),
                      0,
                    ) / result.solutions.length
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-blue-700">
                  Valor Inicial Total:{' '}
                  {result.solutions.reduce(
                    (sum, sol) => sum + sol.initial_value,
                    0,
                  )}
                </p>
                <p className="text-sm text-green-700 font-medium">
                  Melhoria Total: +
                  {result.solutions.reduce(
                    (sum, sol) => sum + (sol.final_value - sol.initial_value),
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </MainLayout>
  );
};
