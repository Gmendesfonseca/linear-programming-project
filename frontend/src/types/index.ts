import { Method } from '@/pages/BasicMethods/helpers';
import { UseFormRegister } from 'react-hook-form';

export type FormInputs = {
  Tmax: number;
  reducer_factor: number;
  initial_temperature: number;
  final_temperature: number;
  method: Method | 'default';
};

export type MethodParam = {
  register: UseFormRegister<FormInputs>;
};
