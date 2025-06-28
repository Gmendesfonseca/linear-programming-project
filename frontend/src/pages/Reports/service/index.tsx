import {
  handleSlopeClimbingMethod,
  handleSlopeClimbingTryMethod,
  handleTemperatureMethod,
} from '@/pages/BasicMethods/helpers';
import { useKnapsackSetup } from '@/hooks/useKnapsackSetup';
import {
  AllResults,
  ExperimentResults,
  GAExperimentResult,
  GAReportData,
  GeneticAlgorithmConfig,
  PayloadBase,
  ProblemConfig,
  ResultAllMethodsItem,
} from '../types';
import { handleAllMethods } from '../utils/handleAllMethods';
import { sendGeneticAlgorithmData } from '@/service/requests';

export class ReportsService {
  private setupKnapsacks: ReturnType<typeof useKnapsackSetup>['setupKnapsacks'];

  constructor(
    setupKnapsacks: ReturnType<typeof useKnapsackSetup>['setupKnapsacks'],
  ) {
    this.setupKnapsacks = setupKnapsacks;
  }

  public async runIndividualExperiments(
    config: ProblemConfig,
  ): Promise<ExperimentResults> {
    const initialSolutionResults: number[] = [];
    const hillClimbingResults: number[] = [];
    const hillClimbingNAttemptsResults: number[] = [];
    const hillClimbing2NAttemptsResults: number[] = [];

    // Initialize all annealing results arrays
    const annealingResults: { [key: string]: number[] } = {
      annealing01: [],
      annealing02: [],
      annealing03: [],
      annealing04: [],
      annealing05: [],
      annealing06: [],
      annealing07: [],
      annealing08: [],
      annealing09: [],
    };

    const annealingConfigs = [
      { key: 'annealing01', finalTemp: 0.1, initialTemp: 1000, reducer: 0.8 },
      { key: 'annealing02', finalTemp: 0.1, initialTemp: 1000, reducer: 0.9 },
      { key: 'annealing03', finalTemp: 0.01, initialTemp: 1000, reducer: 0.8 },
      { key: 'annealing04', finalTemp: 0.1, initialTemp: 500, reducer: 0.8 },
      { key: 'annealing05', finalTemp: 0.1, initialTemp: 500, reducer: 0.9 },
      { key: 'annealing06', finalTemp: 0.01, initialTemp: 500, reducer: 0.8 },
      { key: 'annealing07', finalTemp: 0.1, initialTemp: 0, reducer: 0.8 },
      { key: 'annealing08', finalTemp: 0.1, initialTemp: 0, reducer: 0.9 },
      { key: 'annealing09', finalTemp: 0.01, initialTemp: 0, reducer: 0.8 },
    ];

    for (let i = 0; i < 20; i++) {
      const { problem, solutions, current_values, maxKnapsackWeights } =
        await this.setupKnapsacks(config.problemSize, config.capacity);

      const payloadBase = {
        costs: problem.costs,
        weights: problem.weights,
        solutions,
        current_values,
        maximum_weights: maxKnapsackWeights,
      };

      // Store initial solution values
      const initialValue = current_values.reduce((sum, val) => sum + val, 0);
      initialSolutionResults.push(initialValue);

      // Process Hill Climbing methods
      const hillClimbingValue = await this.processHillClimbing(
        payloadBase,
        initialValue,
      );
      hillClimbingResults.push(hillClimbingValue);

      const hillClimbingTryValue = await this.processHillClimbingTry(
        payloadBase,
        config.problemSize,
        initialValue,
        'Hill Climbing Try',
      );
      hillClimbingNAttemptsResults.push(hillClimbingTryValue);

      const hillClimbing2NValue = await this.processHillClimbingTry(
        payloadBase,
        config.problemSize * 2,
        initialValue,
        'Hill Climbing 2N',
      );
      hillClimbing2NAttemptsResults.push(hillClimbing2NValue);

      // Process Simulated Annealing variants
      for (const annealingConfig of annealingConfigs) {
        const annealingValue = await this.processSimulatedAnnealing(
          payloadBase,
          annealingConfig,
          initialValue,
          annealingConfig.key,
        );
        annealingResults[annealingConfig.key].push(annealingValue);
      }
    }

    return {
      initialSolutions: initialSolutionResults,
      hillClimbing: hillClimbingResults,
      hillClimbingNAttempts: hillClimbingNAttemptsResults,
      hillClimbing2NAttempts: hillClimbing2NAttemptsResults,
      temperaResults: [],
      simulatedAnnealing: annealingResults,
    };
  }

