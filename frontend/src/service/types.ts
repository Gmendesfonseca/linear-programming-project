import { ResponseData } from '@/interfaces';

export type CalcParams = {
  bounds: number[][];
  objective: number[];
  right_hand_inequality: number[];
  coefficient_inequality: number[][];
};

export type KnapsackProblem = {
  weights: number[][];
  costs: number[][];
};

export type Knapsacks = {
  solutions: number[][];
} & KnapsackProblem;

export type GenerateKnapsackProblemParams = {
  maximum_weight: number;
  minimum_weight: number;
  knapsacks_length: number[];
};

export type InitialBagSolutionParams = {
  weights: number[][];
  maximum_weights: number[];
  knapsacks_length: number[];
};

export type EvaluateBagSolutionParams = {
  knapsacks: Knapsacks[];
};

export type SlopeClimbingParams = {
  maximum_weights: number[];
  current_values: number[];
} & Knapsacks;

export type SlopeClimbingTryParams = {
  Tmax: number;
} & SlopeClimbingParams;

export type TemperatureParams = {
  reducer_factor: number;
  initial_temperature: number;
  final_temperature: number;
} & SlopeClimbingParams;

export type AllMethodsParams = {
  Tmax: number;
} & TemperatureParams;

export type AllResponseData = {
  slope_climbing: ResponseData;
  slope_climbing_try: ResponseData;
  temperature: ResponseData;
};

// API Response Types
export type MethodResponseData = {
  solutions: number[][];
  current_values: number[];
};

// Individual method response types
export type SlopeClimbingResponse = MethodResponseData;
export type SlopeClimbingTryResponse = MethodResponseData;
export type TemperatureResponse = MethodResponseData;

// Problem generation response
export type GenerateKnapsackProblemResponse = {
  problem: {
    costs: number[][];
    weights: number[][];
    knapsacks_length: number[];
    minimum_weight: number;
    maximum_weight: number;
  };
};

// Initial solution response
export type InitialSolutionResponse = {
  solutions: number[][];
};

// Evaluation response
export type EvaluationResponse = {
  current_values: number[];
};

// Genetic algorithm types
export interface GeneticAlgorithmParams {
  costs: number[][];
  lengths: number[];
  weights: number[][];
  maximum_weights: number[];
  generations?: number;
  mutation_rate?: number;
  population_size?: number;
  cross_over_rate?: number;
  keep_individuals?: number;
}

interface GeneticAlgorithmSolution {
  initial_solution: number[];
  final_solution: number[];
  initial_value: number;
  final_value: number;
}

export interface GeneticAlgorithmResponse {
  solutions: GeneticAlgorithmSolution[];
}
