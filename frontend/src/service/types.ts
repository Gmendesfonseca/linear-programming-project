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
  solution: number[][];
} & KnapsackProblem;

export type GenerateKnapsackProblemParams = {
  maximum_weight: number;
  minimum_weight: number;
  knapsacks_length: number[];
};

export type InitialBagSolutionParams = {
  weights: number[];
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
} & SlopeClimbingTryParams;
