import { useState } from 'react';
import { sendGeneticAlgorithmData } from '@/service/requests';
import {
  GeneticAlgorithmParams,
  GeneticAlgorithmResponse,
} from '@/service/types';
import { useKnapsackSetup } from '@/hooks/useKnapsackSetup';
import { GeneticAlgorithmsView } from '../view';

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

export const GeneticAlgorithmsController = () => {
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
    <GeneticAlgorithmsView
      analyzeAG={analyzeAG}
      calculateBestValue={calculateBestValue}
      calculateTotalValue={calculateTotalValue}
      config={config}
      handleConfigChange={handleConfigChange}
      executeAG={executeAG}
      generateProblem={generateProblem}
      isLoading={isLoading}
      isGeneratingProblem={isGeneratingProblem}
      knapsackProblem={knapsackProblem}
      initialSolution={initialSolution}
      currentValues={currentValues}
      knapsacksLengths={knapsacksLengths}
      result={result}
      problemGenerated={problemGenerated}
    />
  );
};
