export type CalcParams = {
  coefficient_inequality: number[][];
  right_hand_inequality: number[];
  objective: number[];
  bounds: number[][];
};

export type GenerateKnapsackProblemParams = {
  knapsacks_length: number;
  min_weight: number;
  max_weight: number;
  max_weights: number[];
};

export type InitialBagSolutionParams = {
  knapsacks_length: number;
  weights: number;
  max_weights: number[];
};

export type EvaluateBagSolutionParams = {
  bags: {
    solution: number[];
    weights: number[];
    costs: number[];
  }[];
};

export type SlopeClimbingParams = {
  solutions: number[];
  weights: number[];
  costs: number[];
  max_weights: number[];
  current_values: number[];
};

export type SlopeClimbingTryParams = {
  Tmax: number;
} & SlopeClimbingParams;

export type TemperatureParams = {
  costs: number[];
  weights: number[];
  solutions: number[];
  max_weights: number[];
  reducer_factor: number;
  initial_temperature: number;
  final_temperature: number;
  Tmax: number;
};
