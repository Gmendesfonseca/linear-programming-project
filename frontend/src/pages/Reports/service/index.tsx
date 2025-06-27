import {
  handleSlopeClimbingMethod,
  handleSlopeClimbingTryMethod,
  handleTemperatureMethod,
} from '@/pages/BasicMethods/helpers';
import { useKnapsackSetup } from '@/pages/BasicMethods/hooks/useKnapsackSetup';
import {
  AllResults,
  ExperimentResults,
  PayloadBase,
  ProblemConfig,
  ResultAllMethodsItem,
} from '../types';
import { handleAllMethods } from '../utils/handleAllMethods';
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
