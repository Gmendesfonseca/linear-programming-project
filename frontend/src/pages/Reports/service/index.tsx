import {
  handleSlopeClimbingMethod,
  handleSlopeClimbingTryMethod,
  handleTemperatureMethod,
} from '@/pages/BasicMethods/helpers';
import { useKnapsackSetup } from '@/pages/BasicMethods/hooks/useKnapsackSetup';
import {
  sendAllMethodsData,
  sendSlopeClimbingTryData,
} from '@/service/requests';
import { AllMethodsParams, AllResponseData } from '@/service/types';

interface ProblemConfig {
  problemType: string;
  solutionType: string;
  minLimit: number;
  maxLimit: number;
  problemSize: number;
  capacity: number;
}

interface ExperimentResults {
  initialSolutions: number[];
  hillClimbing: number[];
  hillClimbingNAttempts: number[];
  hillClimbing2NAttempts: number[];
  temperaResults: number[];
  simulatedAnnealing: { [key: string]: number[] };
}

type MethodsOption =
  | 'slope_climbing'
  | 'slope_climbing_try_again'
  | 'slope_climbing_try_again_2n'
  | 'tempera';

type AllResults = {
  method: string;
  newValue: number[];
  newSolution: number[][];
  currentValues: number[];
  initialSolution: number[][];
  weights: number[][];
  costs: number[][];
};

interface ResultAllMethodsItem {
  method: MethodsOption;
  solutions: number[][];
  current_values: number[];
}

interface PayloadBase {
  costs: number[][];
  weights: number[][];
  solutions: number[][];
  current_values: number[];
  maximum_weights: number[];
}

export async function handleAllMethods(
  payload: AllMethodsParams,
): Promise<ResultAllMethodsItem[]> {
  try {
    // First, call the original all methods endpoint
    const response: AllResponseData = await sendAllMethodsData(payload);

    console.log('All methods API response:', response);

    // Then make additional call for 2N attempts
    const slope2NResponse = await sendSlopeClimbingTryData({
      Tmax: payload.Tmax * 2, // Double the Tmax for 2N attempts
      costs: payload.costs,
      weights: payload.weights,
      solutions: payload.solutions,
      maximum_weights: payload.maximum_weights,
      current_values: payload.current_values,
    });

    console.log('2N slope climbing response:', slope2NResponse);

    // Check the actual structure of the response and adjust accordingly
    const results: ResultAllMethodsItem[] = [];

    // Handle slope_climbing -> "Subida de Encosta"
    if (response.slope_climbing) {
      results.push({
        method: 'slope_climbing' as MethodsOption,
        solutions: response.slope_climbing.solutions,
        current_values: response.slope_climbing.current_values,
      });
    }

    // Handle slope_climbing_try -> "Subida de Encosta N Tentativas"
    if (response.slope_climbing_try) {
      results.push({
        method: 'slope_climbing_try_again' as MethodsOption,
        solutions: response.slope_climbing_try.solutions,
        current_values: response.slope_climbing_try.current_values,
      });
    }

    // Handle temperature -> "Tempera Simulada"
    if (response.temperature) {
      results.push({
        method: 'tempera' as MethodsOption,
        solutions: response.temperature.solutions,
        current_values: response.temperature.current_values,
      });
    }

    // Handle 2N attempts -> "Subida de Encosta 2N Tentativas"
    if (slope2NResponse) {
      results.push({
        method: 'slope_climbing_try_again_2n' as MethodsOption,
        solutions: slope2NResponse.solutions,
        current_values: slope2NResponse.current_values,
      });
    }

    console.log('Formatted results:', results);
    return results;
  } catch (error) {
    console.error('Error in handleAllMethods:', error);
    // Return empty results on error
    return [];
  }
}

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

// Statistics calculation utility
export function calculateStats(values: number[]): {
  min: number;
  max: number;
  avg: number;
  std: number;
} {
  if (values.length === 0) return { min: 0, max: 0, avg: 0, std: 0 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length,
  );

  return { min, max, avg, std };
}

// Method results preparation utility
export function prepareMethodResults(results: ExperimentResults): Array<{
  name: string;
  data: number[];
  stats: { min: number; max: number; avg: number; std: number };
}> {
  const baseResults = [
    { name: 'Soluções Iniciais', data: results.initialSolutions },
    { name: 'Subida de Encosta', data: results.hillClimbing },
    {
      name: 'Subida de Encosta N Tentativas',
      data: results.hillClimbingNAttempts,
    },
    {
      name: 'Subida de Encosta 2N Tentativas',
      data: results.hillClimbing2NAttempts,
    },
    {
      name: 'Tempera Simulada',
      data: results.temperaResults,
    },
  ];

  const annealingResults = Object.entries(results.simulatedAnnealing).map(
    ([key, data]) => ({
      name: `Tempera Simulada ${key.replace('annealing', '')}`,
      data,
    }),
  );

  return [...baseResults, ...annealingResults].map((method) => ({
    ...method,
    stats: calculateStats(method.data),
  }));
}
