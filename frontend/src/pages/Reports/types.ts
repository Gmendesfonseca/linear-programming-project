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