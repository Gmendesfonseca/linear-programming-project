import { FormInputs } from '@/types';
import { Option } from './components/Methods';
import {
  sendAllMethodsData,
  sendSlopeClimbingData,
  sendSlopeClimbingTryData,
  sendTemperatureData,
} from '@/service/requests';
import {
  AllMethodsParams,
  SlopeClimbingParams,
  SlopeClimbingTryParams,
  TemperatureParams,
} from '@/service/types';

export const Method = {
  SLOPE_CLIMBING: 'slope_climbing',
  SLOPE_CLIMBING_TRY_AGAIN: 'slope_climbing_try_again',
  TEMPERA: 'tempera',
  ALL: 'all',
} as const;

export type Method = (typeof Method)[keyof typeof Method];

export const MethodsLabels: Record<Method, string> = {
  [Method.ALL]: 'Todos',
  [Method.TEMPERA]: 'Tempera',
  [Method.SLOPE_CLIMBING]: 'Subida de Encosta',
  [Method.SLOPE_CLIMBING_TRY_AGAIN]: 'Subida de Encosta c/Tentativa',
};

export const methodOptions: Option[] = [
  { value: Method.SLOPE_CLIMBING, label: MethodsLabels[Method.SLOPE_CLIMBING] },
  {
    value: Method.SLOPE_CLIMBING_TRY_AGAIN,
    label: MethodsLabels[Method.SLOPE_CLIMBING_TRY_AGAIN],
  },
  { value: Method.TEMPERA, label: MethodsLabels[Method.TEMPERA] },
  { value: Method.ALL, label: MethodsLabels[Method.ALL] },
];

export const defaultFormValues: Partial<FormInputs> = {
  Tmax: 10,
  reducer_factor: 0.95,
  initial_temperature: 10,
  final_temperature: 0.1,
  method: 'default',
};

export async function handleTemperatureMethod(payload: TemperatureParams) {
  return [await sendTemperatureData(payload)];
}

export async function handleSlopeClimbingTryMethod(
  payload: SlopeClimbingTryParams,
) {
  return [await sendSlopeClimbingTryData(payload)];
}

export async function handleSlopeClimbingMethod(payload: SlopeClimbingParams) {
  return [await sendSlopeClimbingData(payload)];
}

export async function handleAllMethods(payload: AllMethodsParams) {
  const { slope_climbing, slope_climbing_try, temperature } =
    await sendAllMethodsData(payload);
  return [
    { ...slope_climbing, method: Method.SLOPE_CLIMBING },
    { ...slope_climbing_try, method: Method.SLOPE_CLIMBING_TRY_AGAIN },
    { ...temperature, method: Method.TEMPERA },
  ];
}