  public async runAllMethodsExperiment(config: ProblemConfig): Promise<{
    individualResults: Partial<ExperimentResults>;
    allResults: AllResults[];
  }> {
    const allResults: AllResults[] = [];

    // Add these arrays to capture individual method results
    const initialSolutionResults: number[] = [];
    const hillClimbingResults: number[] = [];
    const hillClimbingNAttemptsResults: number[] = [];
    const hillClimbing2NAttemptsResults: number[] = [];
    const temperaResults: number[] = [];

    for (let i = 0; i < 20; i++) {
      const { problem, solutions, current_values, maxKnapsackWeights } =
        await this.setupKnapsacks(config.problemSize, config.capacity);

      const payloadBase = {
        costs: problem.costs,
        weights: problem.weights,
        solutions,
        current_values,
        maximum_weights: maxKnapsackWeights,
      };

      // Calculate fallback value from initial solution (solutions from setupKnapsacks)
      const fallbackValue = current_values.reduce((sum, val) => sum + val, 0);

      // Store initial solution values (Soluções Iniciais)
      initialSolutionResults.push(fallbackValue);

      // Run all methods at once
      const allMethodsResponse = await handleAllMethods({
        ...payloadBase,
        Tmax: config.problemSize,
        reducer_factor: 0.95,
        final_temperature: 0.1,
        initial_temperature: 10,
      });

      console.log(`Iteration ${i + 1} - Response:`, allMethodsResponse);

      // Process each method result
      allMethodsResponse.forEach((res: ResultAllMethodsItem) => {
        this.processAllMethodsResponse(
          res,
          hillClimbingResults,
          hillClimbingNAttemptsResults,
          hillClimbing2NAttemptsResults,
          temperaResults,
        );
      });

      // Only add results that have valid current_values
      const validResults = allMethodsResponse.filter(
        (res: ResultAllMethodsItem) =>
          res.current_values !== undefined && res.current_values !== null,
      );

      allResults.push(
        ...validResults.map((res: ResultAllMethodsItem) => ({
          method: res.method,
          newValue: res.current_values,
          newSolution: res.solutions,
          currentValues: current_values,
          initialSolution: solutions,
          weights: problem.weights,
          costs: problem.costs,
        })),
      );
    }

    return {
      individualResults: {
        initialSolutions: initialSolutionResults,
        hillClimbing: hillClimbingResults.length > 0 ? hillClimbingResults : [],
        hillClimbingNAttempts:
          hillClimbingNAttemptsResults.length > 0
            ? hillClimbingNAttemptsResults
            : [],
        hillClimbing2NAttempts:
          hillClimbing2NAttemptsResults.length > 0
            ? hillClimbing2NAttemptsResults
            : [],
        temperaResults: temperaResults.length > 0 ? temperaResults : [],
        simulatedAnnealing: {},
      },
      allResults,
    };
  }

  // Fix the runGeneticAlgorithmExperiments method around line 330

