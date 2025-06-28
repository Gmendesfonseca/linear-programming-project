export interface ProblemConfig {
  problemType: string;
  solutionType: string;
  minLimit: number;
  maxLimit: number;
  problemSize: number;
  capacity: number;
}

export interface ExperimentResults {
  initialSolutions: number[];
  hillClimbing: number[];
  hillClimbingNAttempts: number[];
  hillClimbing2NAttempts: number[];
  temperaResults: number[];
  simulatedAnnealing: { [key: string]: number[] };
}

export type MethodsOption =
  | 'slope_climbing'
  | 'slope_climbing_try_again'
  | 'slope_climbing_try_again_2n'
  | 'tempera';

export type AllResults = {
  method: string;
  newValue: number[];
  newSolution: number[][];
  currentValues: number[];
  initialSolution: number[][];
  weights: number[][];
  costs: number[][];
};

export interface ResultAllMethodsItem {
  method: MethodsOption;
  solutions: number[][];
  current_values: number[];
}

export interface PayloadBase {
  costs: number[][];
  weights: number[][];
  solutions: number[][];
  current_values: number[];
  maximum_weights: number[];
}

export interface ProblemConfig {
  problemType: string;
  solutionType: string;
  minLimit: number;
  maxLimit: number;
  problemSize: number;
  capacity: number;
}

export interface StatResult {
  min: number;
  max: number;
  avg: number;
  std: number;
}

export interface MethodResult {
  name: string;
  data: number[];
  stats: StatResult;
}

// Add these types to your existing types file

export interface GeneticAlgorithmConfig {
  population_size: number;
  generations: number;
  cross_over_rate: number;
  mutation_rate: number;
  keep_individuals: number;
}

export interface GAExperimentResult {
  config: GeneticAlgorithmConfig;
  results: number[];
  averageValue: number;
  bestValue: number;
  worstValue: number;
  standardDeviation: number;
  improvements: number[];
}

export interface ProblemConfig {
  problemType: string;
  solutionType: string;
  minLimit: number;
  maxLimit: number;
  problemSize: number;
  capacity: number;
}

export interface GeneticAlgorithmConfig {
  population_size: number;
  generations: number;
  cross_over_rate: number;
  mutation_rate: number;
  keep_individuals: number;
}

export interface GAExperimentResult {
  config: GeneticAlgorithmConfig;
  results: number[];
  averageValue: number;
  bestValue: number;
  worstValue: number;
  standardDeviation: number;
  improvements: number[];
  executionTime: number;
  convergenceGeneration: number;
}

export interface GAReportData {
  experiments: GAExperimentResult[];
  bestConfiguration: GeneticAlgorithmConfig;
  summary: {
    totalExperiments: number;
    bestOverallValue: number;
    averageImprovement: number;
    totalExecutionTime: number;
    averageExecutionTime: number;
  };
  comparisonAnalysis: {
    populationImpact: string;
    generationImpact: string;
    crossoverImpact: string;
    mutationImpact: string;
    eliteImpact: string;
  };
}

export interface MethodResult {
  name: string;
  stats: {
    min: number;
    max: number;
    avg: number;
    std: number;
  };
  executionTimes: number[];
  improvements: number[];
}

export type ReportTab = 'basic' | 'genetic' | 'comparison';
