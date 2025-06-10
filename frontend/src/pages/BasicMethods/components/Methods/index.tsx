import { MethodParam } from '@/types';
import { Encosta } from '../Encosta';
import { Tempera } from '../Tempera';
import './styles.css';
import { Method } from '@/pages/BasicMethods/helpers';

export interface Option {
  value: string;
  label: string;
}

interface MethodsComponentProps extends MethodParam {
  options: Option[];
  method: Method | 'default';
  setMethod: React.Dispatch<React.SetStateAction<Method | 'default'>>;
}

export const Methods = ({
  options,
  method,
  setMethod,
  register,
}: MethodsComponentProps) => {
  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(event.target.value as Method);
  };

  return (
    <>
      <div className="methods">
        <h1>Métodos Básicos</h1>
        <select onChange={handleMethodChange} value={method}>
          <option value={'default'}>Selecione um método</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {method !== 'default' && method !== Method.SLOPE_CLIMBING && (
        <div
          className="flex flex-col items-center bg-gray-100 w-full h-fit"
          style={{ padding: '16px 0' }}
        >
          {method === Method.SLOPE_CLIMBING_TRY_AGAIN && (
            <Encosta register={register} />
          )}
          {method === Method.TEMPERA && <Tempera register={register} />}
        </div>
      )}
    </>
  );
};