  public async runGeneticAlgorithmExperiments(
    config: ProblemConfig,
  ): Promise<GAReportData> {
    // Add the actual GA configurations here
    const gaConfigurations: GeneticAlgorithmConfig[] = [
      // Small population configurations
      {
        population_size: 50,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 50,
        generations: 200,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 50,
        generations: 100,
        cross_over_rate: 0.8,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 50,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.02,
        keep_individuals: 0.1,
      },
      {
        population_size: 50,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.2,
      },

      // Medium population configurations
      {
        population_size: 100,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 100,
        generations: 200,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 100,
        generations: 100,
        cross_over_rate: 0.8,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 100,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.02,
        keep_individuals: 0.1,
      },
      {
        population_size: 100,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.2,
      },

      // Large population configurations
      {
        population_size: 200,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 200,
        generations: 200,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 200,
        generations: 100,
        cross_over_rate: 0.8,
        mutation_rate: 0.01,
        keep_individuals: 0.1,
      },
      {
        population_size: 200,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.02,
        keep_individuals: 0.1,
      },
      {
        population_size: 200,
        generations: 100,
        cross_over_rate: 0.7,
        mutation_rate: 0.01,
        keep_individuals: 0.2,
      },
    ];

    const experiments: GAExperimentResult[] = [];
    let bestConfiguration: GeneticAlgorithmConfig = gaConfigurations[0];
    let bestOverallValue = -Infinity;
    let totalImprovement = 0;
    let totalExecutionTime = 0;

    for (const gaConfig of gaConfigurations) {
      console.log(`Testing GA Configuration:`, gaConfig);

      const configResults: number[] = [];
      const initialValues: number[] = [];
      const improvements: number[] = [];
      let configExecutionTime = 0;

      for (let i = 0; i < 20; i++) {
        const { problem, current_values, maxKnapsackWeights } =
          await this.setupKnapsacks(config.problemSize, config.capacity);

        const initialValue = current_values.reduce((sum, val) => sum + val, 0);
        initialValues.push(initialValue);

        const gaPayload = {
          costs: problem.costs,
          weights: problem.weights,
          lengths: problem.costs.map((cost) => cost.length),
          maximum_weights: maxKnapsackWeights,
          population_size: gaConfig.population_size,
          generations: gaConfig.generations,
          cross_over_rate: gaConfig.cross_over_rate,
          mutation_rate: gaConfig.mutation_rate,
          keep_individuals: gaConfig.keep_individuals,
        };

        try {
          const startTime = performance.now();
          const response = await sendGeneticAlgorithmData(gaPayload);
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          configExecutionTime += executionTime;

          console.log(`GA Experiment ${i + 1} Response:`, response);

          if (response?.solutions && response.solutions.length > 0) {
            const finalValue = response.solutions.reduce(
              (sum: number, sol: any) => {
                return sum + (sol.final_value || 0);
              },
              0,
            );

            configResults.push(finalValue);
            improvements.push(finalValue - initialValue);
          } else {
            console.warn(`GA Experiment ${i + 1} returned no valid solutions`);
            configResults.push(initialValue);
            improvements.push(0);
          }
        } catch (error) {
          console.error(`Error in GA experiment ${i + 1}:`, error);
          configResults.push(initialValue);
          improvements.push(0);
        }
      }

      // Calculate statistics
      const averageValue =
        configResults.reduce((sum, val) => sum + val, 0) / configResults.length;
      const bestValue = Math.max(...configResults);
      const worstValue = Math.min(...configResults);
      const variance =
        configResults.reduce(
          (sum, val) => sum + Math.pow(val - averageValue, 2),
          0,
        ) / configResults.length;
      const standardDeviation = Math.sqrt(variance);
      const averageImprovement =
        improvements.reduce((sum, val) => sum + val, 0) / improvements.length;

      totalImprovement += averageImprovement;
      totalExecutionTime += configExecutionTime;

      if (averageValue > bestOverallValue) {
        bestOverallValue = averageValue;
        bestConfiguration = gaConfig;
      }

      experiments.push({
        config: gaConfig,
        results: configResults,
        averageValue,
        bestValue,
        worstValue,
        standardDeviation,
        improvements,
        executionTime: configExecutionTime,
        convergenceGeneration: Math.floor(gaConfig.generations * 0.8),
      });
    }

    return {
      experiments,
      bestConfiguration,
      summary: {
        totalExperiments: gaConfigurations.length,
        bestOverallValue,
        averageImprovement: totalImprovement / gaConfigurations.length,
        totalExecutionTime,
        averageExecutionTime:
          totalExecutionTime / (gaConfigurations.length * 20),
      },
      comparisonAnalysis: {
        populationImpact: this.analyzePopulationImpact(experiments),
        generationImpact: this.analyzeGenerationImpact(experiments),
        crossoverImpact: this.analyzeCrossoverImpact(experiments),
        mutationImpact: this.analyzeMutationImpact(experiments),
        eliteImpact: this.analyzeEliteImpact(experiments),
      },
    };
  }

