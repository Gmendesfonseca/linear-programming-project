import {
  CalcParams,
  GenerateKnapsackProblemParams,
  InitialBagSolutionParams,
  EvaluateBagSolutionParams,
} from './types';

const BASE_URL = 'http://localhost:5000';

export async function calc({
  bounds,
  coefficient_inequality,
  right_hand_inequality,
  objective,
}: CalcParams) {
  const response = await fetch(`${BASE_URL}/calc/simplex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bounds,
      coefficient_inequality,
      right_hand_inequality,
      objective,
    }),
  });
  const data = await response.json();
  return data;
}

export async function generateKnapsackProblem({
  knapsacks_length,
  min_weight,
  max_weight,
}: GenerateKnapsackProblemParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/problem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      knapsacks_length: knapsacks_length,
      min_weight: min_weight,
      max_weight: max_weight,
    }),
  });
  const data = await response.json();
  return data;
}

export async function initialBagSolution({
  knapsacks_length,
  weights,
  max_weights,
}: InitialBagSolutionParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/initial_solution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      knapsacks_length: knapsacks_length,
      weights: weights,
      max_weights: max_weights,
    }),
  });
  const data = await response.json();
  return data;
}

export async function evaluateBagSolution({
  knapsacks,
}: EvaluateBagSolutionParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/evaluate_solution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ knapsacks }),
  });
  const data = await response.json();
  return data;
}

export async function sendSlopeClimbingData({
  max_weights,
  weights,
  costs,
  solutions,
  current_values,
}: {
  max_weights: number[];
  weights: number[];
  costs: number[];
  solutions: number[];
  current_values: number[];
}) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/slope_climb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      max_weights,
      weights,
      costs,
      solutions,
      current_values,
    }),
  });
  const data = await response.json();
  return data;
}
