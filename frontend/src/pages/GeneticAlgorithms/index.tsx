import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { sendGeneticAlgorithmData } from '@/service/requests';
import {
  GeneticAlgorithmParams,
  GeneticAlgorithmResponse,
} from '@/service/types';
import { useKnapsackSetup } from '@/hooks/useKnapsackSetup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardAction, CardContent } from '@/components/ui/card';

interface AGConfig {
  problemSize: number;
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  generations: number;
  generationInterval: number;
  keepIndividuals: number;
  capacity: number;
}

interface AnalysisConfig {
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  generations: number;
}

interface AnalysisResult {
  config: AnalysisConfig;
  result: GeneticAlgorithmResponse;
}

interface ExtendedGeneticAlgorithmResponse extends GeneticAlgorithmResponse {
  analysis?: AnalysisResult[];
}

const GeneticAlgorithms = () => {
  const [config, setConfig] = useState<AGConfig>({
    problemSize: 10,
    populationSize: 100,
    crossoverRate: 0.7,
    mutationRate: 0.01,
    generations: 1000,
    generationInterval: 100,
    keepIndividuals: 0.1,
    capacity: 50,
  });

  const [result, setResult] = useState<ExtendedGeneticAlgorithmResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProblem, setIsGeneratingProblem] = useState(false);

  const {
    knapsackProblem,
    initialSolution,
    currentValues,
    knapsacksLengths,
    setupKnapsacks,
  } = useKnapsackSetup();

  const [problemGenerated, setProblemGenerated] = useState(false);

  const handleConfigChange = (field: keyof AGConfig, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateProblem = async () => {
    setIsGeneratingProblem(true);
    try {
      await setupKnapsacks(config.problemSize, config.capacity);
      setProblemGenerated(true);
      setResult(null); // Clear previous results
    } catch (error) {
      console.error('Error generating problem:', error);
      alert('Erro ao gerar problema. Verifique a conexão com o servidor.');
    } finally {
      setIsGeneratingProblem(false);
    }
  };

  const executeAG = async () => {
    if (!problemGenerated || !knapsackProblem.costs.length) {
      alert('Por favor, gere um problema primeiro.');
      return;
    }

    setIsLoading(true);
    try {
      const params: GeneticAlgorithmParams = {
        costs: knapsackProblem.costs,
        lengths: knapsacksLengths,
        weights: knapsackProblem.weights,
        maximum_weights: Array(knapsacksLengths.length).fill(config.capacity),
        generations: config.generations,
        mutation_rate: config.mutationRate,
        population_size: config.populationSize,
        cross_over_rate: config.crossoverRate,
        keep_individuals: config.keepIndividuals,
      };

      const response = await sendGeneticAlgorithmData(params);
      setResult(response);
    } catch (error) {
      console.error('Error executing AG:', error);
      alert(
        'Erro ao executar Algoritmo Genético. Verifique a conexão com o servidor.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAG = async () => {
    if (!problemGenerated || !knapsackProblem.costs.length) {
      alert('Por favor, gere um problema primeiro.');
      return;
    }

    setIsLoading(true);
    try {
      // Predefined configurations for analysis as discussed in class
      const analysisConfigs: AnalysisConfig[] = [
        {
          populationSize: 50,
          crossoverRate: 0.6,
          mutationRate: 0.01,
          generations: 500,
        },
        {
          populationSize: 100,
          crossoverRate: 0.7,
          mutationRate: 0.01,
          generations: 1000,
        },
        {
          populationSize: 150,
          crossoverRate: 0.8,
          mutationRate: 0.02,
          generations: 1500,
        },
        {
          populationSize: 100,
          crossoverRate: 0.7,
          mutationRate: 0.05,
          generations: 1000,
        },
        {
          populationSize: 200,
          crossoverRate: 0.9,
          mutationRate: 0.01,
          generations: 2000,
        },
      ];

      const results: AnalysisResult[] = [];

      for (const analysisConfig of analysisConfigs) {
        const params: GeneticAlgorithmParams = {
          costs: knapsackProblem.costs,
          lengths: knapsacksLengths,
          weights: knapsackProblem.weights,
          maximum_weights: Array(knapsacksLengths.length).fill(config.capacity),
          generations: analysisConfig.generations,
          mutation_rate: analysisConfig.mutationRate,
          population_size: analysisConfig.populationSize,
          cross_over_rate: analysisConfig.crossoverRate,
          keep_individuals: config.keepIndividuals,
        };

        const response = await sendGeneticAlgorithmData(params);
        results.push({
          config: analysisConfig,
          result: response,
        });
      }

      // Display analysis results
      console.log('Analysis Results:', results);

      // Combine all solutions for display
      const combinedSolutions = results.flatMap((r) => r.result.solutions);

      setResult({
        solutions: combinedSolutions,
        analysis: results,
      });
    } catch (error) {
      console.error('Error analyzing AG:', error);
      alert(
        'Erro ao analisar Algoritmo Genético. Verifique a conexão com o servidor.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBestValue = (
    solutions: GeneticAlgorithmResponse['solutions'],
  ) => {
    return Math.max(...solutions.map((sol) => sol.final_value));
  };

  const calculateTotalValue = (
    solutions: GeneticAlgorithmResponse['solutions'],
  ) => {
    return solutions.reduce((sum, sol) => sum + sol.final_value, 0);
  };

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

export default GeneticAlgorithms;