  // Add these helper methods for analysis
  private analyzePopulationImpact(experiments: GAExperimentResult[]): string {
    const smallPop = experiments.filter(
      (exp) => exp.config.population_size <= 100,
    );
    const largePop = experiments.filter(
      (exp) => exp.config.population_size > 100,
    );

    const smallAvg =
      smallPop.reduce((sum, exp) => sum + exp.averageValue, 0) /
      smallPop.length;
    const largeAvg =
      largePop.reduce((sum, exp) => sum + exp.averageValue, 0) /
      largePop.length;

    return largeAvg > smallAvg
      ? 'Populações maiores tendem a produzir melhores resultados'
      : 'Populações menores são mais eficientes para este problema';
  }

  private analyzeGenerationImpact(experiments: GAExperimentResult[]): string {
    const fewGen = experiments.filter((exp) => exp.config.generations <= 200);
    const manyGen = experiments.filter((exp) => exp.config.generations > 200);

    if (fewGen.length === 0 || manyGen.length === 0) {
      return 'Dados insuficientes para análise de gerações';
    }

    const fewAvg =
      fewGen.reduce((sum, exp) => sum + exp.averageValue, 0) / fewGen.length;
    const manyAvg =
      manyGen.reduce((sum, exp) => sum + exp.averageValue, 0) / manyGen.length;

    return manyAvg > fewAvg
      ? 'Mais gerações levam a melhores soluções'
      : 'Poucas gerações são suficientes para este problema';
  }

  private analyzeCrossoverImpact(experiments: GAExperimentResult[]): string {
    const lowCross = experiments.filter(
      (exp) => exp.config.cross_over_rate <= 0.7,
    );
    const highCross = experiments.filter(
      (exp) => exp.config.cross_over_rate > 0.7,
    );

    if (lowCross.length === 0 || highCross.length === 0) {
      return 'Taxa de cruzamento padrão (0.7) é adequada';
    }

    const lowAvg =
      lowCross.reduce((sum, exp) => sum + exp.averageValue, 0) /
      lowCross.length;
    const highAvg =
      highCross.reduce((sum, exp) => sum + exp.averageValue, 0) /
      highCross.length;

    return highAvg > lowAvg
      ? 'Taxa de cruzamento alta melhora os resultados'
      : 'Taxa de cruzamento baixa é mais eficaz';
  }

  private analyzeMutationImpact(experiments: GAExperimentResult[]): string {
    const lowMut = experiments.filter(
      (exp) => exp.config.mutation_rate <= 0.01,
    );
    const highMut = experiments.filter(
      (exp) => exp.config.mutation_rate > 0.01,
    );

    if (lowMut.length === 0 || highMut.length === 0) {
      return 'Taxa de mutação padrão (0.01) é adequada';
    }

    const lowAvg =
      lowMut.reduce((sum, exp) => sum + exp.averageValue, 0) / lowMut.length;
    const highAvg =
      highMut.reduce((sum, exp) => sum + exp.averageValue, 0) / highMut.length;

    return highAvg > lowAvg
      ? 'Taxa de mutação alta previne convergência prematura'
      : 'Taxa de mutação baixa é mais estável';
  }

  private analyzeEliteImpact(experiments: GAExperimentResult[]): string {
    const lowElite = experiments.filter(
      (exp) => exp.config.keep_individuals <= 0.1,
    );
    const highElite = experiments.filter(
      (exp) => exp.config.keep_individuals > 0.1,
    );

    if (lowElite.length === 0 || highElite.length === 0) {
      return 'Elitismo padrão (10%) é adequado';
    }

    const lowAvg =
      lowElite.reduce((sum, exp) => sum + exp.averageValue, 0) /
      lowElite.length;
    const highAvg =
      highElite.reduce((sum, exp) => sum + exp.averageValue, 0) /
      highElite.length;

    return highAvg > lowAvg
      ? 'Maior elitismo acelera convergência'
      : 'Menor elitismo mantém diversidade';
  }

