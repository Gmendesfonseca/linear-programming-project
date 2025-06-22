import {
  CalcParams,
  GenerateKnapsackProblemParams,
  InitialBagSolutionParams,
  EvaluateBagSolutionParams,
  SlopeClimbingTryParams,
  SlopeClimbingParams,
  TemperatureParams,
  AllResponseData,
  AllMethodsParams,
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
  minimum_weight,
  maximum_weight,
}: GenerateKnapsackProblemParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/problem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      knapsacks_length,
      minimum_weight,
      maximum_weight,
    }),
  });
  const data = await response.json();
  return data;
}

export async function initialBagSolution({
  weights,
  maximum_weights,
  knapsacks_length,
}: InitialBagSolutionParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/initial_solution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weights,
      knapsacks_length,
      maximum_weights,
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
  costs,
  weights,
  solutions,
  maximum_weights,
  current_values,
}: SlopeClimbingParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/slope_climb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      maximum_weights,
      weights,
      costs,
      solutions,
      current_values,
    }),
  });
  const data = await response.json();
  return data;
}

export async function sendSlopeClimbingTryData({
  Tmax,
  costs,
  weights,
  solutions,
  maximum_weights,
  current_values,
}: SlopeClimbingTryParams) {
  const response = await fetch(
    `${BASE_URL}/calc/knapsack/slope_climb_try_again`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maximum_weights,
        weights,
        costs,
        solutions,
        current_values,
        Tmax,
      }),
    },
  );
  const data = await response.json();
  return data;
}

export async function sendTemperatureData({
  costs,
  weights,
  solutions,
  current_values,
  reducer_factor,
  maximum_weights,
  final_temperature,
  initial_temperature,
}: TemperatureParams) {
  const response = await fetch(`${BASE_URL}/calc/knapsack/tempera`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      costs,
      weights,
      solutions,
      maximum_weights,
      current_values,
      reducer_factor,
      initial_temperature,
      final_temperature,
    }),
  });
  const data = await response.json();
  return data;
}

export async function sendAllMethodsData(
  payload: AllMethodsParams,
): Promise<AllResponseData> {
  const response = await fetch(`${BASE_URL}/calc/knapsack/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
}
