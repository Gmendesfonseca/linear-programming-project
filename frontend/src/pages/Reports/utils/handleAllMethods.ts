import { AllMethodsParams, AllResponseData } from '@/service/types';
import { MethodsOption, ResultAllMethodsItem } from '../types';
import {
  sendAllMethodsData,
  sendSlopeClimbingTryData,
} from '@/service/requests';

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