  public async exportReport(reportData: {
    problemConfig: ProblemConfig;
    individualResults: Partial<ExperimentResults>;
    allResults: AllResults[];
    gaReportData: GAReportData | null;
  }): Promise<void> {
    try {
      // Create a comprehensive report object
      const completeReport = {
        metadata: {
          exportDate: new Date().toISOString(),
          projectName: 'Sistema de Otimização - Problemas da Mochila',
          version: '1.0.0',
          totalExperiments: 20,
        },
        configuration: reportData.problemConfig,
        basicMethods: {
          hasData:
            reportData.individualResults &&
            Object.keys(reportData.individualResults).length > 0,
          results: reportData.individualResults,
          summary: this.generateBasicMethodsSummary(
            reportData.individualResults,
          ),
        },
        geneticAlgorithms: {
          hasData: reportData.gaReportData !== null,
          results: reportData.gaReportData,
          summary: reportData.gaReportData
            ? this.generateGASummary(reportData.gaReportData)
            : null,
        },
        allMethodsComparison: {
          hasData: reportData.allResults && reportData.allResults.length > 0,
          results: reportData.allResults,
          summary: this.generateComparisonSummary(reportData.allResults),
        },
        analysis: {
          bestOverallMethod: this.findBestMethod(reportData),
          recommendations: this.generateRecommendations(reportData),
          statisticalAnalysis: this.generateStatisticalAnalysis(reportData),
        },
      };

      // Convert to JSON string with pretty formatting
      const jsonString = JSON.stringify(completeReport, null, 2);

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `optimization-report-${timestamp}.json`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up
      window.URL.revokeObjectURL(url);

      console.log('Report exported successfully:', filename);
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }

  // Helper methods for generating summaries
  private generateBasicMethodsSummary(
    individualResults: Partial<ExperimentResults>,
  ) {
    if (!individualResults) return null;

    const summary: any = {};

    // Process each method
    Object.entries(individualResults).forEach(([methodName, results]) => {
      if (Array.isArray(results) && results.length > 0) {
        const values = results.filter(
          (val) => typeof val === 'number' && !isNaN(val),
        );
        if (values.length > 0) {
          summary[methodName] = {
            count: values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            average: values.reduce((sum, val) => sum + val, 0) / values.length,
            standardDeviation: this.calculateStandardDeviation(values),
          };
        }
      }
    });

    return summary;
  }

  private generateGASummary(gaReportData: GAReportData) {
    return {
      totalConfigurations: gaReportData.experiments.length,
      bestConfiguration: gaReportData.bestConfiguration,
      bestValue: gaReportData.summary.bestOverallValue,
      averageImprovement: gaReportData.summary.averageImprovement,
      totalExecutionTime: gaReportData.summary.totalExecutionTime,
      averageExecutionTime: gaReportData.summary.averageExecutionTime,
      configurationComparison: gaReportData.experiments.map((exp) => ({
        config: exp.config,
        performance: {
          average: exp.averageValue,
          best: exp.bestValue,
          worst: exp.worstValue,
          standardDeviation: exp.standardDeviation,
          executionTime: exp.executionTime,
        },
      })),
    };
  }

  private generateComparisonSummary(allResults: AllResults[]) {
    const methodGroups: { [key: string]: number[] } = {};

    allResults.forEach((result) => {
      if (!methodGroups[result.method]) {
        methodGroups[result.method] = [];
      }
      if (typeof result.newValue === 'number') {
        methodGroups[result.method].push(result.newValue);
      }
    });

    const summary: any = {};
    Object.entries(methodGroups).forEach(([method, values]) => {
      if (values.length > 0) {
        summary[method] = {
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          standardDeviation: this.calculateStandardDeviation(values),
        };
      }
    });

    return summary;
  }

  private findBestMethod(reportData: {
    individualResults: Partial<ExperimentResults>;
    gaReportData: GAReportData | null;
    allResults: AllResults[];
  }) {
    let bestMethod = { name: 'Unknown', value: -Infinity, type: 'unknown' };

    // Check basic methods
    if (reportData.individualResults) {
      Object.entries(reportData.individualResults).forEach(
        ([methodName, results]) => {
          if (Array.isArray(results) && results.length > 0) {
            const maxValue = Math.max(
              ...results.filter((val) => typeof val === 'number'),
            );
            if (maxValue > bestMethod.value) {
              bestMethod = { name: methodName, value: maxValue, type: 'basic' };
            }
          }
        },
      );
    }

    // Check genetic algorithms
    if (reportData.gaReportData) {
      const gaMaxValue = reportData.gaReportData.summary.bestOverallValue;
      if (gaMaxValue > bestMethod.value) {
        bestMethod = {
          name: 'Genetic Algorithm',
          value: gaMaxValue,
          type: 'genetic',
          config: reportData.gaReportData.bestConfiguration,
        };
      }
    }

    return bestMethod;
  }

  private generateRecommendations(reportData: {
    individualResults: Partial<ExperimentResults>;
    gaReportData: GAReportData | null;
    allResults: AllResults[];
  }): string[] {
    const recommendations: string[] = [];

    // Basic recommendations based on data availability
    if (
      reportData.individualResults &&
      Object.keys(reportData.individualResults).length > 0
    ) {
      recommendations.push('Métodos básicos foram executados com sucesso.');
    }

    if (reportData.gaReportData) {
      recommendations.push(
        'Algoritmos genéticos mostraram resultados promissores.',
      );
      recommendations.push(
        `Melhor configuração: População ${reportData.gaReportData.bestConfiguration.population_size}, Gerações ${reportData.gaReportData.bestConfiguration.generations}`,
      );
    }

    if (reportData.allResults && reportData.allResults.length > 0) {
      recommendations.push(
        'Dados de comparação entre métodos estão disponíveis.',
      );
    }

    const bestMethod = this.findBestMethod(reportData);
    if (bestMethod.name !== 'Unknown') {
      recommendations.push(
        `Melhor método encontrado: ${
          bestMethod.name
        } com valor ${bestMethod.value.toFixed(2)}`,
      );
    }

    return recommendations;
  }

  private generateStatisticalAnalysis(reportData: {
    individualResults: Partial<ExperimentResults>;
    gaReportData: GAReportData | null;
    allResults: AllResults[];
  }) {
    const analysis = {
      dataQuality: {
        basicMethodsComplete:
          reportData.individualResults &&
          Object.keys(reportData.individualResults).length > 0,
        geneticAlgorithmsComplete: reportData.gaReportData !== null,
        comparisonDataAvailable:
          reportData.allResults && reportData.allResults.length > 0,
      },
      experimentCounts: {
        basicMethods: reportData.individualResults
          ? Object.keys(reportData.individualResults).length
          : 0,
        geneticConfigurations: reportData.gaReportData
          ? reportData.gaReportData.experiments.length
          : 0,
        comparisonResults: reportData.allResults
          ? reportData.allResults.length
          : 0,
      },
    };

    return analysis;
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;

    return Math.sqrt(variance);
  }

  // Alternative export method for CSV format
  public async exportReportAsCSV(reportData: {
    problemConfig: ProblemConfig;
    individualResults: Partial<ExperimentResults>;
    allResults: AllResults[];
    gaReportData: GAReportData | null;
  }): Promise<void> {
    try {
      let csvContent = 'Method,Experiment,Value,Type\n';

      // Add basic methods data
      if (reportData.individualResults) {
        Object.entries(reportData.individualResults).forEach(
          ([methodName, results]) => {
            if (Array.isArray(results)) {
              results.forEach((value, index) => {
                csvContent += `${methodName},${index + 1},${value},basic\n`;
              });
            }
          },
        );
      }

      // Add genetic algorithm data
      if (reportData.gaReportData) {
        reportData.gaReportData.experiments.forEach((exp, configIndex) => {
          exp.results.forEach((value, expIndex) => {
            csvContent += `GA_Config_${configIndex + 1},${
              expIndex + 1
            },${value},genetic\n`;
          });
        });
      }

      // Create and download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `optimization-report-${timestamp}.csv`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('CSV report exported successfully:', filename);
    } catch (error) {
      console.error('Error exporting CSV report:', error);
      throw new Error('Failed to export CSV report');
    }
  }

  private async processHillClimbing(
    payloadBase: PayloadBase,
    initialValue: number,
  ): Promise<number> {
    try {
      const response = await handleSlopeClimbingMethod(payloadBase);
      console.log('Hill Climbing Response:', response);

      if (response[0]?.current_values) {
        return response[0].current_values.reduce(
          (sum: number, val: number) => sum + val,
          0,
        );
      } else {
        console.warn(
          'Hill Climbing returned undefined current_values, using initial value',
        );
        return initialValue;
      }
    } catch (error) {
      console.error('Error in Hill Climbing:', error);
      return initialValue;
    }
  }

  private async processHillClimbingTry(
    payloadBase: PayloadBase,
    Tmax: number,
    initialValue: number,
    methodName: string,
  ): Promise<number> {
    try {
      const response = await handleSlopeClimbingTryMethod({
        ...payloadBase,
        Tmax,
      });
      console.log(`${methodName} Response:`, response);

      if (response[0]?.current_values) {
        return response[0].current_values.reduce(
          (sum: number, val: number) => sum + val,
          0,
        );
      } else {
        console.warn(
          `${methodName} returned undefined current_values, using initial value`,
        );
        return initialValue;
      }
    } catch (error) {
      console.error(`Error in ${methodName}:`, error);
      return initialValue;
    }
  }

  private async processSimulatedAnnealing(
    payloadBase: PayloadBase,
    config: { finalTemp: number; initialTemp: number; reducer: number },
    initialValue: number,
    configKey: string,
  ): Promise<number> {
    try {
      const response = await handleTemperatureMethod({
        ...payloadBase,
        final_temperature: config.finalTemp,
        initial_temperature: config.initialTemp,
        reducer_factor: config.reducer,
      });

      if (response[0]?.current_values) {
        return response[0].current_values.reduce(
          (sum: number, val: number) => sum + val,
          0,
        );
      } else {
        console.warn(
          `Annealing ${configKey} returned undefined current_values, using initial value`,
        );
        return initialValue;
      }
    } catch (error) {
      console.error(`Error in annealing config ${configKey}:`, error);
      return initialValue;
    }
  }

  private processAllMethodsResponse(
    res: ResultAllMethodsItem,
    hillClimbingResults: number[],
    hillClimbingNAttemptsResults: number[],
    hillClimbing2NAttemptsResults: number[],
    temperaResults: number[],
  ): void {
    const methodName = res.method || 'unknown';
    let methodValue = 0;
    let hasValidValue = false;

    // Check if current_values exists and is an array
    if (res.current_values && Array.isArray(res.current_values)) {
      methodValue = res.current_values.reduce(
        (sum: number, val: number) => sum + (val || 0),
        0,
      );
      hasValidValue = true;
    }
    // Check if current_values is a number
    else if (typeof res.current_values === 'number') {
      methodValue = res.current_values;
      hasValidValue = true;
    }

    // Only process methods that have valid values
    if (hasValidValue) {
      console.log(`Method: ${methodName}, Value: ${methodValue}`);

      switch (methodName) {
        case 'slope_climbing':
          hillClimbingResults.push(methodValue);
          break;
        case 'slope_climbing_try_again':
          hillClimbingNAttemptsResults.push(methodValue);
          break;
        case 'slope_climbing_try_again_2n':
          hillClimbing2NAttemptsResults.push(methodValue);
          break;
        case 'tempera':
          temperaResults.push(methodValue);
          break;
      }
    } else {
      console.warn(
        `Method ${methodName} has undefined current_values, skipping`,
      );
    }
  }
}
